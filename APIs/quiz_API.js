
module.exports = function(app, pool, path) {
    /* POST (CREATE) */
    /* Create a new quiz */ 
    app.post("/api/quizzes", async (req, res) => {
        const client = await pool.connect();
        try {
            const { quiz_name, questions } = req.body;
            client.query('BEGIN')
            const insertQuiz = 'INSERT INTO quizzes(quiz_name) VALUES($1) RETURNING quiz_id'
            const quiz_result = await client.query(insertQuiz, [quiz_name]);

            for (const question of questions){  
                // insert questions 
                console.log("question");
                console.log(question.question_text);
                const insertQuestion = 'INSERT INTO quiz_questions(quiz_id, question) VALUES ($1, $2) RETURNING quiz_question_id';
                const insertQuestionText = [quiz_result.rows[0].quiz_id, question.question_text];
                const question_result = await client.query(insertQuestion, insertQuestionText);
                const question_id = question_result.rows[0].quiz_question_id;

                for (const a of question.answers) {
                    console.log("answer: ");
                    console.log(a)
                    const insertQuestion = 
                        'INSERT INTO quiz_question_answers(quiz_id, quiz_question_id, is_correct, answer) VALUES ($1, $2, $3, $4) RETURNING quiz_question_id'
                    const insertQuestionText = [quiz_result.rows[0].quiz_id, question_id, a.is_correct, a.answer]
                    const question_result = await client.query(insertQuestion, insertQuestionText)
                }
            }
            // const insertAnswers = 'INSERT INTO quiz_questions_answers(quiz_id, quiz_question_id, answer) VALUES ($1, $2)'
            // const insertQuestionText = [result.rows[0].quiz_id, questions[0].question_text]
            // await client.query(insertQuestion, insertQuestionText)

            await client.query('COMMIT');
            res.json(req.body);
            console.log("Quiz Commited")

        } catch (error) {
            await client.query('ROLLBACK');

            console.error(error.message);
        }
        finally  {
            client.release();
        }
    });

   

    /* GET (READ) */
    /* Get a quiz */
    app.get("/api/quizzes/:quiz_id", async (req, res) => {
        try {
            console.log("quiz requested");
            const { quiz_id } = req.params;
            const quiz = {}; 
            const client = await pool.connect();
            client.query(
                    `SELECT * FROM quizzes AS q
                    INNER JOIN quiz_questions AS qq ON q.quiz_id=qq.quiz_id
                    INNER JOIN quiz_question_answers AS qqa ON qq.quiz_question_id=qqa.quiz_question_id
                    where q.quiz_id = $1 ORDER BY qq.quiz_question_id`,
                [quiz_id],
                (err, result) => {
                    if (err) {
                        console.error('Error executing query', err.stack);
                        res.json({ error: err });
                    } 
                    else {
                        console.log(result.rows)
                        quiz.name = result.rows[0].quiz_name;
                        quiz.quiz_id = result.rows[0].quiz_id;
                        let prev_question_id = 0;
                        quiz.questions = []
                        let question_index = -1 // keeps track of which question you are on

                        for (const row of result.rows) {
                            console.log(row);
                            if (row.quiz_question_id != prev_question_id) {
                                console.log("new q");
                                quiz.questions.push({quiz_question_id: row.quiz_question_id, question_text: row.question, answers: [
                                    {
                                        "answer_id": row.answer_id,
                                        "answer": row.answer,
                                        "is_correct": row.is_correct
                                    }
                                ]
                            });
                                prev_question_id = row.quiz_question_id;
                                console.log(prev_question_id);
                                question_index++;                             
                            }
                            else {
                                quiz.questions[question_index].answers.push({
                                    "answer_id": row.answer_id,
                                    "answer": row.answer,
                                    "is_correct": row.is_correct
                                });
                            }

                        }
                        res.json(quiz);
                    }
                }    
            );
        
        } catch (error) {
            console.error(error.message);
        } 
    });
    
        //     const answer_map = {}
        //     client.query(
        //         "SELECT * FROM quiz_questions where quiz_id = $1",
        //         [quiz_id],
        //         (err, result) => {
        //             if (err) {
        //                 console.error('Error executing query', err.stack);
        //                 res.json({ error: err });
        //             } 
        //             else {
        //                 quiz.questions = []
        //                 index = 0
        //                 for (const row of result.rows) {
        //                     quiz.questions.push({question_text: row.question, answers: []})
        //                     answer_map[row.quiz_question_id] = index;
        //                     ++index;
        //                 }
        //             }
        //         }
                
        //     );
        //     client.query(
        //         "SELECT * FROM quiz_question_answers where quiz_id = $1",
        //         [quiz_id],
        //         (err, result) => {
        //             if (err) {
        //                 console.error('Error executing query', err.stack);
        //                 res.json({ error: err });
        //             } 
        //             else {
        //                 console.log(quiz);
        //                 for (const row of result.rows) {
        //                     quiz.questions[answer_map[row.quiz_question_id]].answers
        //                     .push({answer: row.answer, is_correct: row.is_correct})
        //                 }
                        


        //                 res.json(quiz);
        //             }
        //         }
        //     );
        // } catch (error) {
        //     console.error(error.message);
        // } 
    // });
    
    /* GET ALL (READ ALL) */
    /* Get all quizzes from a specific lobby */
    app.get("/api/quizzes", async (req, res) => {
        try {
            pool.query(
                "SELECT * FROM quizzes",
                (err, result) => {
                    if (err) {
                        console.error('Error executing query', err.stack);
                        res.json({ error: err });
                    } else {
                        res.json(result.rows);
                    }
                }
            );
        } catch (error) {
            console.error(error.message);
        }
    });
};

//     /* PUT (UPDATE) */
//     /* Change the name of a player in the lobby */
//     app.put("/api/lobbys/:game_code/:player_id", async (req, res) => {
//         try {
//             const { game_code, player_id } = req.params;
//             const { player_name } = req.body;

//             pool.query(
//                 "UPDATE lobbys SET player_name = $1 \
//                 WHERE game_code = $2 AND player_id = $3",
//                 [player_name, game_code, player_id],
//                 (err, result) => {
//                     if (err) {
//                         console.error('Error executing query', err.stack);
//                         res.json({ error: err });
//                     } else {
//                         res.json("Player " + player_id + " was updated");
//                     }
//                 }
//             );
//         } catch (error) {
//             console.error(error,message);
//         }
//     });
   
//     /* DELETE (DELETE) */
//     /* Delete a player from a specific game lobby */
//     app.delete("/api/:game_code/:player_id", async (req, res) => {
//         try {
//             const { game_code, player_id } = req.params;

//             pool.query(
//                 "DELETE FROM lobbys WHERE \
//                 game_code = $1 AND player_id = $2",
//                 [game_code, player_id],
//                 (err, result) => {
//                     if (err) {
//                         console.error('Error executing query', err.stack);
//                         res.json({ error: err });
//                     } else {
//                         res.json("Player " + player_id + " was deleted");
//                     }
//                 }
//             );
//         } catch (error) {
//             console.error(error.message);
//         }
//     });
// }



