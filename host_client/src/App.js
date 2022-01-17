import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';

import CreateGame from "./components/createGame/create_game";
import GameLobby from "./components/gameLobby/game_lobby";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<CreateGame />}/>
                <Route path="/lobby" element={<GameLobby />}/>
            </Routes>
        </Router>
    );
}

export default App;
