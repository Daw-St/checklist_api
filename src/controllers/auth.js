
const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/user');


module.exports = {
    auth: async function(req, res){
        

        const { error } = validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);

       
        let user = await User.findOne().or([{username: req.body.username}, {email: req.body.email}])
        console.log('auth');
        if(!user) return res.status(400).send('Invalid username or password.')
        console.log(user);

        console.log('auth');
        console.log(user.password);
        console.log(req.body.password);
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        console.log(validPassword);
        if(!validPassword) return res.status(400).send('Invalid username or password.');

        const token = user.generateAuthToken();
        res.send(token);
        
    }
}


function validate(req){
    console.log(req);
    const schema = Joi.object().keys({
        username: Joi.string().min(4).max(16),
        email: Joi.string().email(),
        password: Joi.string().min(5).max(20).required()
    }).xor('username', 'email');
    return Joi.validate(req, schema);
}
