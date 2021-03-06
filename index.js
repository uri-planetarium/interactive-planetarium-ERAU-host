const express = require("express"),
    cors = require("cors"), 
    pool = require("./APIs/database"),
    path = require("path"),
    app = express(),
    http = require("http"),
    fetch = require("node-fetch"),
    server = http.createServer(app),
    socket = require("socket.io"),
    io = socket(server, { 
        cors: (process.env.NODE_ENV === "production") ? "https://erau-interplanet-player.herokuapp.com/" : "http://localhost:3000" ,
        methods: ["GET", "POST", "DELETE", "PUT"],
        credentials: false
    }),
    PORT = process.env.PORT || 5001
    URL = (process.env.NODE_ENV === "production") ? "https://erau-interplanet-host.herokuapp.com" : "http://localhost:5001";

// middleware
app.use(cors());
app.use(express.json());

/* If in production mode, load the static content from 'host_client/build' */
if (process.env.NODE_ENV === "production") {
    console.debug("In Production Mode");

    /* Serve our static content */
    app.use(express.static(path.join(__dirname, "host_client/build")));
} else {
    console.debug("In Developer Mode");
}

//~~~~~~~~~~~~~~~~~~~~~~ SOCKET.IO ~~~~~~~~~~~~~~~~~~~~~~//

/* Listen for socket.io connections and create the various connection listeners */
io.on('connection', socket => {
    var gameCode;
    var playerID;

    /* When player joins a room, send a message indicating so */
    socket.on("join room", (game_code, player_id) => {
        gameCode = game_code;
        playerID = player_id;

        socket.join(game_code);
        socket.to(game_code).emit("connected");

        /* Calculate how many users are in the room */
        // const clients = io.sockets.adapter.rooms.get(game_code);
        // const numClients = clients ? clients.size : 0;
        
        // console.debug(`
        //     Player: ${player_id} \n
        //     Socket User: ${socket.id} \n 
        //     has joined room ${game_code}... \n
        //     There are now ${numClients-1} players
        // `);

        console.debug(` - User ${playerID} joined room ${gameCode}`);
    });

    /* When the game starts, send a message indicating so */
    socket.on("start game", () => {
        socket.to(gameCode).emit("game start");

        console.debug(` - Game ${gameCode} Started`);
    });

    /* When player want to leave the game, send a request to host */
    socket.on("leave game", () => {
        socket.to(gameCode).emit("removal request", playerID);

        console.debug(` - User ${playerID} Requested to leave game ${gameCode}`);
    });

    /* When player removal has been accepted, remove the player */
    socket.on("removal accepted", ({ removed_game_code, removed_player_id }) => {
        socket.to(gameCode).emit("removed", { 
            removed_game_code: removed_game_code, 
            removed_player_id: removed_player_id 
        });

        console.debug(` - User ${playerID} Accepted leave game request`);
    });

    /* When player chooses to leave room, remove them */
    socket.on("leave room", () => {
        socket.leave(gameCode);
        
        console.debug(` - User ${playerID} left room ${gameCode}`);
    });

    /* Once leaving the page, emit a message to everyone saying goodbye */
    socket.on("disconnecting", () => {
        if (playerID === "Host") {
            try {
                var response = fetch(`${URL}/api/lobbys/${gameCode}`, {
                    method: "DELETE"
                })
                .then(response => response.json());
        
                // If the removal all players query was a success, update the game to be inactive
                if  (!response.error) {
                    const body = { 
                        "is_active": "false", 
                        "is_playing": "false" 
                    };
        
                    response = fetch(`${URL}/api/games/${gameCode}`, {
                        method: "PUT",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(body)
                    })
                    .then(response => response.json());
        
                    if (!response.error) {
                        socket.to(gameCode).emit("removed", { 
                            removed_game_code: gameCode, 
                            removed_player_id: "all" 
                        });
                    }
                } else {
                    console.error(response.error.code);
                }
            } catch (error) {
                console.error(error.message);
            }
        }

        console.debug(` - User ${playerID} disconnecting from game ${gameCode}`);
        socket.to(gameCode).emit("disconnected");
    });

    /* When a player disconnects, send a message indicating so */
    socket.on("disconnect", () => {
        console.debug(` - User ${playerID} disconnected from game ${gameCode}`);
    });

    /* When the browser closes, emit a goodbye message to everyone before going */
    socket.onclose = () => {
        this.emit("disconnecting");
        this.emit("disconnect");
    };
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

require("./APIs/games_API")(app, pool, path);
require("./APIs/lobbys_API")(app, pool, path);
require("./APIs/quiz_API")(app, pool, path);

//WARNING: This is really important, do not remove it
// Without it, refreshing the page fails to reload it
app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, 'host_client', 'build', 'index.html'));
});

server.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
})