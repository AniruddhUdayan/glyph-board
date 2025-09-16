import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prisma } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8081 });

console.log("WebSocket server started on port 8081");

interface User {
    ws: WebSocket;
    rooms: string[];
    userId: string;
}

const users: User[] = [];

const checkUser = (token: string) : string | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if(typeof decoded === "string") {
            return null;
        }

        if(!decoded ||!decoded.userId) {
            return null;
            }

            return decoded.userId;
    } catch (error) {
        return null;
    }
}

wss.on("connection", (ws , request) => {

    const url = request.url;
    if(!url) {
        ws.close();
        return;
    }

    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") || "";

    const userID = checkUser(token);
    if(!userID) {
        ws.close();
        return null;
    }

    users.push({
        userId: userID,
        rooms: [],
        ws,
    })

    ws.on("message", async (data) => {
       try {
           const parsedData = JSON.parse(data as unknown as string)

           if(parsedData.type === "join_room") {
                const user = users.find((x) => x.ws === ws);
                if(!user) {
                    return;
                }

                // Check if already in room
                if(user.rooms.includes(parsedData.roomId)) {
                    ws.send(JSON.stringify({
                        type: "error",
                        message: "Already in this room"
                    }));
                    return;
                }

                user.rooms.push(parsedData.roomId);
                ws.send(JSON.stringify({
                    type: "join_room_success",
                    roomId: parsedData.roomId
                }));
            }

            if(parsedData.type === "leave_room") {
                const user = users.find((x) => x.ws === ws);
                if(!user) {
                    return;
                }

                // Check if user is in the room
                if(!user.rooms.includes(parsedData.roomId)) {
                    ws.send(JSON.stringify({
                        type: "error",
                        message: "You are not in this room"
                    }));
                    return;
                }

                user.rooms = user?.rooms.filter((x) => x !== parsedData.roomId);
                ws.send(JSON.stringify({
                    type: "leave_room_success",
                    roomId: parsedData.roomId
                }));
            }

            // Handle shape creation/update
            if(parsedData.type === "shape_create" || parsedData.type === "shape_update") {
                const { roomId, shape } = parsedData;
                const sender = users.find((x) => x.ws === ws);

                if(!sender) {
                    return;
                }

                // Check if sender is in the room
                if(!sender.rooms.includes(roomId)) {
                    ws.send(JSON.stringify({
                        type: "error",
                        message: "You are not in this room"
                    }));
                    return;
                }

                try {
                    // Prepare type-specific data
                    let shapeData: any = null;
                    if (shape.type === 'line' || shape.type === 'pencil') {
                        shapeData = { points: shape.points || [] };
                    } else if (shape.type === 'arrow') {
                        shapeData = { 
                            startPoint: shape.startPoint || { x: shape.x, y: shape.y },
                            endPoint: shape.endPoint || { x: shape.x + shape.width, y: shape.y + shape.height }
                        };
                    } else if (shape.type === 'text') {
                        shapeData = { 
                            text: shape.text || '',
                            fontSize: shape.fontSize || 16,
                            fontFamily: shape.fontFamily || 'Arial'
                        };
                    }

                    // Upsert shape in database
                    await prisma.shape.upsert({
                        where: {
                            roomId_shapeId: {
                                roomId,
                                shapeId: shape.id
                            }
                        },
                        create: {
                            roomId,
                            userId: sender.userId,
                            shapeId: shape.id,
                            type: shape.type,
                            x: shape.x,
                            y: shape.y,
                            width: shape.width,
                            height: shape.height,
                            strokeColor: shape.strokeColor || '#000000',
                            fillColor: shape.fillColor || 'transparent',
                            strokeWidth: shape.strokeWidth || 2,
                            opacity: shape.opacity || 1,
                            angle: shape.angle || 0,
                            data: shapeData || undefined
                        },
                        update: {
                            x: shape.x,
                            y: shape.y,
                            width: shape.width,
                            height: shape.height,
                            strokeColor: shape.strokeColor || '#000000',
                            fillColor: shape.fillColor || 'transparent',
                            strokeWidth: shape.strokeWidth || 2,
                            opacity: shape.opacity || 1,
                            angle: shape.angle || 0,
                            data: shapeData || undefined
                        }
                    });

                    // Broadcast shape to all users in the room
                    users.forEach((x) => {
                        if(x.rooms.includes(roomId)) {
                            x.ws.send(JSON.stringify({
                                type: parsedData.type,
                                roomId,
                                shape,
                                senderId: sender.userId,
                                timestamp: new Date().toISOString()
                            }));
                        }
                    });
                } catch (error) {
                    console.error("Error saving shape:", error);
                    ws.send(JSON.stringify({
                        type: "error",
                        message: "Failed to save shape"
                    }));
                }
            }

            // Handle shape deletion
            if(parsedData.type === "shape_delete") {
                const { roomId, shapeId } = parsedData;
                const sender = users.find((x) => x.ws === ws);

                if(!sender) {
                    return;
                }

                // Check if sender is in the room
                if(!sender.rooms.includes(roomId)) {
                    ws.send(JSON.stringify({
                        type: "error",
                        message: "You are not in this room"
                    }));
                    return;
                }

                try {
                    // Delete shape from database
                    await prisma.shape.deleteMany({
                        where: {
                            roomId,
                            shapeId,
                            userId: sender.userId // Only allow user to delete their own shapes
                        }
                    });

                    // Broadcast deletion to all users in the room
                    users.forEach((x) => {
                        if(x.rooms.includes(roomId)) {
                            x.ws.send(JSON.stringify({
                                type: "shape_delete",
                                roomId,
                                shapeId,
                                senderId: sender.userId,
                                timestamp: new Date().toISOString()
                            }));
                        }
                    });
                } catch (error) {
                    console.error("Error deleting shape:", error);
                    ws.send(JSON.stringify({
                        type: "error",
                        message: "Failed to delete shape"
                    }));
                }
            }

            // Handle loading existing shapes when joining a room
            if(parsedData.type === "load_shapes") {
                const { roomId } = parsedData;
                const sender = users.find((x) => x.ws === ws);

                if(!sender) {
                    return;
                }

                // Check if sender is in the room
                if(!sender.rooms.includes(roomId)) {
                    ws.send(JSON.stringify({
                        type: "error",
                        message: "You are not in this room"
                    }));
                    return;
                }

                try {
                    // Load all shapes for the room
                    const shapes = await prisma.shape.findMany({
                        where: { roomId },
                        orderBy: { createdAt: 'asc' }
                    });

                    // Convert database shapes to frontend format
                    const formattedShapes = shapes.map(dbShape => {
                        const shape: any = {
                            id: dbShape.shapeId,
                            type: dbShape.type,
                            x: dbShape.x,
                            y: dbShape.y,
                            width: dbShape.width,
                            height: dbShape.height,
                            strokeColor: dbShape.strokeColor,
                            fillColor: dbShape.fillColor,
                            strokeWidth: dbShape.strokeWidth,
                            opacity: dbShape.opacity,
                            angle: dbShape.angle,
                            isSelected: false
                        };

                        // Add type-specific data
                        if (dbShape.data) {
                            const data = dbShape.data as any;
                            if (shape.type === 'text') {
                                shape.text = data.text || '';
                                shape.fontSize = data.fontSize || 16;
                                shape.fontFamily = data.fontFamily || 'Arial';
                            } else if (shape.type === 'arrow') {
                                shape.startPoint = data.startPoint || { x: shape.x, y: shape.y };
                                shape.endPoint = data.endPoint || { x: shape.x + shape.width, y: shape.y + shape.height };
                            } else if (shape.type === 'line' || shape.type === 'pencil') {
                                shape.points = data.points || [];
                            }
                        }

                        return shape;
                    });

                    // Send shapes to the requesting user
                    ws.send(JSON.stringify({
                        type: "shapes_loaded",
                        roomId,
                        shapes: formattedShapes,
                        timestamp: new Date().toISOString()
                    }));
                } catch (error) {
                    console.error("Error loading shapes:", error);
                    ws.send(JSON.stringify({
                        type: "error",
                        message: "Failed to load shapes"
                    }));
                }
            }
       } catch (error) {
           console.error("Invalid JSON received:", error);
           ws.send(JSON.stringify({
               type: "error",
               message: "Invalid JSON format"
           }));
       }
    })
});