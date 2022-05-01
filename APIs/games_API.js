module.exports = function(app, pool, path) {
    /* POST (CREATE) */
    /* Create a new game */
    app.post("/api/games", async (req, res) => {
        try { 
            const { game_code } = req.body;

            pool.query (
                "INSERT INTO games \
                (game_code) \
                VALUES($1) RETURNING *",
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

    /* GET (READ) */ 
    /* Get the data of a specific game lobby */
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
    /* Get all game lobbys */
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
    /* Change the "is_active" or/and "is_playing" fields of a game lobby */
    app.put("/api/games/:game_code", async (req, res) => {
        try {
            const { game_code } = req.params;
            const { is_active, is_playing } = req.body;

            pool.query(
                "UPDATE games SET is_active = $1, is_playing = $2 \
                WHERE game_code = $3",
                [is_active, is_playing, game_code],
                (err, result) => {
                    if (err) {
                        console.error('Error executing query', err.stack);
                        res.json({ error: err });
                    } else {
                        res.json("Game " + game_code + " was updated");
                    }
                }
            );
        } catch (error) {
            console.error(error.message);
        }
    });

    /* DELETE (DELETE) */
    /* Delete a specific game */
    app.delete("/api/games/:game_code", async (req, res) => {
        try {
            const { game_code } = req.params;

            pool.query(
                "DELETE FROM games WHERE game_code = $1",
                [game_code],
                (err, result) => {
                    if (err) {
                        console.error('Error executing query', err.stack);
                        res.json({ error: err });
                    } else {
                        res.json("Game " + game_code + " was deleted");
                    }
                }
            );
        } catch (error) {
            console.error(error.message);
        }
    });
}



