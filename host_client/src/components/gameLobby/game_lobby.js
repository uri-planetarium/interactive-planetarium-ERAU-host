import React, { Fragment, useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../../context/socket/socket";
import { getGameCache } from "../../cache/game_cache";
import { getAllPlayers, deletePlayer, deleteAllPlayers } from "./game_lobby_reqs";
import "./game_lobby.css"

/**
 * @description the GameLobby component for the host_client
 * @returns Fragment
 */
const GameLobby = () => {
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const [ players, setPlayers ] = useState([]);
    const game = useRef({});
    var updatedPlayers = players;
    const { cached_game_code, cached_is_active, cached_is_playing } = getGameCache().data;

    //FIXME: This has caused "Unmounted" errors in the past
    useEffect(() => {
        game.current = {
            game_code: cached_game_code,
            is_active: cached_is_active,
            is_playing: cached_is_playing
        };

        createSocketRoom(game.current.game_code);
        let abortController = new AbortController();

        setupSocketListeners();

        return () => {
            abortController.abort();
        };
    }, []);

    /**
     * @description Connect to the socket context and begin listening for players joining the room
     */
    const setupSocketListeners = () => {
        attemptLobbyRetrieval(game.current.game_code);

        /* When a player has connected to the game, update the player list */
        socket.on("connected", () => {
            attemptLobbyRetrieval(game.current.game_code);
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
        socket.emit("removal accepted", { 
            removed_game_code: game.current.game_code, 
            removed_player_id: player_id 
        });
        setTimeout(() => {  attemptLobbyRetrieval(game.game_code); }, 100);
    };

    /**
     * @description Attempt to delete all players from the lobby given the game_code
     */
    const attemptAllPlayersDelete = () => {
        socket.emit("removal accepted", { 
            removed_game_code: cached_game_code, 
            removed_player_id: "all" 
        });
        navigate("/endgame");
    };

    /**
     * @description Attempt to retrieve a list of all players that are in the game lobby
     */
    const attemptLobbyRetrieval = () => {
        getAllPlayers(game.current.game_code)
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

        console.debug(`create_game - joined room ${game_code}`);
    };

    /**
     * @description Handle errors from the API connections
     * @param {String} error 
     */
    //NOTE: Consider whether we even want a universal way to handle errors
    const handleError = (error) => {
        console.error(error);
    };

    /* When use tries to close tab, ask them if they are sure */
    window.addEventListener("beforeunload",  (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.returnValue = '';
    });

    window.addEventListener("unload", (e) => {
        attemptAllPlayersDelete();
    });

    window.addEventListener("popstate", e => {  
        attemptAllPlayersDelete();
    });

    return (
        <Fragment>
            <h1>{game.current.game_code}</h1>
            <div class="container">
                <button id="start_button" onClick={() => alert("Game Started")}>Start Game</button>
                <button id="end_button" onClick={() => attemptAllPlayersDelete()}>End Game</button>
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