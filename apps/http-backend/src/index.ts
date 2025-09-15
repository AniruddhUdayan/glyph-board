import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types";
import { prisma } from "@repo/db/client";

const app = express();
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

        res.status(201).json({
            message: "User created successfully",
            userId: user.id
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
    res.json({ token });
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

app.get("/chats/:roomId", async (req, res) => {
    const roomId = req.params.roomId;
    if(!roomId) {
        return res.status(400).json({ message: "Invalid room id" });
    }
    const messages = await prisma.chat.findMany({
        where: {
            roomId: roomId
        },
        orderBy: {
            id: "desc"
        },
        take: 50
    })

    res.json({
        messages
    })
})



app.listen(3001, () => {
    console.log("Server is running on port 3001");
});