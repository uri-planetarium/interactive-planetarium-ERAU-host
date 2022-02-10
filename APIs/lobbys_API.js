module.exports = function(app, pool, path) {
    /* POST (CREATE) */
    /* Create a new player in a game lobby */
    app.post("/api/lobbys/:game_code", async (req, res) => {
        try {
            const { game_code } = req.params;
            const { player_name } = req.body;
            
            pool.query(
                "INSERT INTO lobbys \
                (game_code, player_name) \
                VALUES($1, $2) RETURNING *",
                [game_code, player_name],
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
    /* Get all the data of a specific player from a specific game lobby */
    app.get("/api/lobbys/:game_code/:player_id", async (req, res) => {
        try {
            const { game_code, player_id } = req.params;

            pool.query(
                "SELECT * FROM lobbys \
                WHERE game_code = $1 AND player_id = $2",
                [game_code, player_id],
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
    /* Get all players from a specific lobby */
    app.get("/api/lobbys/:game_code", async (req, res) => {
        try {
            const { game_code } = req.params;

            pool.query(
                "SELECT * FROM lobbys \
                WHERE game_code = $1",
                [game_code],
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
    /* Change the name of a player in the lobby */
    app.put("/api/lobbys/:game_code/:player_id", async (req, res) => {
        try {
            const { game_code, player_id } = req.params;
            const { player_name } = req.body;

            pool.query(
                "UPDATE lobbys SET player_name = $1 \
                WHERE game_code = $2 AND player_id = $3",
                [player_name, game_code, player_id],
                (err, result) => {
                    if (err) {
                        console.error('Error executing query', err.stack);
                        res.json({ error: err });
                    } else {
                        res.json("Player " + player_id + " was updated");
                    }
                }
            );
        } catch (error) {
            console.error(error,message);
        }
    });
   
    /* DELETE (DELETE) */
    /* Delete a player from a specific game lobby */
    app.delete("/api/lobbys/:game_code/:player_id", async (req, res) => {
        try {
            const { game_code, player_id } = req.params;

            pool.query(
                "DELETE FROM lobbys WHERE \
                game_code = $1 AND player_id = $2",
                [game_code, player_id],
                (err, result) => {
                    if (err) {
                        console.error('Error executing query', err.stack);
                        res.json({ error: err });
                    } else {
                        res.json(player_id);
                    }
                }
            );
        } catch (error) {
            console.error(error.message);
        }
    });

    /* DELETE (DELETE) */
    /* Delete all players from a specific game lobby */
    app.delete("/api/lobbys/:game_code/", async (req, res) => {
        try {
            const { game_code } = req.params;

            pool.query(
                "DELETE FROM lobbys WHERE \
                game_code = $1",
                [game_code],
                (err, result) => {
                    if (err) {
                        console.error('Error executing query', err.stack);
                        res.json({ error: err });
                    } else {
                        res.json("All players were deleted");
                    }
                }
            );
        } catch (error) {
            console.error(error.message);
        }
    });
}



