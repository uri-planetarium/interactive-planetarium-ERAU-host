import React, { Fragment } from "react";

/**
 * @description the EditPlayer component for the host_client
 * @returns Fragment
 */
const EditPlayer = ({ player }) => {
    return (
        <Fragment>
            <p>{player.player_name}</p>
        </Fragment>
    );
};

export default EditPlayer;