import mongoose from 'mongoose';
let Task = mongoose.model('Task');

export default {
    // Simplest GET example
    testFunction: (req, res) => {

        return res
                .status(200)
                .json({message: 'It works!'})

    },

    getAllTasks: (req, res) => {

        let count = 30;

        if(req.query && req.query.count) {
            count = parseInt(req.query.count, 10);
        }

        // example problem handling
        if(isNaN(count)) {
            res
                .status(400)
                .json({message: " Count should be a number"});
            return;
        }

        Task
            .find()
            .limit(count)
            .exec((err, tasks) => {
                let resp = {
                    status: 200,
                    message: tasks
                }
                if(err) {
                    console.log("Error in tasks");
                    resp.status = 500
                    resp.json = err;
                }
                console.log("Found tasks", tasks.length);
                res
                    .status(resp.status)
                    .json(resp.message);
            })

    },

    getOneTask: (req, res) => {

        let taskId = req.params.taskId;
        console.log("Your task ID is: " + taskId);

        Task
            .findById(taskId)
            .exec((err, doc) => {
                let resp = {
                    status: 200,
                    message: doc
                }
                if(err) {
                    console.log("Something wrong with task id")
                    resp.status = 500
                    resp.message = err;
                }
                else if(!doc) {
                    resp.status = 400
                    resp.message = {
                        "message": "Task id not found"
                    };
                }
                res
                    .status(resp.status)
                    .json(resp.message)
            })
    },

    addNewTask: (req, res) => {

        Task
            .create({
                task_name: req.body.name,
                task_desc: req.body.desc,
                task_type: req.body.type
                //task_name: "buy a present",
                //task_desc: "something special for christmas",
                //task_type: 0,
            }, (err, task) => {
                if(err) {
                    console.log("Error creating new task");
                    res
                        .status(400)
                        .json(err)
                }
                else {
                    console.log("Task created " + task)
                    res
                        .status(200)
                        .json(task);
                }
            });

    }

}