import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';

import CreateGame from "./components/createGame/create_game";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<CreateGame />}/>
            </Routes>
        </Router>
    );
}

export default App;
