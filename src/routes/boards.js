
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const boardsController = require('../controllers/boards');




// Base route /api/boards

router
    .use(auth)
    .route('/')
    .get(boardsController.getAllBoards)
    .post(boardsController.createBoard);

router
    .use(auth)
    .route('/:boardId')
    .get(boardsController.getOneBoard)
    .put(boardsController.updateBoard)
   // .delete(boardsController.)


module.exports = router;