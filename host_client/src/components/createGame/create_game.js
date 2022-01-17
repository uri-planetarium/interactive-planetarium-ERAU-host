import React, { Fragment } from "react";

const CreateGame = () => {
    const createGameCode = () => {
        const newGameCode = Math.floor(100000 + Math.random() * 900000);
        console.log("Creating new game with code: " + newGameCode);
        return newGameCode;
    };

    const makeGame = async () => {
        try {
            const body = { 
                game_code: createGameCode(), 
                is_active: "true", 
                is_playing: "false" 
            };
            console.log(body);

            const response = await fetch(`/api/games`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            })
            .then(response => response.json());

            if (!response.error) {
                return response;
            } else {
                return { error: "Error: " + response.error.code };
            }
        } catch (error) {
            return { error: "Error: " + error.message };
        }
    };

    return (
        <Fragment>
            <h1>Ayo why don't you create a game while you're here :^)</h1>
            <button onClick={makeGame}>Create Game</button>
        </Fragment>
    );
};

export default CreateGame;