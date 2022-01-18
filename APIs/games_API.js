//TODO: Change the queries from relying on the game code to the game_id

module.exports = function(app, pool, path) {
    /* POST (CREATE) */
    app.post("/api/games", async (req, res) => {
        try {
            const { game_code, is_active, is_playing } = req.body;

            pool.query (
                "INSERT INTO games \
                (game_code, is_active, is_playing) \
                VALUES($1, $2, $3) RETURNING *",
                [game_code, is_active, is_playing],
                (err, result) => {
                    if (err) {
                        console.error('Error executing query', err.stack);
                        res.json({ error: err });
                    } else {
                        res.json(result.rows[0]);
                    }
                }
            );
        } catch (error) {
            console.error(error.message);
        }
    });

    /* GET (READ) */
    app.get("/api/games/:game_code", async (req,res) => {
        try {
            const { game_code } = req.params;
            
            pool.query(
                "SELECT * FROM games \
                WHERE game_code = $1",
                [game_code],
                (err, result) => {
                    if (err) {
                        console.error('Error executing query', err.stack);
                        res.json({ error: err });
                    } else {
                        res.json(result.rows[0]);
                    }
                }
            );
        } catch (error) {
            console.error(error.message);
        }
    });

    /* GET ALL (READ ALL) */
    app.get("/api/games", async (req,res) => {
        try {
            pool.query(
                "SELECT * FROM games",
                (err, result) => {
                    if (err) {
                        console.error('Error executing query', err.stack);
                        res.json({ error: err });
                    } else {
                        res.json(result.rows);
                    }
                }
            );
        } catch (error) {
            console.error(error.message);
        }
    });

    /* PUT (UPDATE) */
    app.put("/api/games/:game_id", async (req, res) => {
        try {
            const { game_id } = req.params;
            const { is_active, is_playing } = req.body;

            pool.query(
                "UPDATE games SET is_active = $1, is_playing = $2 \
                WHERE game_id = $3",
                [is_active, is_playing, game_id],
                (err, result) => {
                    if (err) {
                        console.error('Error executing query', err.stack);
                        res.json({ error: err });
                    } else {
                        res.json("Game " + game_id + " was updated");
                    }
                }
            );
        } catch (error) {
            console.error(error.message);
        }
    });

    /* DELETE (DELETE) */
    app.delete("/api/games/:game_id", async (req, res) => {
        try {
            const { game_id } = req.params;

            pool.query(
                "DELETE FROM games WHERE game_id = $1",
                [game_id],
                (err, result) => {
                    if (err) {
                        console.error('Error executing query', err.stack);
                        res.json({ error: err });
                    } else {
                        res.json("Game " + game_id + " was deleted");
                    }
                }
            );
        } catch (error) {
            console.error(error.message);
        }
    });

    // app.get("*", (req, res) => {
    //     res.sendFile(path.join(__dirname, "../host_client/build/index.html"));
    // })
}



