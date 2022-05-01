/**
 * @description Attempt to get all players in a specific lobby given the game_code
 * @param {string} gameCode
 * @returns Either a list of player objects or an error Json object
 */
const getAllQuizzes = async() => {
    try {
        const response = await fetch("./api/quizzes")
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
export { getAllQuizzes };