import Character from "./character.js";

const socket = io('ws://localhost:5000');
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;
const gravity = 0.7;

const bgimg = new Image();
bgimg.src = 'https://i.pinimg.com/736x/d1/48/4d/d1484dae779822c963b264fab4790f1e.jpg';
bgimg.onload = () => c.drawImage(bgimg, 0, 0, canvas.width, canvas.height);

//const player = new Character(socket.id, 100, 400);
let characters = {};

socket.on('currentPlayers', (players) => {
    players.forEach(player => {
        characters[player.id] = new Character(player.id, player.x, player.y, player.color);
    });
    drawPlayers();
});

socket.on('newPlayer', (player) => {
    characters[player.id] = new Character(player.id, player.x, player.y, player.color);
    drawPlayers();
});

socket.on('updatePlayer', (player) => {
    if (characters[player.id]) {
        characters[player.id].x = player.x;  // Update X position
        characters[player.id].y = player.y;  // Update Y position
        drawPlayers();
    }
});

socket.on('removePlayer', (id) => {
    delete characters[id];
    drawPlayers();
});

document.addEventListener("keydown", (event) => {
    let direction = null;
    switch (event.key) {
        case "ArrowLeft":
            direction = "left";
            break;
        case "ArrowRight":
            direction = "right";
            break;
        case "ArrowUp":
            direction = "up";
            break;
        case "ArrowDown":
            direction = "down";
            break;
    }

    if (direction) {
        socket.emit("move", direction);
    }
});

document.addEventListener("keyup", () => {
    socket.emit("move", "stop");
});

function drawPlayers() {
    c.clearRect(0, 0, canvas.width, canvas.height); // Clear previous frame
    c.drawImage(bgimg, 0, 0, canvas.width, canvas.height); // Redraw background

    for (let id in characters) {
        characters[id].draw(c);
    }
}

function gameLoop() {
    drawPlayers();
    requestAnimationFrame(gameLoop); // Loop to update the game screen
}

socket.on('connect', () => {
    console.log("connected socket id", socket.id);
});

socket.on("playersFull", () => {
    alert("Players full! Try again later.");
});


gameLoop();
