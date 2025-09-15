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

            if(parsedData.type === "send_message") {
                const roomId = parsedData.roomId;
                const message = parsedData.message;
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

                await prisma.chat.create({
                    data: {
                        roomId,
                        message,
                        userId: sender.userId,
                    }
                })

                // Send message to all users in the room (including sender)
                users.forEach((x) => {
                    if(x.rooms.includes(roomId)) {
                        x.ws.send(JSON.stringify({
                            type: "send_message",
                            message: message,
                            roomId,
                            senderId: sender.userId,
                            timestamp: new Date().toISOString()
                        }))
                    }
                })
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