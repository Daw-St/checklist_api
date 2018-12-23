
const mongoose = require('mongoose');
const Joi = require('joi');
const { userSchema } = require('./user');

const boardSchema = new mongoose.Schema({
    board_admins: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        required: true
    },
    board_members: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        required: true
    },
    board_tasks:{
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task'}],
        default: []
    },
    created_by:{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
        required: true
    },
    board_title:{
        type: String,
        default: 'Untitled Board',
        maxlength: 30
    },
    board_desc:{
        type: String,
        default: 'No description added',
        maxlength: 200
    },
    created_At: {
        type: Date,
        required: true,
        default: Date.now
    },
})

const Board = mongoose.model('Board', boardSchema, 'boards');

function validateBoard(board){
    const schema = {
        board_admins: Joi.array().items(Joi.ObjectId()).required(),
        board_members: Joi.array().items(Joi.ObjectId()).required(),
        board_tasks: Joi.array().items(Joi.ObjectId()),
        created_by: Joi.ObjectId().required(),
        board_title: Joi.string().max(30),
        board_desc: Joi.string().max(200),
        created_At: Joi.date(),
    }
    return Joi.validate(board, schema);
}


exports.validate = validateBoard;
exports.Board = Board ;

