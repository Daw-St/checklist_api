
const _ = require('lodash');
const { User, validate } = require('../models/user')
const objectIdValidator = require('../Validators/objectId');

module.exports =  {

    getOneUser: async function(req, res){
      
        try {

            const { error } = objectIdValidator(req.params.userId);
            if(error) return res.status(400).send(error.details[0].message);

            const user = await User.findById(req.params.userId);
            if(!user) return res.status(404).send('A user with the given ID was not found.')
            res.send(user)
            
        } catch (error) {

            res.status(500).send('Error occurred')
        }
    },

    getAllUsers: async function(req, res){
        try {
            const user = await User.find();
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
        await user.save();
        res.send(_.pick(user, ["_id", "username", "email", "boards", "invitations"]));
    },
   

}