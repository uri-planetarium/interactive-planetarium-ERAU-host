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
        //return newGameCode % 2 == 0 ? 111112 : 222222;


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
                throw new Error(response.error.code);
            }
        } catch (error) {
            throw new Error(error.message);
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
            navigate("/lobby", { state: game });
        })
        .catch(error => {
            handleError(error);
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