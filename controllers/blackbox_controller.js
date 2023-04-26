const Ques_BlackBox=require("../models/question_blackbox");

exports.FirstPage = (req,res)=>{
    res.render("blackbox_index")
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