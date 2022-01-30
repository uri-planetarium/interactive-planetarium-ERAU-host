/* Rather than getting every player from the api, we could just use the player's name that is sent through with the socket 
* emittion. 
* This was, we wouldn't need to refresh the entire lobby and we could also limit the api requests being sent */


/**
 * @description Attempt to get all players in a specific lobby given the game_code
 * @param {string} gameCode
 * @returns Either a list of player objects or an error Json object
 */
const getAllPlayers = async (game_code) => {
    try {
        const response = await fetch(`./api/lobbys/${game_code}`)
        .then(response => response.json());

        if (!response.error) {
            return response;
        } else {
            throw new Error(response.error.code);
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

export { getAllPlayers };