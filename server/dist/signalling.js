"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSignaling = setupSignaling;
const ws_1 = require("ws");
function setupSignaling(server) {
    const wss = new ws_1.WebSocketServer({ server });
    const rooms = new Map();
    wss.on("connection", (ws) => {
        ws.on("message", (message) => {
            const data = JSON.parse(message.toString());
            switch (data.type) {
                case "join": {
                    const roomId = data.roomId;
                    if (!rooms.has(roomId))
                        rooms.set(roomId, []);
                    const room = rooms.get(roomId);
                    // ✅ Check room limit
                    if (room.length >= 2) {
                        ws.send(JSON.stringify({
                            type: "error",
                            message: "Room is full. Only 2 participants allowed.",
                        }));
                        ws.close();
                        return;
                    }
                    room.push(ws);
                    ws.roomId = roomId;
                    console.log(`Client joined room: ${roomId} (${room.length}/2)`);
                    // Notify both peers when the room is ready (2 people)
                    if (room.length === 2) {
                        room.forEach((peer) => {
                            if (peer.readyState === ws_1.WebSocket.OPEN) {
                                peer.send(JSON.stringify({
                                    type: "ready",
                                    message: "Both participants connected.",
                                }));
                            }
                        });
                    }
                    break;
                }
                case "signal": {
                    const roomId = ws.roomId;
                    const peers = rooms.get(roomId) || [];
                    peers.forEach((peer) => {
                        if (peer !== ws && peer.readyState === ws_1.WebSocket.OPEN) {
                            peer.send(JSON.stringify(data.payload));
                        }
                    });
                    break;
                }
            }
        });
        ws.on("close", () => {
            const roomId = ws.roomId;
            const room = rooms.get(roomId);
            if (room) {
                const updated = room.filter((p) => p !== ws);
                if (updated.length === 0) {
                    rooms.delete(roomId);
                }
                else {
                    rooms.set(roomId, updated);
                }
                console.log(`Client left room: ${roomId} (${updated.length}/2 left)`);
            }
        });
    });
    console.log("✅ WebSocket signaling server attached to port 3000");
}
