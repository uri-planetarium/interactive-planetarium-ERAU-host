import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";


const EndGame = () => {
    const navigate = useNavigate();

    
    window.addEventListener("popstate", e => {  
        navigate('/', {replace: true});
    });

    return (
        <Fragment>
            <h1>omg I did it</h1>
        </Fragment>
    );
};

export default EndGame;