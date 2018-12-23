
const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/comments');




// Base route /api/comments

router
    .route('/')
    .get(commentsController.getAllComments)
    .post(commentsController.createComment);

router
    .route('/:comId')
   // .get(boardsController.getOneBoard)
   // .put(boardsController.updateBoard)
    .delete(commentsController.deleteComment)


module.exports = router;