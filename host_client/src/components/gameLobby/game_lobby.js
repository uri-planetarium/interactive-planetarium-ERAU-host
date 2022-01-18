import React, { Fragment, useEffect } from "react";
import { useLocation } from "react-router-dom";

const GameLobby = () => {
    const location = useLocation();
    const gameData = location.state;

    return (
        <Fragment>
            <h1>{gameData.game_code}</h1>
        </Fragment>
    );
};

export default GameLobby;