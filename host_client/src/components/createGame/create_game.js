import React, { Fragment, useContext } from "react";
import { useNavigate } from "react-router-dom";
import pRetry from "p-retry";
import { makeGame } from "./create_game_reqs";

// Constants
const GAME_CREATE_RETRIES = 10;

/**
 * @description the CreateGame component for the host_client
 * @returns Fragment
 */
const CreateGame = () => {
    const navigate = useNavigate();

    /**
     * @description Randomly generate a 6 digit game_code
     * @returns Integer
     */
    const createGameCode = () => {
        const newGameCode = Math.floor(100000 + Math.random() * 900000);
        console.debug(`create_game - Creating new game with code:  ${newGameCode}`);

        /* For game_code retry testing */
        //const answers = [111111, 222222, 333333, 444444, 555555, 666666, 777777]
        //return answers[newGameCode % 7];

        return newGameCode;
    };

    /**
     * @description Attempt to register a new game
     * @param {Event} e 
     */
    const gameRegister = (e) => {
        e.preventDefault();
        const gameCode = createGameCode();

        /* If makeGame doesn't work, try again a few times
         * should the cause of failure be a duplicate game_code */
        pRetry(() => makeGame(gameCode), {
            onFailedAttempt: error => {
                console.error(
                    `create_game - ${error.attemptNumber} game creation attempts 
                    failed. There are ${error.retriesLeft} retries left.
                `);
            }, retries: GAME_CREATE_RETRIES
        })
        .then(game => {
            navigate("/lobby", { state: game });
        })
        .catch(error => handleError(error));
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