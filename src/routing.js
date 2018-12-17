import express from 'express';
let router = express.Router();
import tasksController from '../controllers/tasks'

router
    .route('/')
    .get(tasksController.testFunction);

router
    .route('/tasks')
    .get(tasksController.getAllTasks)
    .post(tasksController.addNewTask);

router
    .route('/tasks/:taskId')
    .get(tasksController.getOneTask);


export default router;