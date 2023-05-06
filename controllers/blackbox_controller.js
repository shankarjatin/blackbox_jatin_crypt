const Ques_BlackBox = require("../models/question_blackbox");
const User = require("./../models/user.js");
const Game = require("./../models/game");
const { validationResult } = require("express-validator");

exports.getBlackbox = async (req, res) => {
    const email = req.user.email;
    var time = new Date();
    let gamer = await User.findOne({ email: email });
    Game.findOne({ title: process.env.GAME_TITLE }, async function (err, result) {
        var question;
        if (process.env.BLACK_LEVEL > gamer.blackbox_level) {
            question = await Ques_BlackBox.findOne({ level: gamer.blackbox_level });
            var remaining_time = result.endTime - time;
            res.render("blackbox_index", {
                user: gamer,
                level: gamer.blackbox_level + 1,
                variableCount: question.no_of_variables,
                remaining_time: remaining_time
            });
        }
        else {
            message = "Well Done! You have solved all levels. Please check your rank in the leaderboard";
            res.json({
                success: true,
                message: message,
                redirect: true,
                url: process.env.DEPLOYMENT + "/blackbox_leaderboard"
            })
        }
    })
}

exports.postBlackbox = async (req, res) => {
    const email = req.user.email;
    let gamer = await User.findOne({ email: email });
    var level = gamer.blackbox_level;
    Game.findOne({ title: process.env.GAME_TITLE }, async function (err, result) {
        if (err) {
            res.json({
                success: false,
                message: "Error in fetching game",
                redirect: false
            })
        }
        else {
            if (level == process.env.BLACK_LEVEL) {
                message = "Well Done! You have solved all levels. Please check your rank in the leaderboard";
                res.json({
                    success: true,
                    message: message,
                    redirect: true,
                    url: process.env.DEPLOYMENT + "/blackbox_leaderboard"
                })
            }
            else {
                if (req.user.submitted == true) {
                    message = "You have already submitted. Please check your rank in the leaderboard";
                    req.logout();
                    res.json({
                        success: true,
                        message: message,
                        redirect: true,
                        url: process.env.DEPLOYMENT + "/final-leaderBoard"
                    })
                }
                else {
                    res.json({
                        success: true,
                        redirect: true,
                        url: process.env.DEPLOYMENT + "/blackbox"
                    })
                }
            }
        }
    })
}

exports.black_ques = async (req, res, next) => {
    try {
        let a = 0, b = 0, c = 0, d = 0, e = 0, f = 0, g = 0;
        let variables = [], i = 0;
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
                res.json({
                    success: false,
                    message: "Error in fetching game",
                    redirect: false
                })
            } else {
                if (variables.length != ques_game.no_of_variables) {
                    const message = "Invalid Input or Empty Fields, kindly Enter Positive Integers excluding 0"
                    res.json({
                        success: false,
                        message: message,
                        redirect: false
                    })
                }
                else if (req.user.submitted == true) {
                    message = "You have already submitted. Please check your rank in the leaderboard";
                    req.logout();
                    res.json({
                        success: true,
                        message: message,
                        redirect: true,
                        url: process.env.DEPLOYEMENT + "/final-leaderBoard"
                    })
                }
                else if (level1 == (process.env.BLACK_LEVEL)) {
                    message = "Well Done! You have solved all levels. Please check your rank in the leaderboard";
                    res.json({
                        success: true,
                        message: message,
                        redirect: true,
                        url: process.env.DEPLOYEMENT + "/blackbox_leaderboard"
                    })
                }
                else {

                    User.findOneAndUpdate(
                        { email: req.user.email },
                        { $push: { Array: userInput } },
                        { new: true } // Set the "new" option to return the updated document
                    )
                        .then(data => {
                            res.json({
                                success: true,
                                redirect: false,
                                attempts: data.Array
                            });
                        })
                        .catch(error => {
                            console.error('Failed to update document:', error);
                        });
                }
            }

        })
    }
    catch (err) {
        console.log(err);
        res.send("Unexpected Error Occured");
    }
}

exports.submit_blackbox = async (req, res) => {
    try {
        const errors = validationResult(req);
        let gamer = await User.findOne({ email: req.user.email });
        let ques_game = await Ques_BlackBox.findOne({ level: gamer.blackbox_level });
        const expression = req.body.user_expression.toString().toLowerCase();
        var expression_black = ques_game.answer_expression;
        let credit = ques_game.credit;
        let time = Date.now();

        //declaring variables as per requirement and running testcases
        let a, b, c, d, e, f, g;
        let variables = [];
        let testcase = 0, success = true;
        while (testcase < 3) {
            for (let i = 1; i <= ques_game.no_of_variables; i++) {
                if (i == 1) {
                    a = Math.floor(Math.random() * 101);
                    variables[i - 1] = 'a';
                }
                else if (i == 2) {
                    b = Math.floor(Math.random() * 101);
                    variables[i - 1] = 'b';
                }
                else if (i == 3) {
                    c = Math.floor(Math.random() * 101);
                    variables[i - 1] = 'c';
                }
                else if (i == 4) {
                    d = Math.floor(Math.random() * 101);
                    variables[i - 1] = 'd';
                }
                else if (i == 5) {
                    e = Math.floor(Math.random() * 101);
                    variables[i - 1] = 'e';
                }
                else if (i == 6) {
                    f = Math.floor(Math.random() * 101);
                    variables[i - 1] = 'f';
                }
                else if (i == 7) {
                    g = Math.floor(Math.random() * 101);
                    variables[i - 1] = 'g';
                }
            }
            var expression_real = eval(expression_black);
            let result_user = eval(expression);
            if (expression_real === result_user) {
                testcase++;
            }
            else {
                success = false;
                break;
            }

        }

        Game.findOne({ title: process.env.GAME_TITLE }, async function (err, result) {
            if (err) {
                res.json({
                    success: false,
                    message: "Error in fetching game",
                    redirect: false
                })
            } else {
                if (!errors.isEmpty()) {
                    const message = "Invalid Input or Empty Field, Kindly Enter a String of non-numeric values as per the instructions";
                    res.json({
                        success: false,
                        redirect: false,
                        message: message
                    })
                }
                else if (req.user.submitted == true) {
                    message = "You have already submitted. Please check your rank in the leaderboard";
                    req.logout();
                    res.json({
                        success: true,
                        redirect: true,
                        message: message,
                        url: process.env.DEPLOYMENT + "/final-leaderBoard"
                    })
                }
                else if (gamer.level == (process.env.BLACK_LEVEL)) {
                    message = "Well Done! You have solved all levels. Please check your rank in the leaderboard";
                    res.json({
                        success: true,
                        redirect: true,
                        message: message,
                        url: process.env.DEPLOYMENT + "/blackbox_leaderboard"
                    })
                }
                else {
                    if (success == false) {
                        message = "Sorry!!! You guessed it wrong"
                        res.json({
                            success: false,
                            redirect: false,
                            message: message
                        })
                    }
                    else {
                        User.findOneAndUpdate(
                            { email: req.user.email },
                            {
                                $unset: { Array: 1 }, // Use $unset operator to delete the field
                                $inc: {
                                    blackbox_level: 1,
                                    black_points: credit,
                                    score: credit
                                }
                            }, { new: true }
                        ).then(result => {
                            if (result.blackbox_level == process.env.BLACK_LEVEL) {
                                message = "Well Done! You have solved all levels. Please check your rank in the leaderboard";
                                return res.json({
                                    success: true,
                                    redirect: true,
                                    message: message,
                                    url: process.env.DEPLOYMENT + "/blackbox_leaderboard"
                                })
                            }
                            message = "Well Done! You guessed it correct";
                            res.json({
                                success: true,
                                redirect: false,
                                message: message
                            })
                        })
                            .catch(error => {
                                message = "Please try again"
                                res.json({
                                    success: false,
                                    redirect: false,
                                    message: message
                                })
                            });
                    }
                }
            }
        })
    } catch (err) {
        console.log(err);
        res.send("Unexpected Error Occured");
    }
}

exports.add_question = (req, res, next) => {
    const question_no = req.body.question_no;
    const level = req.body.level;
    const answer_expression = req.body.answer_expression;
    const credit = req.body.credit;
    const instructions = req.body.instructions;
    const no_of_variables = req.body.no_of_variables;

    const addQuestion = new Ques_BlackBox({
        question_no: question_no,
        level: level,
        answer_expression: answer_expression,
        instructions,
        no_of_variables,
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
    const message = req.query.message || "None";
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
                leaderboard: result,
                message: message
            })
        }
    });
}
