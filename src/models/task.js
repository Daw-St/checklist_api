
const mongoose = require('mongoose');
const Joi = require('joi');

const taskSchema = new mongoose.Schema({
    task_name: {
        type: String,
        required: true
    },
    task_desc: {
        type: String,
        "default": "No description added"
    },
    task_type: {
        type: Number,
        min: 0,
        max: 1,
        "default": 0
    },
})

const Task = mongoose.model('Task', taskSchema, 'tasks');

function validateTask(task){
    const schema = {
        task_name: Joi.string().required(),
        task_desc: Joi.string(),
        task_type: Joi.number().min(0).max(1).default(0),
    }
    return Joi.validate(task, schema);
}


exports.validate = validateTask;
exports.Task = Task ;


// second way(require import) => export default mongoose.model('Task', tasksShema, 'tasks');