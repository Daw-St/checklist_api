
const Joi = require('joi');

module.exports = function validateId(objectId){
    
    console.log({objectId: objectId});
    const schema = {
        objectId: Joi.ObjectId().required()
    }
  
    return Joi.validate({objectId: objectId}, schema);
}