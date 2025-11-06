import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
const { CreateUserSchema, SigninSchema, CreateRoomSchema } = require("./schemas");
import { prisma } from "@repo/db/client";
import cors from "cors";

const app = express();

// CORS configuration for production
const corsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        // Allow requests with no origin (like mobile apps, Postman, or same-origin)
        if (!origin) return callback(null, true);

        // List of allowed origins
        const allowedOrigins = [
            'http://localhost:3002',
            'http://localhost:3000',
            'http://16.16.79.127',
            'http://16.16.79.127:3002',
            'http://16.16.79.127:3000',
            'http://glyph-board.xyz',
            'http://www.glyph-board.xyz',
            'https://glyph-board.xyz',
            'https://www.glyph-board.xyz',
        ];

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true); // For development, allow all origins
            // For production, use: callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello from http backend");
});

app.post("/signup", async (req, res) => {

    const data = CreateUserSchema.safeParse(req.body);
    if(!data.success) {
        return res.status(400).json({ message: "Invalid data" });
    }
    try {
        const user = await prisma.user.create({
            data: {
                email: data.data.email,
                password: data.data.password,
                name: data.data.name,
                photo: data.data.photo || "",
            }
        })

        const token = jwt.sign({ userId : user.id }, JWT_SECRET);
        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                photo: user.photo
            }
        })
    } catch (error) {
        return res.status(500).json({ message: "User already exists"});
    }
});

app.post("/signin", async (req, res) => {

    const data = SigninSchema.safeParse(req.body);
    if(!data.success) {
        return res.status(400).json({ message: "Invalid data" });
    }

    const user = await prisma.user.findUnique({
        where: {
            email: data.data.email,
        }
    })
    if(!user || user.password !== data.data.password) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId : user.id }, JWT_SECRET);
    res.json({ 
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            photo: user.photo
        }
    });
})

app.post('/room', middleware, async (req, res) => {

    const data = CreateRoomSchema.safeParse(req.body);
    if(!data.success) {
        return res.status(400).json({ message: "Invalid data" });
    }

    const userId = req.userId;
    if(!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });
    if(!user) {
        return res.status(401).json({ message: "User not found" });
    }
try {
    const room = await prisma.room.create({
        data: {
            slug: data.data.name,
            adminId: userId,
        }
    })

    res.json({
            roomId: room.id
        })
    } catch (error) {
        return res.status(500).json({ message: "Room already created" });       
    }
});

// app.get("/chats/:roomId",middleware, async (req, res) => {
//     const roomId = req.params.roomId;
//     if(!roomId) {
//         return res.status(400).json({ message: "Invalid room id" });
//     }
//     const userId = req.userId;
//     if(!userId) {
//         return res.status(401).json({ message: "Unauthorized" });
//     }
//     const messages = await prisma.chat.findMany({
//         where: {
//             roomId: roomId
//         },
//         orderBy: {
//             id: "desc"
//         },
//         take: 50
//     })

//     res.json({
//         messages
//     })
// })

app.get("/room/:roomId", middleware, async (req, res) => {
    const roomId = req.params.roomId;
    if(!roomId) {
        return res.status(400).json({ message: "Invalid room ID" });
    }
    
    try {
        const room = await prisma.room.findUnique({
            where: {
                id: roomId
            },
            select: {
                id: true,
                slug: true,
                createdAt: true,
                adminId: true,
                admin: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });
        
        if(!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        
        res.json({
            room
        });
    } catch (error) {
        console.error("Error fetching room:", error);
        return res.status(500).json({ message: "Failed to fetch room" });
    }
})

app.get("/user/rooms", middleware, async (req, res) => {
    const userId = req.userId;
    if(!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const rooms = await prisma.room.findMany({
            where: {
                adminId: userId
            },
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                slug: true,
                createdAt: true
            }
        });

        res.json({
            rooms
        });
    } catch (error) {
        console.error("Error fetching user rooms:", error);
        return res.status(500).json({ message: "Failed to fetch rooms" });
    }
})

app.delete("/room/:roomId", middleware, async (req, res) => {
    const roomId = req.params.roomId;
    const userId = req.userId;

    if (!roomId) {
        return res.status(400).json({ message: "Invalid room ID" });
    }

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        // First, check if the room exists and if the user is the admin
        const room = await prisma.room.findUnique({
            where: { id: roomId },
            select: { id: true, adminId: true, slug: true }
        });

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Check if the user is the admin of the room
        if (room.adminId !== userId) {
            return res.status(403).json({ message: "Only room admin can delete the room" });
        }

        // Delete the room (this will cascade delete related shapes due to onDelete: Cascade)
        await prisma.room.delete({
            where: { id: roomId }
        });

        res.json({
            message: "Room deleted successfully",
            roomId: roomId
        });

    } catch (error) {
        console.error("Error deleting room:", error);
        return res.status(500).json({ message: "Failed to delete room" });
    }
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});