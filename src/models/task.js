
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
    task_participants: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        default: []
    },
    task_state: {
        type: String,
        enum: ['toDo', 'doing', 'done'],
        "default": 'toDo'
    },
})

const Task = mongoose.model('Task', taskSchema, 'tasks');

function validateTask(task){
    const schema = {
        task_name: Joi.string().required(),
        task_desc: Joi.string(),
        task_participants: Joi.array().items(Joi.ObjectId()),
        task_state: Joi.string().valid(['toDo','doing','done']).default('toDo'),
    }
    return Joi.validate(task, schema);
}

exports.taskSchema = taskSchema;
exports.validate = validateTask;
exports.Task = Task ;


// second way(require import) => export default mongoose.model('Task', tasksShema, 'tasks');