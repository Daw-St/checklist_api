const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasks');




// Base route /api/tasks

router
    .route('/')
    .get(tasksController.getAllTasks)
    .post(tasksController.addNewTask);

router
    .route('/:taskId')
    .get(tasksController.getOneTask)
    .put(tasksController.updateOneTask)
    .delete(tasksController.deleteOneTask)


module.exports = router;