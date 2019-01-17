
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');





// Base route /api/users

router
    .route('/me')
    .get(auth, usersController.getMe)

router
    .route('/')
    //.get([auth, admin], usersController.getAllUsers)
    .get(auth, usersController.getAllUsers)
    .post(usersController.registerUser);




router
    .use(auth)
    .route('/:userId')
    .get(usersController.getOneUser)
    //.put(usersController.updateOneTask)
    //.delete(usersController.deleteOneTask)



module.exports = router;