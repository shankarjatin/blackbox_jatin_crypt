const mongoose=require("mongoose");


const questionSchema=new mongoose.Schema({
    question_no:{
        type:Number
    },
    level:{
        type:Number,
    },
    answer_expression:{
        type:String,
    },
    credit:{
        type:Number,
        default:1
    },
    isSubmitted:{
        type:Boolean,
        default:false,
    }
})

const BlackBox_questions=new mongoose.model("BlackBox_question",questionSchema);

module.exports=BlackBox_questions;