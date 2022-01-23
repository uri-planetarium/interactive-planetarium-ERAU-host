/**
 * @description Attempt to create a game from the API using a randomly ge
 * @param {string} gameCode
 * @returns Either a game or an error Json object
 */
 const makeGame = async (gameCode) => {
    try {
        const body = { 
            game_code: gameCode, 
        };

        const response = await fetch(`/api/games`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        })
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

export { makeGame };