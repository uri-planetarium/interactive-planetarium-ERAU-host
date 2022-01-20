import React, { Fragment, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./game_lobby.css"

//Component
const GameLobby = () => {
    const location = useLocation();
    const gameData = location.state;

    return (
        <Fragment>
            <h1>{gameData.game_code}</h1>
            <div class="container">
                <button id="start_button">Start Game</button>
                <div id="player_list">
                    <ul>
                        <li>Player Name</li>
                        <li>Player Name</li>
                        <li>Player Name</li>
                        <li>Player Name</li>
                        <li>Player Name</li>
                        <li>Player Name</li>
                        <li>Player Name</li>
                        <li>Player Name</li>
                        <li>Player Name</li>
                    </ul>
                </div>
            </div>
        </Fragment>
    );
};

export default GameLobby;