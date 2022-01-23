import React from "react";
import socketio from "socket.io-client";

//TODO - Set "url" to the heroku server URL
const SOCKET_URL = (process.env.NODE_ENV === "production") ? "url" : "http://localhost:5001/";

export const socket = socketio.connect(SOCKET_URL);
export const SocketContext = React.createContext();