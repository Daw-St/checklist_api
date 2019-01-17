
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate } = require('../models/user')
const objectIdValidator = require('../Validators/objectId');

module.exports =  {

    getMe: async function (req, res){
        try {
            const user = await User.findById(req.user._id).select('-password')
            .populate('boards', '_id board_title')
            res.send(user)
        } catch (error) {
            res.status(404).send(error)
        }
    },

    getOneUser: async function(req, res){
        try {
            const { error } = objectIdValidator(req.params.userId);
            if(error) return res.status(400).send(error.details[0].message);

            const user = await User.findById(req.params.userId).populate('invitations');
            if(!user) return res.status(404).send('A user with the given ID was not found.')
            res.send(user)
            
        } catch (error) {

            res.status(500).send('Error occurred')
        }
    },

    getAllUsers: async function(req, res){

        console.log(req.query);
        if(req.query.username){
            console.log(req.query);
            let pattern = new RegExp(`^${req.query.username}`, 'i')
            try {
                const user = await User.find({username: {$regex: pattern}}).select('-__v -password').populate('invitations', 'state board_id')
                res.send(user)
            } catch (error) {
                res.status(404).send(error)
            }
        }

        try {
            const user = await User.find().select('-__v -password')
            res.send(user)
        } catch (error) {
            res.status(404).send(error)
        }
    },

    registerUser: async function(req, res){
        console.log(req.body);
        const { error } = validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        let user = await User.find().or([{ username: req.body.username}, { email: req.body.email}]);
        if(user.length > 0) return res.status(400).send('User already exist.');

        user = new User(_.pick(req.body, ["username", "email","password", "boards", "invitations"]));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    
        await user.save();
        const token = user.generateAuthToken();

        res.header('x-auth-token', token).send(_.pick(user, ["_id", "username", "email", "boards", "invitations"]));
    },
   

}