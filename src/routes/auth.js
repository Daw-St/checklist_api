
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');




// Base route /api/auth

router
    .route('/')
    .post(authController.auth);




module.exports = router;