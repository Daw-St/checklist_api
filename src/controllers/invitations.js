
//const mongoose = require('mongoose');
const Fawn = require('fawn');
//Fawn.init(mongoose);
const _ = require('lodash');
const { Invitation, validate } = require('../models/invitation')
const { User } = require('../models/user')
const { Board } = require('../models/board')
const objectIdValidator = require('../Validators/objectId');



module.exports =  {

    getOneInvitation: async function(req, res){

        try {
            const { error } = objectIdValidator(req.params.invId);
            if(error) return res.status(400).send(error.details[0].message);

            const invitation = await Invitation.findById(req.params.invId)
            ///.populate('board_members', '_id username email')
            //.populate('board_admins', '_id username')
            //.populate('board_tasks', '_id task_name task_desc')
            

            if(!invitation) return res.status(404).send('A board with the given ID was not found.')
            res.send(invitation);
        } catch (error) {
            res.status(404).send(error)
        }
    },


    getAllInvitations: async function(req, res){
        try { 
            const invitations = await Invitation.find();
            if(invitations.length === 0) return res.status(404).send('Any invitations were not found.')
            res.send(invitations);
        } catch (error) {
            res.status(500).send(error)
        }
    },



    createInvitation: async function(req, res){

        const { error } = validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const invitation = new Invitation(_.pick(req.body, ["inviter", "invited", "board_id", "invitation_message","state"]));
        
        const userToInvite = await User.findById(req.body.invited);
        if(!userToInvite) return res.status(404).send('A user with the given ID was not found.')

        userToInvite.invitations.push(invitation._id)
        const invitations = userToInvite.invitations;

        try {
            new Fawn.Task()
              .save('invitations', invitation)
              .update('users', { _id: userToInvite._id },{
                  invitations: invitations
              })
              .run();
          
              res.send(_.pick(invitation, ["_id", "inviter","invited", "invitation_message", "state", "created_At"]));
          }
          catch(ex) {
              console.log(ex);
            res.status(500).send('Something failed.');
          }
        },
    

    updateInvitation: async function(req, res){
       
            const result =  objectIdValidator(req.params.invId);
            if(result.error !== null) return res.status(400).send(result.error.details[0].message);
 
        
           const { error } = validate(req.body);
           if(error) return res.status(400).send(error.details[0].message);

            let invitation = await Invitation.findById(req.params.invId);
            
            if(!invitation) return res.status(404).send('A invitation with the given ID was not found.')

            const inv = new Invitation({
                inviter : req.body.inviter,
                invited : req.body.invited,
                board_id : req.body.board_id,
                invitation_message : req.body.invitation_message ? req.body.invitation_message : invitation.invitation_message,
                state : req.body.state ? req.body.state : invitation.state
            })

            if(invitation.state === 'pending' && req.body.state === 'approved'){
              
                const user = await User.findById(invitation.invited);
              
                const boardToJoin = await Board.findById(invitation.board_id);
                boardToJoin.board_members.push(user._id)
             
                user.boards.push(invitation.board_id) 
              
                const index = user.invitations.indexOf(invitation._id)

                user.invitations.splice(index, 1);
               
                try {
                    new Fawn.Task()
                      .update('invitations', {_id: invitation._id},{
                        inviter : inv.inviter,
                        invited: inv.invited,
                        board_id : inv.board_id,
                        invitation_message: inv.invitation_message,
                        state : inv.state
                      })
                      .update('users', { _id: user._id },{
                        invitations : user.invitations,
                        boards: user.boards
                    })
                      .update('boards',{_id: boardToJoin._id },{
                        board_members : boardToJoin.board_members
                        })
                      .run();
                      res.send(invitation);
                  }
                  catch(ex) {
                      console.log(ex);
                    res.status(500).send('Something failed.');
                  }

            }else if(invitation.state === 'pending' && req.body.state === 'rejected'){
                console.log('from rejected');

                const user = await User.findById(invitation.invited);
                const index = user.invitations.indexOf(invitation._id)
                user.invitations.splice(index, 1);
                try {
                    new Fawn.Task()
                      .update( 'invitations', { _id : invitation._id},{
                          inviter : inv.inviter,
                          invited: inv.invited,
                          board_id : inv.board_id,
                          invitation_message: inv.invitation_message,
                          state : inv.state
                        }
                      )
                      .update('users', { _id: user._id },{
                        invitations : user.invitations,
                    })
                      .run();
                      res.send(inv);
                  }
                  catch(ex) {
                      console.log(ex);
                    res.status(500).send('Something failed.');
                  }
            }
    },
   

    deleteBoard: async function(req, res){

         const { error } = objectIdValidator(req.params.boardID);
             if(error) return res.status(400).send(error.details[0].message);

         let board = await Board.findByIdAndRemove(req.params.boardId);
         if(!board) return res.status(400).send('A board with the given ID was not found');
         res.send(board)
    },
   

}


