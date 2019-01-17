
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const invitationsController = require('../controllers/invitations');




// Base route /api/invitations

router
    .use(auth)
    .route('/')
    .get(invitationsController.getAllInvitations)
    .post(invitationsController.createInvitation);

router
    .use(auth)
    .route('/:invId')
    .get(invitationsController.getOneInvitation)
    .put(invitationsController.updateInvitation)
   // .delete(boardsController.)


module.exports = router;