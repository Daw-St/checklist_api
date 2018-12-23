
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/comments');




// Base route /api/comments

router
    .use(auth)
    .route('/')
    .get(commentsController.getAllComments)
    .post(commentsController.createComment);

router
    .use(auth)
    .route('/:comId')
   // .get(boardsController.getOneBoard)
   // .put(boardsController.updateBoard)
    .delete(commentsController.deleteComment)


module.exports = router;