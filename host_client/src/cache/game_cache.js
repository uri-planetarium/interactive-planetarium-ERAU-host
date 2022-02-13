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
 * @param {object} game 
 */
const setGameCache = (game) => {
    const gameCache = getGameCache();

    const info = {
        cached_game_code: game.game_code,
        cached_is_active: game.is_active,
        cached_is_playing: game.is_playing
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