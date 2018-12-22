var mongoose = require('mongoose');

var tasksShema = new mongoose.Schema({
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
    }
})

mongoose.model('Task', tasksShema, 'tasks');
// second way(require import) => export default mongoose.model('Task', tasksShema, 'tasks');