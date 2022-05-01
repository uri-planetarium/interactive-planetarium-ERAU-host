/**
 * @description Attempt to get all players in a specific lobby given the game_code
 * @param {string} gameCode
 * @returns Either a list of player objects or an error Json object
 */
const getQuiz = async(quiz_id) => {
    try {
        console.log(`./api/quizzes/${quiz_id}`)
        const response = await fetch(`/api/quizzes/${quiz_id}`)
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
export { getQuiz };