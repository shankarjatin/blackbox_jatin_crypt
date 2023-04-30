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
		}
        else{
         if(level1 == process.env.BLACK_LEVEL){
                message = "Well Done! You have solved all levels. Please check your rank in the leaderboard";
                    var time_to_start = result.startTime - time;
                    console.log(time_to_start);
                    res.redirect('/blackbox_leaderboard');
                    // res.render("max_level");
            }
            else{
            if (req.user.submitted == true) {
				message = "You have already submitted. Please check your rank in the leaderboard";
				req.logout();
                message="congracts you passed all test"
				var time_to_start = result.startTime - time;
                res.redirect("/final-leaderBoard")
				// res.render("blackbox_index", {
				// 	message: message,
				// 	time_to_start: time_to_start
				// });
        }
        else{
            message = "None";
				var remaining_time = result.endTime - time;
				res.render("blackbox_index", {
					user: req.user,
					message: message,
					remaining_time: remaining_time,
                    level1,
                    Array:"None",
                    result:"None"
				});
        }
    }}
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
//     var userInput = `Result of ${a} ${b} ${c} is ${expression_real}`
//     console.log(userInput)
//     var Array = gamer.Array
//     Array.push(userInput);
//     const addArray = new User({
//         Array:Array
//     })
// addArray.save()
var userInput = `Result of ${a} ${b} ${c} is ${expression_real}`
console.log(userInput)
User.findOneAndUpdate(
    { email: req.user.email }, // Define the parameter and its value to identify the document
    { $push: { Array: userInput } }, // Push the new element into the array
    { new: true } // Set the "new" option to return the updated document
  )
    .then(updatedDocument => {
      console.log('Updated document:', updatedDocument);
    })
    .catch(error => {
      console.error('Failed to update document:', error);
    });
  


// var Array = gamer.Array
// var Array1 = userInput.push(Array);
// const addArray = new User({
//     Array:Array1
// })
// addArray.save()

    // User.findOne().then(document => {
    //     // Fetch the array from the document
       
    //     const myArray = document.myArray;
  
    //     // Push a new value into the array
    //     myArray.push(userInput);
  
    //     // Save the updated document with the modified array
    //     document.save()})
    //     .then(updatedDocument => {
    //         console.log('Updated document:', updatedDocument);
    //       })
    //       .catch(error => {
    //         console.error('Failed to fetch or update document:', error);
    //       });

    // var userInput = `Result of ${a} ${b} ${c} is ${expression_real}`
    //     userInputArray.push(userInput);


    // function addUserInput() {
    //     var userInput = `Result of ${a} ${b} ${c} is ${expression_real}`
    //     userInputArray.push(userInput);
    //     displayUserInputs();
    //   }
    //   function displayUserInputs() {
    //     const displayList = document.getElementById('displayList');
    //     displayList.innerHTML = '';
      
    //     userInputArray.forEach(userInput => {
    //       const listItem = document.createElement('li');
    //       listItem.textContent = userInput;
    //       displayList.appendChild(listItem);
    //     });
    //   }
      




    Game.findOne({ title: process.env.GAME_TITLE }, async function (err, result){
        if (err) {
            res.send("Error in fetching game");
        }else{
            if(!errors.isEmpty()){
                var remaining_time = result.endTime - time;
                res.render("blackbox_index",{
                    user: req.user,
                    message: "Invalid Input or Empty Fields, kindly Enter Positive Integers excluding 0",
                    remaining_time:remaining_time ,
                    level1,
                    result:"None",
                    Array:"None"
                })
            }
            else if (req.user.submitted == true) {
                message = "You have already submitted. Please check your rank in the leaderboard";
                req.logout();
                var time_to_start = result.startTime - time;
                // res.redirect("/final-leaderBoard");

                res.render("blackbox_index", {
                    message: message,
                    time_to_start: time_to_start
                });
            }
            else if(level1 === (process.env.BLACK_LEVEL)){
            message = "Well Done! You have solved all levels. Please check your rank in the leaderboard";
                var time_to_start = result.startTime - time;
                console.log(time_to_start);
                res.redirect('/blackbox_leaderboard');
                // res.render("max_level");
            }
            
            else{
                let gamer = await User.findOne({email:req.user.email} );
                var Array = gamer.Array
                message = "None";
                        var remaining_time = result.endTime - time;
                        res.render("blackbox_index", {
                            user: req.user,
                            level1,
                            message: message,
                            remaining_time: remaining_time,
                            Array:Array,
                            x:a,y:b,z:c,result:expression_real
                    });
            }
    }

    })
}

exports.submit_blackbox = async(req,res)=>{
    const errors=validationResult(req);
    let gamer = await User.findOne({email:req.user.email} );
    var level1 = gamer.blackbox_level
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
                if(!errors.isEmpty()){
                    console.log(errors);
                    var remaining_time = result.endTime - time;
                    res.render("blackbox_index",{
                        user: req.user,
                        message: "Invalid Input or Empty Field, Kindly Enter a String of non-numeric values as per the instructions ",
                        remaining_time:remaining_time ,
                        level1,
                        result:"None",
                        Array:"None"
                    })
                }
                else if(req.user.submitted == true) {
                    message = "You have already submitted. Please check your rank in the leaderboard";
                    req.logout();
                    var time_to_start = result.startTime - time;
                    res.redirect("/final-leaderBoard");
                    // res.render("blackbox_index", {
                    //     message: message,
                    //     time_to_start: time_to_start
                    // });
                }
                else if(level1 == (process.env.BLACK_LEVEL)){
                message = "Well Done! You have solved all levels. Please check your rank in the leaderboard";
                    var time_to_start = result.startTime - time;
                    console.log(time_to_start);
                    message="congracts you passed all level blackbox"
                    res.redirect('/blackbox_leaderboard');
                    // res.render("blackbox_index", {
                    //     message: message,
                    //     time_to_start: time_to_start
                    // });
                }
                else{
                       message = "None";
                        var remaining_time = result.endTime - time;
                        for (i=0;i<3;i++){
                            if(result_user===expression_real){
                                testcase++
                                console.log("total "+ testcase+ " passed");
                            }
                            else{
                                console.log("test case failed")
                            }
                            a=a=20;b=b-10;c=c+10;
                            }
                            if(testcase===3){
                                console.log("logic coreect")
                                await User.updateOne({email:req.user.email},{ $inc: { 
                                    blackbox_level:1,
                                    black_points:credit,score:credit
                                }}) ;
                                let gamer = await User.findOne({email:req.user.email} );
                                var level1 = gamer.blackbox_level 
                                var Array = gamer.Array
                                console.log("here is"+level1+"is")
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
                      else{
                        let gamer = await User.findOne({email:req.user.email} );
                        var level1 = gamer.blackbox_level 
                        // res.render("failed_testcase",{testcase});
                        message="Sorry!!!! You Made a Wrong Answer"
                        res.render("blackbox_index", {
                            user: req.user,
                            level1,
                            message: message,
                            remaining_time: remaining_time,
                            x:a,y:b,z:c,
                            result:"None",
                            Array:"None"
                        });
                      } }
                            
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