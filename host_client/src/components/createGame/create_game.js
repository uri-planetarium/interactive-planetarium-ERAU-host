import React, { Fragment, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../../context/socket/socket";
import pRetry from "p-retry";
import { makeGame } from "./create_game_reqs";

// Constants
const GAME_CREATE_RETRIES = 10;

/**
 * @description the CreateGame component for the host_client
 * @returns Fragment
 */
const CreateGame = () => {
    const socket = useContext(SocketContext);
    const navigate = useNavigate();

    /**
     * @description Randomly generate a 6 digit game_code
     * @returns Integer
     */
    const createGameCode = () => {
        const newGameCode = Math.floor(100000 + Math.random() * 900000);
        console.debug(`Creating new game with code:  ${newGameCode}`);

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
                    `${error.attemptNumber} game creation attempts 
                    failed. There are ${error.retriesLeft} retries left.
                `);
            }, retries: GAME_CREATE_RETRIES
        })
        .then(game => {
            createSocketRoom(game.game_code);
            navigate("/lobby", { state: game });
        })
        .catch(error => handleError(error));
    };

    /**
     * @description Join(Create) a socket room and listen for messages
     * @param {integer} game_code 
     */
    const createSocketRoom = (game_code) => {
        socket.emit("join room", game_code, "Host");

        console.debug(`joined room ${game_code}`);

        socket.on("message", (message) => {
            console.log(message);
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