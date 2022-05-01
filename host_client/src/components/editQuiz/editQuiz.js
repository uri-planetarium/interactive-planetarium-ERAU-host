import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuiz } from "./edit_quiz_reqs";
import "./edit_quiz.css";
import "../../App.css";


/**
 * @description the editQuiz component for the host_client
 * @returns Fragment
 */
const EditQuiz = () => {
    const [ quiz, setQuiz ] = useState({name: "Hi", questions: []});
    // {answers: [{answer:"1", is_correct: "TRUE"}]}
    const id_str = window.location.pathname.slice(9); 
    const getQ = () => {
        getQuiz(id_str).then(
            quiz => {
                let questionNumber = 1;
                for (const question of quiz.questions) {
                    question.question_number = questionNumber;
                    questionNumber += 1;

                }
                console.log(quiz)

                setQuiz(quiz);
            })
            .catch(error => handleError(error));
        };
        useEffect(() => {getQ(id_str)}, []);

    const handleError = (error) => {
        console.error(error);
    };
    const printContent = (content) => {
        console.log(content)
    }
    return (
        <Fragment>
            <form>
                <div>
                    Quiz Name:&nbsp; 
                    {/* <input type="text" defaultValue={quiz.name} placeholder="" className="input input-ghost w-full max-w-xs"></input> */}
                </div>
                <ul>
                {quiz.questions.map(question => (
                    <li key={question.question_text}>
                        {question.question_text} 
                        <ul>
                            {question.answers.map(answer => (
                                <li key={answer.answer}> 
                                    {answer.answer} 
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
                </ul>
                <button className="btn btn-info">Info</button>
                <button className="btn btn-active btn-primary" onClick={printContent(quiz.questions[0])}>PrintQuiz</button>
               
            </form>
            

            
        </Fragment>
    );
};
// { quiz.questions.map(question => (
    // <li>question.question_text</li>
// ))}
export default EditQuiz;

// const navigate = useNavigate();

    // /**
    //  * @description Randomly generate a 6 digit game_code
    //  * @returns Integer
    //  */
    // // FIXME: This code gets really slow after the first few attempts, we should find a better option
    // const createGameCode = () => {
    //     const newGameCode = Math.floor(100000 + Math.random() * 900000);
    //     console.debug(`create_game - Creating new game with code:  ${newGameCode}`);

    //     /* For game_code retry testing */
    //     //const answers = [111111, 222222, 333333, 444444, 555555, 666666, 777777]
    //     //return answers[newGameCode % 7];

    //     return newGameCode;
    // };

    // /**
    //  * @description Attempt to register a new game
    //  * @param {Event} e 
    //  */
    // const gameRegister = (e) => {
    //     e.preventDefault();
    //     const gameCode = createGameCode();

    //     /* If makeGame doesn't work, try again a few times
    //      * should the cause of failure be a duplicate game_code */
    //     pRetry(() => makeGame(gameCode), {
    //         onFailedAttempt: error => {
    //             console.error(
    //                 `create_game - ${error.attemptNumber} game creation attempts 
    //                 failed. There are ${error.retriesLeft} retries left.
    //             `);
    //         }, retries: GAME_CREATE_RETRIES
    //     })
    //     .then(game => {
    //         //NOTE: This currently saves the game to local storage. It might be better to send it as a state instead
    //         setGameCache(game);
    //         navigate("/lobby");
    //     })
    //     .catch(error => handleError(error));
    //     //TODO: The user should receive an error modal if this becomes an error
    // };

    // /**
    //  * @description Handle errors from the API connections
    //  * @param {String} error 
    //  */
    // //NOTE: Consider whether we even want a universal way to handle errors
    //  const handleError = (error) => {
    //     //TODO - Handle 
    //     console.error(error);
    // }