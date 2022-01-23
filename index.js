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
    /* When player joins a room, send a message indicating so */
    socket.on("join room", (game_code, user) => {
        socket.join(game_code);
        socket.to(game_code).emit("message", "player connected");

        const clients = io.sockets.adapter.rooms.get(game_code);
        const numClients = clients ? clients.size : 0;
        
        console.debug(`
            Player: ${user} \n 
            Socket User: ${socket.id} \n 
            has joined room ${game_code}... \n
            There are now ${numClients-1} players
        `);
    });

    /* When the game starts, send a message indicating so */
    socket.on("start game", (game_code) => {
        socket.to(game_code).emit("message", "game started");
    });

    /* When a player disconnects, send a message indicating so */
    socket.on("disconnect", () => {
        console.debug(`
            Socket User: ${socket.id} has disconnected... \n
        `);
    });
});

require("./APIs/games_API")(app, pool, path);
require("./APIs/lobbys_API")(app, pool, path);

server.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
})