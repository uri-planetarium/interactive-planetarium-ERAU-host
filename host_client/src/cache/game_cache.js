const GAME_CACHE = "GAME_CACHE";

/**
 * @description If game data is stored in cache, retrieve it.
 * @returns gameCache JSON object
 */
const getGameCache = () => {
    let gameCache = {
        data: {}
    }
    
    try {
        const data = localStorage.getItem(GAME_CACHE);

        if (data) {
            gameCache = JSON.parse(data);
        }
    } catch (error) {
        console.error(error.message);
    }

    return gameCache;
};

/**
 * @description Store given game data in cache
 * @param {object} gameData 
 */
const setGameCache = (gameCode) => {
    const gameCache = getGameCache();

    const info = {
        cached_game_code: gameCode
    }

    gameCache.data = info;

    try {
        localStorage.setItem(GAME_CACHE, JSON.stringify(gameCache));
    } catch (error) {
        console.error(error.message);
    }
};

// const deletePlayerCache = (data) => {
//     if (data) {
//         delete data;
//     }
// };

export { setGameCache, getGameCache };