import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';

import { SocketContext, socket } from "./context/socket/socket"; 
import CreateGame from "./components/createGame/create_game";
import GameLobby from "./components/gameLobby/game_lobby";
import EndGame from "./components/endGame/end_game";
import ManageQuizzes from "./components/manageQuizzes/manageQuizzes";
import EditQuiz from "./components/editQuiz/editQuiz";
function App() {
    return (
        <SocketContext.Provider value={socket}>
            <Router>
                <Routes>
                    <Route path="/" element={<CreateGame />}/>
                    <Route path="/lobby" element={<GameLobby />}/>
                    <Route path="/endgame" element={<EndGame />}/>
                    <Route path="/quizzes/" element={<ManageQuizzes />}/>
                    <Route path="/quizzes/:quiz_id" element={<EditQuiz />}/>

                </Routes>
            </Router>
        </SocketContext.Provider>
    );
}

export default App;
