const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');





// Base route /api/users


router
    .route('/')
    .get(usersController.getAllUsers)
    .post(usersController.registerUser);

    router
    .route('/:userId')
    .get(usersController.getOneUser)
    //.put(usersController.updateOneTask)
    //.delete(usersController.deleteOneTask)



module.exports = router;