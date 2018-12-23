
const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 16
    },
    email: {
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
        minlength:5,
        maxlength: 1024
    },
    boards: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board'}],
        default: []
    },
    invitations:{
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Invitation'}],
        default: []
    }
})

const User = mongoose.model('User', userSchema, 'users');

function validateUser(user){
    const schema = {
        username: Joi.string().min(4).max(16).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(5).max(20).required(),
        boards: Joi.array(),
        invitations: Joi.array(),
    }
    return Joi.validate(user, schema);
}

exports.userSchema = userSchema;
exports.validate = validateUser;
exports.User = User ;

