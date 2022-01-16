const express = require("express"),
    app = express(),
    cors = require("cors"), 
    pool = require("./APIs/database"),
    path = require("path"),
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

require("./APIs/games_API")(app, pool, path);
require("./APIs/lobbys_API")(app, pool, path);

app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
})