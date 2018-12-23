
const mongoose = require('mongoose');
const Joi = require('joi');

const commentSchema = new mongoose.Schema({

    content: {
        type: String,
        required: true,
        maxlength: 200
    },
    board_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    sender: {
        type: new mongoose.Schema({
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            username: {
                type: String,
                required: true,
            },
        }),
        required: true
    },
    created_at:{
        type: Date,
        default: Date.now,
        required: true,
    }    
})


const Comment = mongoose.model('Comment', commentSchema, 'comments');

function validateComment(comment){
    const schema = {
        content: Joi.string().max(200).required(),
        board_id: Joi.ObjectId().required(),
        sender_id: Joi.ObjectId().required(),
        username: Joi.string().required()
    }
    return Joi.validate(comment, schema)
}

exports.commentSchema = commentSchema;
exports.Comment = Comment;
exports.validate = validateComment;




// const mongoose = require('mongoose');
// const Joi = require('joi');

// const commentSchema = new mongoose.Schema({

//     content: {
//         type: String,
//         required: true,
//         maxlength: 200
//     },
//     board_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//     },
//     sender_id: {
//          type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//          required: true
//     },
//     created_at:{
//         type: Date,
//         default: Date.now,
//         required: true,
//     }    
// })


// const Comment = mongoose.model('Comment', commentSchema, 'comments');

// function validateComment(comment){
//     const schema = {
//         content: Joi.string().max(200).required(),
//         board_id: Joi.ObjectId().required(),
//         sender_id: Joi.ObjectId().required()
//     }
//     return Joi.validate(comment, schema)
// }

// exports.commentSchema = commentSchema;
// exports.Comment = Comment;
// exports.validate = validateComment;