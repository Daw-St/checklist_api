
const mongoose = require('mongoose');
const Joi = require('joi');

const invitationSchema = new mongoose.Schema({
    inviter :{
        type: mongoose.Schema.ObjectId,
        required: true
    },
    invited: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    board_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    invitation_message:{
        type: String,
        maxlength: 200,
        default: 'Hello, join our board!'
    },
    state: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: ['pending'],
    },
     created_At: {
        type: Date,
        required: true,
        default: Date.now
    },

})

const Invitation = mongoose.model('Invitation', invitationSchema, 'invitations');

function validateInvitation(invitation){
    const schema = {
        inviter: Joi.ObjectId().required(),
        invited: Joi.ObjectId().required(),
        board_id: Joi.ObjectId().required(),
        invitation_message: Joi.string().max(200),
        state: Joi.string().valid(['pending', 'approved', 'rejected']),
        created_At: Joi.date(),
    }
    return Joi.validate(invitation, schema);
}

exports.invitationSchema = invitationSchema;
exports.validate = validateInvitation;
exports.Invitation = Invitation ;

