import mongoose from 'mongoose';
let Task = mongoose.model('Task');
// second way(require export) => import Task from '../data/tasks.model';

/*
export default {
    Simplest GET example
    testFunction: (req, res) => {

        return res
                .status(200)
                .json({message: 'It works!'})

    },

const { Task, validate } = require('../models/task')
*/

module.exports =  {

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
            .populate('task_participatns', '_id username')
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
            .populate('task_participatns', '_id username')
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
        console.log(req);
        Task
            .create({
                task_name: req.body.task_name,
                task_desc: req.body.task_desc,
                task_participants: req.body.task_participants,
                task_state: req.body.task_state
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
                        .json({"message": "Task id not found"});
                        return;
                }
                    task.task_name =  req.body.task_name;
                    task.task_desc =  req.body.task_desc;

                    task.task_participants = req.body.task_participants ? req.body.task_participants : task.task_participants,
                    task.task_state =  req.body.task_state;
                    
                
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
                    res
                        .status(204)
                        .json();
                }
            })

    }

}