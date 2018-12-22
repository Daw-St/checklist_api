const mongoose = require('mongoose');
//const Task = mongoose.model('Task');
const { Task, validate } = require('../models/task')
// second way(require export) => import Task from '../data/tasks.model';

module.exports =  {
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

      getOneTask: async function (req, res) {

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
        const { error } = validate(req.body);
        if(error) return res.status(400).send(error.details[0].message)
        Task
            .create({
                task_name: req.body.task_name,
                task_desc: req.body.task_desc,
                task_type: req.body.task_type
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

    },

    updateOneTask: (req, res) => {
        
        const { error } = validate(req.body);
        if(error) return res.status(400).send(error.details[0].message)

        let taskId = req.params.taskId;
        console.log("Your task ID is: " + taskId);

        Task
            .findById(taskId)
            .exec((err, task) => {
                if(err) {
                    console.log("Something wrong with task id")
                    res
                        .status(500)
                        .json(err);
                        return;
                }
                else if(!task) {
                    console.log("TaskId not found in database: " + taskId)
                    res
                        .status(404)
                        .json({"message": "A task with the given ID was not found"});
                        return;
                }
                    task.task_name =  req.body.task_name;
                    task.task_desc =  req.body.task_desc;
                    task.task_type =  req.body.task_type;
                
                task
                    .save((err, taskUpdated) => {
                    if(err) {
                        res
                            .status(500)
                            .json(err)
                    }
                    else {
                        res
                            .status(200)
                            .json(taskUpdated)
                    }
                })
            })
    },

    deleteOneTask: (req, res) => {

        let taskId = req.params.taskId;

        Task
            .findByIdAndRemove(taskId)
            .exec((err, task) => {
                if(err) {
                    res
                        .status(404)
                        .json(err)
                }
                else {
                    console.log("Task has been deleted id: " + taskId);
                    console.log('task',task);
                    res
                        .status(200)
                        .json(task);
                }
            })

    }

}