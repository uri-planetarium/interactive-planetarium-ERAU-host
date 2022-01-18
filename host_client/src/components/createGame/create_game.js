import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";

const CreateGame = () => {
    const navigate = useNavigate();

    /**
     * @description Randomly generate a 6 digit game_code
     * @returns Integer
     */
    const createGameCode = () => {
        const newGameCode = Math.floor(100000 + Math.random() * 900000);
        console.debug("Creating new game with code: " + newGameCode);

        return newGameCode;
    };

    /**
     * @description Attempt to create a game from the API using a randomly generated game code
     * @returns Either a game or an error Json object
     */
    const makeGame = async () => {
        try {
            const body = { 
                game_code: createGameCode(), 
                is_active: "true", 
                is_playing: "false" 
            };

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

    /**
     * @description Attempt to register a new game
     * @param {Event} e 
     */
    const gameRegister = (e) => {
        e.preventDefault();

        makeGame()
        .then(game => {
            if (!game.error){
                console.debug(game);
                navigate("/lobby", { state: game });
            } else {
                handleError(game.error);
            }
        });

    };

    /**
     * @description Handle errors from the API connections
     * @param {String} error 
     */
     const handleError = (error) => {
        //TODO - Handle 
        console.error(error);
    }

    return (
        <Fragment>
            <h1>Ayo why don't you create a game while you're here :^)</h1>
            <button onClick={gameRegister}>Create Game</button>
        </Fragment>
    );
};

export default CreateGame;