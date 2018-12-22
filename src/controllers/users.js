
const _ = require('lodash');
const { User, validate } = require('../models/user')


module.exports =  {

    getOneUser: async function(req, res){
        try {
            const user = await User.findById(req.params.userId);
            res.send(user)
        } catch (error) {
            res.send(404)
        }
    },

    getAllUsers: async function(req, res){
        try {
            const user = await User.find();
            res.send(user)
        } catch (error) {
            res.send(404)
        }
    },

    registerUser: async function(req, res){
        console.log(req.body);
        const { error } = validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        let user = await User.find().or([{ username: req.body.username}, { email: req.body.email}]);
        if(user.length > 0) return res.status(400).send('User already exist.');

        user = new User(_.pick(req.body, ["username", "email","password", "boards", "invitations"]));
        await user.save();
        res.send(_.pick(user, ["_id", "username", "email", "boards", "invitations"]));
    },
   

}