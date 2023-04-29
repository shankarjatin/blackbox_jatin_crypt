const Ques_BlackBox=require("../models/question_blackbox");
const User = require("./../models/user.js");
const Game = require("./../models/game");
const {validationResult}=require("express-validator");


exports.FirstPage =async (req,res)=>{
    let gamer = await User.findOne({email:req.user.email} );
    var level1 = gamer.blackbox_level;
    var time = new Date();

    Game.findOne({ title: process.env.GAME_TITLE }, function (err, result){

        if (err) {
			res.send("Error in fetching game");
		}else{
            if (req.user.submitted == true) {
				message = "You have already submitted. Please check your rank in the leaderboard";
				req.logout();
				var time_to_start = result.startTime - time;
				res.render("blackbox_index", {
					message: message,
					time_to_start: time_to_start
				});
        }else if(req.user.
                blackbox_level == process.env.Black_Max_level){
                console.log("inside max level");
                message = "Well Done! You have solved all levels. Please check your rank in the leaderboard";
                    var time_to_start = result.startTime - time;
                    console.log(time_to_start);
                    res.render("home", {
                        message: message,
                        time_to_start: time_to_start
                });

        }else{
            message = "None";
				var remaining_time = result.endTime - time;
				res.render("blackbox_index", {
					user: req.user,
					message: message,
					remaining_time: remaining_time,
                    level1,
                    result:"None"
				});
        }
    }
})
}

exports.black_ques = async (req,res,next)=>{
    const errors=validationResult(req);   
    var time = new Date();
    let a = parseInt(req.body.num1);
    let b = parseInt(req.body.num2);
    let c = parseInt(req.body.num3);
    let gamer = await User.findOne({email:req.user.email} );
    var level1 = gamer.blackbox_level;
    let ques_game = await Ques_BlackBox.findOne({level:level1})
    var expression_black = ques_game.answer_expression;
    var expression_real = eval(expression_black);
    console.log(level1)
    console.log(expression_real);

    Game.findOne({ title: process.env.GAME_TITLE }, function (err, result){
        if (err) {
            res.send("Error in fetching game");
        }else{
            if(!errors.isEmpty()){
                var remaining_time = result.endTime - time;
                res.render("blackbox_index",{
                    user: req.user,
                    message: "Invalid Input, Enter Integers ",
                    remaining_time:remaining_time ,
                    level1,
                })
            }
            else if (req.user.submitted == true) {
                message = "You have already submitted. Please check your rank in the leaderboard";
                req.logout();
                var time_to_start = result.startTime - time;
                res.render("blackbox_index", {
                    message: message,
                    time_to_start: time_to_start
                });
            }else if(req.user.blackbox_level == process.env.Black_Max_level){
            message = "Well Done! You have solved all levels. Please check your rank in the leaderboard";
                var time_to_start = result.startTime - time;
                console.log(time_to_start);
                res.render("blackbox_index", {
                    message: message,
                    time_to_start: time_to_start
                });
            }else{
                 message = "None";
                        var remaining_time = result.endTime - time;
                        res.render("blackbox_index", {
                            user: req.user,
                            level1,
                            message: message,
                            remaining_time: remaining_time,
                            x:a,y:b,z:c,result:expression_real
                    });
            }
    }

    })
}

exports.submit_blackbox = async(req,res)=>{
    let gamer = await User.findOne({email:req.user.email} );
    var level1 = gamer.blackbox_level;
    let ques_game = await Ques_BlackBox.findOne({level:level1})
    var expression_black = ques_game.answer_expression;
    let credit=ques_game.credit;
    let time=Date.now();
    
                let a=Math.floor(Math.random() * 101);
                let b=Math.floor(Math.random() * 101);
                let c=Math.floor(Math.random() * 101);;
                let testcase=0;
                const expression =  req.body.user_expression.toLowerCase();
                var expression_real = eval(expression_black);
                let result_user = eval(expression);
                
        //      
        Game.findOne({ title: process.env.GAME_TITLE }, async function (err, result){
            if (err) {
                res.send("Error in fetching game");
            }else{
                if (req.user.submitted == true) {
                    message = "You have already submitted. Please check your rank in the leaderboard";
                    req.logout();
                    var time_to_start = result.startTime - time;
                    res.render("blackbox_index", {
                        message: message,
                        time_to_start: time_to_start
                    });
                }else if(req.user.level == process.env.MAX_LEVEL){
                message = "Well Done! You have solved all levels. Please check your rank in the leaderboard";
                    var time_to_start = result.startTime - time;
                    console.log(time_to_start);
                    res.render("blackbox_index", {
                        message: message,
                        time_to_start: time_to_start
                    });
                }else{
                       message = "None";
                        var remaining_time = result.endTime - time;
                        for (i=0;i<3;i++){
                            if(result_user===expression_real){
                                testcase++
                                        console.log("total "+ testcase+ " passed");
                                }
                            else{console.log("test case failed")}
                            a=a=20;b=b-10;c=c+10;
                            }
                            if(testcase===3)
                            {console.log("logic coreect")
            
                            await User.updateOne({email:req.user.email},{ $inc: { blackbox_level: 1,black_points:credit,score:credit}})
            
                        //     let gamer1 = await  User.findOne({email:req.user.email} );
                        //    var level12= gamer1.blackbox_level + 1;
                           
                        let gamer = await User.findOne({email:req.user.email} );
                        var level1 = gamer.blackbox_level; 
                        res.render("blackbox_index",{
                            level1,
                            user: req.user,
                            message: message,
                            remaining_time: remaining_time,
                            result:"None"

                        })
                      }
                      else{
                        res.render("failed_testcase",{testcase});
                      } }
                              





                        // res.render("blackbox_submission", {
                        //     user: req.user,
                        //     message: message,
                        //     remaining_time: remaining_time,
                        //     x:a,y:b,z:c,result:expression_real
                        // }); 
                    }
                    }
                )
        


}





exports.add_question=(req,res,next)=>{
    const question_no=req.body.question_no;
    const level=req.body.level;
    const answer_expression=req.body.answer_expression;
    const credit=req.body.credit;
    const addQuestion=new Ques_BlackBox({
        question_no:question_no,
        level:level,
        answer_expression:answer_expression,
        credit:credit
    })

    addQuestion.save().then((result) => {
        res.status(201).json({
            message:"question added",
            question:result,
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