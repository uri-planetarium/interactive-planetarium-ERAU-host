import React, { Fragment, useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../../context/socket/socket";
import { setGameCache, getGameCache } from "../../cache/game_cache";
import { getAllPlayers, deletePlayer, deleteAllPlayers, updateGame } from "./game_lobby_reqs";
import "./game_lobby.css"

/**
 * @description the GameLobby component for the host_client
 * @returns Fragment
 */
const GameLobby = () => {
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const [ players, setPlayers ] = useState([]);
    var updatedPlayers = players;
    const { cached_game_code, cached_is_active, cached_is_playing } = getGameCache().data;

    //FIXME: This has caused "Unmounted" errors in the past
    useEffect(() => {

        if (cached_is_active === "false") {
            navigate("/");
        } else {
            createSocketRoom(cached_game_code);

            let abortController = new AbortController();
    
            setupSocketListeners();
    
            return () => {
                abortController.abort();
            };
        }
    }, []);

    /**
     * @description Connect to the socket context and begin listening for players joining the room
     */
    const setupSocketListeners = () => {
        attemptLobbyRetrieval(cached_game_code);

        /* When a player has connected to the game, update the player list */
        socket.on("connected", () => {
            attemptLobbyRetrieval(cached_game_code);
            console.debug("game_lobby - player joined socket room");
        });

        /* When a player chooses to leave game, remove them from lobby */
        socket.on("removal request", player_id => {
            attemptPlayerDelete(player_id);
        });

        /* When a player closed their tab, let us know */
        socket.on("disconnected", () => {
            console.debug("game_lobby - player left socket room");
        });
    };

    /**
     * @description Attempt to delete the player from the lobby given their player_id and game_code
     * @param {string} player_id 
     */
    const attemptPlayerDelete = (player_id) => {
        deletePlayer(cached_game_code, player_id)
        .then(() => {
            socket.emit("removal accepted", { 
                removed_game_code: cached_game_code, 
                removed_player_id: player_id 
            });
            attemptLobbyRetrieval(cached_game_code);
        })
        .catch(error => handleError(error));
    };

    /**
     * @description Attempt to delete all players from the lobby given the game_code
     */
    const attemptAllPlayersDelete = () => {
        setGameCache({
            game_code: cached_game_code,
            is_active: "false",
            is_playing: "false"
        });

        deleteAllPlayers(cached_game_code)
        .then(() => {
            updateGame(cached_game_code, "false", "false")
            .then(() => {
                socket.emit("removal accepted", { 
                    removed_game_code: cached_game_code, 
                    removed_player_id: "all" 
                });
            })
            .catch(error => handleError(error));
        })
        .catch(error => handleError(error));
    };

    /**
     *  @description NOTE: Possibly redundant. Remove all players / Set game to inactive / Navigate to the endgame page
     */
    const endGame = () => {
        attemptAllPlayersDelete();
        navigate("/endgame");
    }

    /**
     * @description Attempt to retrieve a list of all players that are in the game lobby
     */
    const attemptLobbyRetrieval = () => {
        getAllPlayers(cached_game_code)
        .then(allPlayers => {
            setPlayers(allPlayers);
            updatedPlayers = allPlayers;
        })
        .catch(error => handleError(error));
    };

    /**
     * @description Join(Create) a socket room and listen for messages
     * @param {integer} game_code 
     */
    const createSocketRoom = (game_code) => {
        socket.emit("join room", game_code, "Host");
    };

    /**
     * @description Handle errors from th727747e API connections
     * @param {String} error 
     */
    //NOTE: Consider whether we even want a universal way to handle errors
    const handleError = (error) => {
        console.error(error);
    };

    /* When user tries to close tab, ask them if they are sure */
    window.addEventListener("beforeunload",  (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.returnValue = '';
    });

    /* When user unloads the page, end the game */
    window.addEventListener("unload", (e) => {
        setGameCache({
            game_code: cached_game_code,
            is_active: "false",
            is_playing: "false"
        });
    });

    /* When user presses the back button, close the game */
    window.addEventListener("popstate", e => {  
        attemptAllPlayersDelete();
    });

    return (
        <Fragment>
            <h1>{cached_game_code}</h1>
            <div class="container">
                <button id="start_button" onClick={() => alert("Game Started")}>Start Game</button>
                <button id="end_button" onClick={() => endGame()}>End Game</button>
                <div id="player_list">
                    <ul>
                        { updatedPlayers.map(player => (
                            <li key={player.player_id} 
                                onClick={() => attemptPlayerDelete(player.player_id)}>
                                    {player.player_name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Fragment>
    );
};

export default GameLobby;