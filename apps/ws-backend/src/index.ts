import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws , request) => {

    const url = request.url;
    if(!url) {
        ws.close();
        return;
    }

    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token");
    if(!token) {
        ws.close();
        return;
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    if(!decoded) {
        ws.close();
        return;
    }

    ws.on('error', (error) => {
        console.error(error);
    });

    ws.on("message", (data) => {
        ws.send("Hello from server");
    })

   

});