import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';

import { SocketContext, socket } from "./context/socket/socket"; 
import CreateGame from "./components/createGame/create_game";
import GameLobby from "./components/gameLobby/game_lobby";
import EndGame from "./components/endGame/end_game";

function App() {
    return (
        <SocketContext.Provider value={socket}>
            <Router>
                <Routes>
                    <Route path="/" element={<CreateGame />}/>
                    <Route path="/lobby" element={<GameLobby />}/>
                    <Route path="/endgame" element={<EndGame />}/>
                </Routes>
            </Router>
        </SocketContext.Provider>
    );
}

export default App;
