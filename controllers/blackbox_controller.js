const Ques_BlackBox=require("../models/question_blackbox");
const User = require("./../models/user.js");
exports.FirstPage = (req,res)=>{
    res.render("blackbox_index")
}

exports.black_ques = async (req,res)=>{
    let a = parseInt(req.body.num1);
    let b = parseInt(req.body.num2);
    let c = parseInt(req.body.num3);
    let gamer = await User.findOne({email:req.user.email} );
    var level1 = gamer.blackbox.level;
    let ques_game = await Ques_BlackBox.findOne({level:level1})
    var expression_black = ques_game.answer_expression;
    var expression_real = eval(expression_black);
    console.log(expression_real);
}

exports.add_question=(req,res,next)=>{
    const question_no=req.body.question_no;
    const level=req.body.level;
    const answer_expression=req.body.answer_expression;

    const addQuestion=new Ques_BlackBox({
        question_no:question_no,
        level:level,
        answer_expression:answer_expression,
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