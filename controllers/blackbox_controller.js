const Ques_BlackBox = require("../models/question_blackbox");
const User = require("./../models/user.js");
const Game = require("./../models/game");
const { validationResult } = require("express-validator");

exports.FirstPage = async (req, res) => {
    console.log(req.user);
    let message = req.query.message || "None";
    const email = req.user.email;
    let result = "None";
    var time = new Date();

    let gamer = await User.findOne({ email: email });
    var level1 = gamer.blackbox_level;
    if (gamer.Array.length > 0) result = "";

    Game.findOne({ title: process.env.GAME_TITLE }, async function (err, result) {
        const question = await Ques_BlackBox.findOne({ level: level1 });
        if (err) {
            res.send("Error in fetching game");
        }
        else {
            if (level1 == process.env.BLACK_LEVEL) {
                // message = "Well Done! You have solved all levels. Please check your rank in the leaderboard";
                res.redirect('/blackbox_leaderboard');
            }
            else {
                if (req.user.submitted == true) {
                    // message = "You have already submitted. Please check your rank in the leaderboard";
                    req.logout();
                    // message = "congracts you passed all test"
                    res.redirect("/final-leaderBoard")
                }
                else {
                    var remaining_time = result.endTime - time;
                    console.log(question)
                    res.render("blackbox_index", {
                        user: gamer,
                        question: question,
                        message: message,
                        remaining_time: remaining_time
                    });
                }
            }
        }
    })
}

exports.black_ques = async (req, res, next) => {
    try {
        let a = 0, b = 0, c = 0, d = 0, e = 0, f = 0, g = 0;
        let variables = [], i = 0;

        //initializing variables and storing in variables array
        var userInput = `Combination of`;
        if (req.body.num1) {
            a = parseInt(req.body.num1);
            userInput = userInput + ` ${a}`;
            variables[i++] = 'a';
        }
        if (req.body.num2) {
            b = parseInt(req.body.num2);
            userInput = userInput + `, ${b}`;
            variables[i++] = 'b';
        }
        if (req.body.num3) {
            c = parseInt(req.body.num3);
            userInput = userInput + `, ${c}`;
            variables[i++] = 'c';
        }
        if (req.body.num4) {
            d = parseInt(req.body.num4);
            userInput = userInput + `, ${d}`;
            variables[i++] = 'd';
        }
        if (req.body.num5) {
            e = parseInt(req.body.num5);
            userInput = userInput + `, ${e}`;
            variables[i++] = 'e';
        }
        if (req.body.num6) {
            f = parseInt(req.body.num6);
            userInput = userInput + `, ${f}`;
            variables[i++] = 'f';
        }
        if (req.body.num7) {
            g = parseInt(req.body.num7);
            userInput = userInput + `, ${g}`;
            variables[i++] = 'g';
        }

        let gamer = await User.findOne({ email: req.user.email });
        var level1 = gamer.blackbox_level;
        let ques_game = await Ques_BlackBox.findOne({ level: level1 });
        var expression_real = eval(ques_game.answer_expression);
        userInput = userInput + ` is ${expression_real}`;

        Game.findOne({ title: process.env.GAME_TITLE }, async function (err, result) {
            if (err) {
                res.send("Error in fetching game");
            } else {
                if (variables.length != ques_game.no_of_variables) {
                    const message = "Invalid Input or Empty Fields, kindly Enter Positive Integers excluding 0"
                    res.redirect(`/blackbox?message=${message}&email=${req.user.email}`);
                }
                else if (req.user.submitted == true) {
                    message = "You have already submitted. Please check your rank in the leaderboard";
                    req.logout();
                    res.redirect("/final-leaderBoard");
                }
                else if (level1 === (process.env.BLACK_LEVEL)) {
                    message = "Well Done! You have solved all levels. Please check your rank in the leaderboard";
                    res.redirect('/blackbox_leaderboard');
                }
                else {

                    User.findOneAndUpdate(
                        { email: req.user.email }, // Define the parameter and its value to identify the document
                        { $push: { Array: userInput } }, // Push the new element into the array
                        { new: true } // Set the "new" option to return the updated document
                    )
                        .then(data => {
                            res.redirect("/blackbox");
                        })
                        .catch(error => {
                            console.error('Failed to update document:', error);
                        });
                }
            }

        })
    }
    catch (err) {
        req.send("Unexpected Error Occured");
    }
}

// exports.black_ques = async (req, res, next) => {
//     console.log(req.body);
//     const errors = validationResult(req);
//     console.log(errors, req.body);
//     var time = new Date();
//     let a = 0, b = 0, c = 0, d = 0, e = 0, f = 0, g = 0;
//     let variables = [];
//     let i = 0;
//     var userInput = `Combination of`;
//     console.log(userInput);
//     if (req.body.num1) {
//         a = parseInt(req.body.num1);
//         userInput = userInput + ` ${a}`;
//         variables[i++] = 'a';
//     }
//     if (req.body.num2) {
//         b = parseInt(req.body.num2);
//         userInput = userInput + `, ${b}`;
//         variables[i++] = 'b';
//     }
//     if (req.body.num3) {
//         c = parseInt(req.body.num3);
//         userInput = userInput + `, ${c}`;
//         variables[i++] = 'c';
//     }
//     if (req.body.num4) {
//         d = parseInt(req.body.num4);
//         userInput = userInput + `, ${d}`;
//         variables[i++] = 'd';
//     }
//     if (req.body.num5) {
//         e = parseInt(req.body.num5);
//         userInput = userInput + `, ${e}`;
//         variables[i++] = 'e';
//     }
//     if (req.body.num6) {
//         f = parseInt(req.body.num6);
//         userInput = userInput + `, ${f}`;
//         variables[i++] = 'f';
//     }
//     if (req.body.num7) {
//         g = parseInt(req.body.num7);
//         userInput = userInput + `, ${g}`;
//         variables[i++] = 'g';
//     }
//     console.log(variables);
//     console.log(userInput);


//     let gamer = await User.findOne({ email: req.user.email });
//     var level1 = gamer.blackbox_level;
//     let ques_game = await Ques_BlackBox.findOne({ level: level1 });
//     var expression_real = eval(ques_game.answer_expression);
//     userInput = userInput + ` is ${expression_real}`;

//     User.findOneAndUpdate(
//         { email: req.user.email }, // Define the parameter and its value to identify the document
//         { $push: { Array: userInput } }, // Push the new element into the array
//         { new: true } // Set the "new" option to return the updated document
//     )
//         .then(updatedDocument => {
//             // console.log('Updated document:', updatedDocument);
//         })
//         .catch(error => {
//             console.error('Failed to update document:', error);
//         });
//     Game.findOne({ title: process.env.GAME_TITLE }, async function (err, result) {
//         if (err) {
//             res.send("Error in fetching game");
//         } else {
//             console.log("variables.length ", variables.length);
//             if (variables.length != ques_game.no_of_variables) {
//                 console.log("error");
//                 const message = "Invalid Input or Empty Fields, kindly Enter Positive Integers excluding 0"
//                 res.redirect(`/blackbox?message=${message}&email=${req.user.email}`);
//             }
//             // if (!errors.isEmpty()) {
//             //     var remaining_time = result.endTime - time;
//             //     const message = "Invalid Input or Empty Fields, kindly Enter Positive Integers excluding 0"
//             //     res.redirect(`/blackbox?message=${message}&email=${req.user.email}`);
//             //     // res.render("blackbox_index", {
//             //     //     user: req.user,
//             //     //     message: "Invalid Input or Empty Fields, kindly Enter Positive Integers excluding 0",
//             //     //     question: ques_game,
//             //     //     remaining_time: remaining_time,
//             //     //     level,
//             //     //     result: "None",
//             //     //     Array: "None"
//             //     // })
//             // }
//             else if (req.user.submitted == true) {
//                 message = "You have already submitted. Please check your rank in the leaderboard";
//                 req.logout();
//                 var time_to_start = result.startTime - time;
//                 // res.redirect("/final-leaderBoard");

//                 res.render("blackbox_index", {
//                     message: message,
//                     question: ques_game,
//                     time_to_start: time_to_start
//                 });
//             }
//             else if (level1 === (process.env.BLACK_LEVEL)) {
//                 message = "Well Done! You have solved all levels. Please check your rank in the leaderboard";
//                 var time_to_start = result.startTime - time;
//                 console.log(time_to_start);
//                 res.redirect('/blackbox_leaderboard');
//                 // res.render("max_level");
//             }

//             else {
//                 let gamer = await User.findOne({ email: req.user.email });
//                 var Array = gamer.Array;
//                 message = "None";
//                 var remaining_time = result.endTime - time;
//                 res.render("blackbox_index", {
//                     user: req.user,
//                     level1,
//                     message: message,
//                     question: ques_game,
//                     remaining_time: remaining_time,
//                     Array: Array,
//                     x: a, y: b, z: c, result: expression_real
//                 });
//             }
//         }

//     })
// }

exports.submit_blackbox = async (req, res) => {
    const errors = validationResult(req);
    let gamer = await User.findOne({ email: req.user.email });
    var level1 = gamer.blackbox_level
    let ques_game = await Ques_BlackBox.findOne({ level: level1 })
    var expression_black = ques_game.answer_expression;
    let credit = ques_game.credit;
    let time = Date.now();

    let a = Math.floor(Math.random() * 101);
    let b = Math.floor(Math.random() * 101);
    let c = Math.floor(Math.random() * 101);
    let d = Math.floor(Math.random() * 101);
    let testcase = 0;
    const expression = req.body.user_expression.toString().toLowerCase();
    var expression_real = eval(expression_black);
    let result_user = eval(expression);

    //      
    Game.findOne({ title: process.env.GAME_TITLE }, async function (err, result) {
        if (err) {
            res.send("Error in fetching game");
        } else {
            if (!errors.isEmpty()) {
                console.log(errors);
                var remaining_time = result.endTime - time;
                let gamer = await User.findOne({ email: req.user.email });
                var level1 = gamer.blackbox_level
                res.render("blackbox_index", {
                    user: req.user,
                    message: "Invalid Input or Empty Field, Kindly Enter a String of non-numeric values as per the instructions ",
                    remaining_time: remaining_time,
                    level1,
                    result: "None",
                    Array: "None"
                })
            }
            else if (req.user.submitted == true) {
                message = "You have already submitted. Please check your rank in the leaderboard";
                req.logout();
                var time_to_start = result.startTime - time;
                res.redirect("/final-leaderBoard");
                // res.render("blackbox_index", {
                //     message: message,
                //     time_to_start: time_to_start
                // });
            }
            else if (level1 == (process.env.BLACK_LEVEL)) {
                message = "Well Done! You have solved all levels. Please check your rank in the leaderboard";
                var time_to_start = result.startTime - time;
                console.log(time_to_start);
                message = "congracts you passed all level blackbox"
                res.redirect('/blackbox_leaderboard');
                // res.render("blackbox_index", {
                //     message: message,
                //     time_to_start: time_to_start
                // });
            }
            else {
                message = "None";
                var remaining_time = result.endTime - time;
                for (i = 0; i < 3; i++) {
                    if (result_user === expression_real) {
                        testcase++
                        console.log("total " + testcase + " passed");
                    }
                    else {
                        console.log("test case failed")
                    }
                    a = a = 20; b = b - 10; c = c + 10;
                }
                if (testcase === 3) {
                    console.log("logic coreect")
                    await User.updateOne({ email: req.user.email }, {
                        $inc: {
                            blackbox_level: 1,
                            black_points: credit, score: credit
                        }
                    });
                    let gamer = await User.findOne({ email: req.user.email });
                    var level1 = gamer.blackbox_level
                    var Array = gamer.Array
                    console.log("here is" + level1 + "is")
                    User.updateOne(
                        { email: req.user.email }, // Specify the document ID or any other parameter to identify the document
                        { $unset: { Array: 1 } } // Use $unset operator to delete the field
                    )
                        .then(result => {
                            console.log('Field data deleted successfully');
                        })
                        .catch(error => {
                            console.error('Failed to delete field data:', error);
                        });

                    res.redirect("/blackbox");
                    // if(level1 === (process.env.BLACK_LEVEL)){
                    //     // res.render("max_level")
                    //     message="congracts you passed all level blackbox"
                    //     res.redirect('/blackbox_leaderboard');
                    //     // res.render("blackbox_index", {
                    //     //     message: message,
                    //     //     time_to_start: time_to_start
                    //     // });


                    // }
                    //  res.render("blackbox_index",{
                    //     level1,
                    //     user: req.user,
                    //     message: message,
                    //     remaining_time: remaining_time,
                    //     result:"None",
                    //     Array:"None"

                    // })

                }
                else {
                    let gamer = await User.findOne({ email: req.user.email });
                    var level1 = gamer.blackbox_level
                    // res.render("failed_testcase",{testcase});
                    message = "Sorry!!!! You Made a Wrong Answer"
                    res.render("blackbox_index", {
                        user: req.user,
                        level1,
                        message: message,
                        remaining_time: remaining_time,
                        x: a, y: b, z: c,
                        result: "None",
                        Array: "None"
                    });
                }
            }

        }
    }
    )



}





exports.add_question = (req, res, next) => {
    const question_no = req.body.question_no;
    const level = req.body.level;
    const answer_expression = req.body.answer_expression;
    const credit = req.body.credit;
    const addQuestion = new Ques_BlackBox({
        question_no: question_no,
        level: level,
        answer_expression: answer_expression,
        credit: credit
    })

    addQuestion.save().then((result) => {
        res.status(201).json({
            message: "question added",
            question: result,
        })
    }).catch((err) => {
        throw err;
    });
}


exports.leaderboard = (req, res) => {
    console.log("req at leaderboard");
    User.find({}).lean().sort({
        blackbox_level: -1
    }).exec(function (err, result) {
        if (err) {
            res.send("Some error occured in fetching leaderboard");
        } else {
            /*
             * Below code is for calculating rank from sorted
             * players data fetched from database
             *  --> Players on equal level will have equal ranks.
             */
            var rank = 0
            var current_rank = 0
            var blackbox_level = 100;
            result.forEach((person, index) => {
                rank += 1;
                if (person.blackbox_level != blackbox_level) {
                    result[index].rank = rank;
                    current_rank = rank;
                } else {
                    result[index].rank = current_rank;
                }
                blackbox_level = person.blackbox_level;
            })

            res.render("blackbox_leaderboard", {
                user: req.user,
                leaderboard: result
            })
        }
    });
}