
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasks');




// Base route /api/tasks

router
    .use(auth)
    .route('/')
    .get(tasksController.getAllTasks)
    .post(tasksController.createTask);

router
    .use(auth)
    .route('/:taskId')
    .get(tasksController.getOneTask)
    .put(tasksController.updateOneTask)
    .delete(tasksController.deleteOneTask)


module.exports = router;