import React, { Fragment, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SocketContext } from "../../context/socket/socket";
import { getAllPlayers } from "./game_lobby_reqs";
import EditPlayer from "../editPlayer/edit_player";
import "./game_lobby.css"

/**
 * @description the GameLobby component for the host_client
 * @returns Fragment
 */
const GameLobby = () => {
    const socket = useContext(SocketContext);
    const location = useLocation();
    const [ players, setPlayers ] = useState([]);
    const game = location.state;

    useEffect(() => {
        console.debug(`game_lobby - Game ${game.game_code} received`);
        
        let abortController = new AbortController();

        setupSocketListeners(game.game_code);

        return () => {
            abortController.abort();
        };
    }, []);

    /**
     * @description Connect to the socket context and begin listening for players joining the room
     * @param {string} game_code 
     */
    const setupSocketListeners = (game_code) => {
        attemptLobbyRetrieval(game_code);

        socket.on("message", (message) => {
            if (message === "player connected") {
                attemptLobbyRetrieval(game_code);
            }
            
            console.debug(`game_lobby - New message: ${message}`);
        })
    };

    /**
     * @description Attempt to retrieve a list of all players that are in the game lobby
     * @param {string} game_code 
     */
    const attemptLobbyRetrieval = (game_code) => {
        getAllPlayers(game_code)
        .then(allPlayers => {
            setPlayers(allPlayers);
        })
        .catch(error => handleError(error));
    };

    /**
     * @description Handle errors from the API connections
     * @param {String} error 
     */
    const handleError = (error) => {
        console.error(error);
    };

    return (
        <Fragment>
            <h1>{game.game_code}</h1>
            <div class="container">
                <button id="start_button">Start Game</button>
                <div id="player_list">
                    <ul>
                        { players.map(player => (
                            <li key={player.player_id}> <EditPlayer player = { player }/></li>
                        ))}
                    </ul>
                </div>
            </div>
        </Fragment>
    );
};

export default GameLobby;