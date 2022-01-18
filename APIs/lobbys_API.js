module.exports = function(app, pool, path) {
    /* POST (CREATE) */
    app.post("/api/lobbys/:game_id", async (req, res) => {
        try {
            const { game_id } = req.params;
            const { player_name } = req.body;
            
            pool.query(
                "INSERT INTO lobbys \
                (game_id, player_name) \
                VALUES($1, $2) RETURNING *",
                [game_id, player_name],
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
    app.get("/api/lobbys/:game_id/:player_id", async (req, res) => {
        try {
            const { game_id, player_id } = req.params;

            pool.query(
                "SELECT * FROM lobbys \
                WHERE game_id = $1 AND player_id = $2",
                [game_id, player_id],
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
    app.get("/api/lobbys/:game_id", async (req, res) => {
        try {
            const { game_id } = req.params;

            pool.query(
                "SELECT * FROM lobbys \
                WHERE game_id = $1",
                [game_id],
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
    app.put("/api/lobbys/:game_id/:player_id", async (req, res) => {
        try {
            const { game_id, player_id } = req.params;
            const { player_name } = req.body;

            pool.query(
                "UPDATE lobbys SET player_name = $1 \
                WHERE game_id = $2 AND player_id = $3",
                [player_name, game_id, player_id],
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
    app.delete("/api/:game_id/:player_id", async (req, res) => {
        try {
            const { game_id, player_id } = req.params;

            pool.query(
                "DELETE FROM lobbys WHERE \
                game_id = $1 AND player_id = $2",
                [game_id, player_id],
                (err, result) => {
                    if (err) {
                        console.error('Error executing query', err.stack);
                        res.json({ error: err });
                    } else {
                        res.json("Player " + player_id + " was deleted");
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



