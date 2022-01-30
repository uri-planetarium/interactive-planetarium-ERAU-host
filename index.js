const express = require("express"),
    cors = require("cors"), 
    pool = require("./APIs/database"),
    path = require("path"),
    app = express(),
    http = require("http"),
    server = http.createServer(app),
    socket = require("socket.io"),
    io = socket(server, { cors: { origin: "*" } }),
    PORT = process.env.PORT || 5001;

// middleware
app.use(cors());
app.use(express.json());

/* If in production mode, load the static content from 'host_client/build' */
if (process.env.NODE_ENV === "production") {
    console.log("In Production Mode");

    /* Serve our static content */
    app.use(express.static(path.join(__dirname, "host_client/build")));
} else {
    console.log("In Developer Mode");
}

/* Listen for socket.io connections and create the various connection listeners */
io.on('connection', socket => {
    var gameCode;
    var playerID;

    /* When player joins a room, send a message indicating so */
    socket.on("join room", (game_code, player_id) => {
        gameCode = game_code;
        playerID = player_id;

        socket.join(game_code);
        socket.to(game_code).emit("message", "player connected");

        /* Calculate how many users are in the room */
        const clients = io.sockets.adapter.rooms.get(game_code);
        const numClients = clients ? clients.size : 0;
        
        console.debug("~~~~~~~~ SOMETHING HAPPENED ~~~~~~~~");
        console.debug(`
            Player: ${player_id} \n
            Socket User: ${socket.id} \n 
            has joined room ${game_code}... \n
            There are now ${numClients-1} players
        `);
    });

    /* When the game starts, send a message indicating so */
    socket.on("start game", () => {
        socket.to(gameCode).emit("message", "game started");
    });

    /* When the browser closes, emit a goobye message to everyone before going */
    socket.onclose = () => {
        this.emit("disconnecting");
        this.emit("disconnect");
    };

    /* Once leaving the page, emit a message to everyone saying goodbye */
    socket.on("disconnecting", () => {
        socket.to(gameCode).emit("message", "player left");

        /* Calculate how many users are in the room */
        const clients = io.sockets.adapter.rooms.get(gameCode);
        const numClients = clients ? clients.size : 0;
        
        console.debug("~~~~~~~~ SOMETHING HAPPENED ~~~~~~~~");
        console.debug(`
            Player: ${playerID} \n
            Socket User: ${socket.id} \n 
            is attempting to leave room ${gameCode}... \n
            There are now ${numClients-2} players
        `);
    });

    /* When a player disconnects, send a message indicating so */
    socket.on("disconnect", () => {
        console.debug(`
            They left...
        `);
    });
});

require("./APIs/games_API")(app, pool, path);
require("./APIs/lobbys_API")(app, pool, path);

server.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
})