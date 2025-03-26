import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import Character from "../public/character.js";
const CANVAS_WIDTH = 1024;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });
app.use(express.static("public"));

let players = {};
const MAX_PLAYERS = 2;

io.on("connection", (socket) => {
    if (Object.keys(players).length >= MAX_PLAYERS) {
        socket.emit("playersFull");
        socket.disconnect(true);
        return;
    }

    console.log(`Player connected: ${socket.id}`);
    let num = Object.keys(players).length;
    let color = num === 1 ? "red" : "blue"; // First player = blue, Second player = red
    let xPosition;

    if (num === 0) {
        xPosition = CANVAS_WIDTH / 4; // First player at 1/4th of canvas
    } else {
        xPosition = (3 * CANVAS_WIDTH) / 4; // Second player at 3/4th of canvas
    }
    
    players[socket.id] = new Character(socket.id, xPosition, 400, color);
    socket.emit("currentPlayers", Object.values(players).map(p => p.serialize()));
    socket.broadcast.emit("newPlayer", players[socket.id].serialize());

    socket.on("move", (direction) => {
        if (players[socket.id]) {
            players[socket.id].move(direction);
            players[socket.id].update(); // Update position based on velocity
    
            // console.log(`Updated position for ${socket.id}: (${players[socket.id].x}, ${players[socket.id].y})`);
    
            io.emit("updatePlayer", players[socket.id].serialize()); // Send updated data
        }
    });
       
    socket.on("attack", () => {
        if (players[socket.id]) {
            players[socket.id].attack();
            io.emit("updatePlayer", players[socket.id].serialize());
        }
    });

    socket.on("disconnect", () => {
        console.log(`Player disconnected: ${socket.id}`);
        delete players[socket.id];
        io.emit("removePlayer", socket.id);
    });
});

httpServer.listen(5000, () => {
    console.log("Server running on port 5000");
});
