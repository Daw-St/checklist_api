
const _ = require('lodash');
const { Comment, validate } = require('../models/comment');
const { Board } = require('../models/board');
const objectIdValidator = require('../Validators/objectId');

const mongoose = require('mongoose');
const Fawn = require('fawn');
//Fawn.init(mongoose);

module.exports = {

    getAllComments: async function (req, res) {
        console.log('comm');
        const comments = await Comment.find();
        if(!comments) return res.status(400).send('No comments were found.');
        res.send(comments);   
    },

    createComment: async function (req, res) {
        
        const { error } = validate(req.body)
        if(error) return res.status(400).send(error.details[0].message);


        const comment = new Comment({
            content: req.body.content,
            board_id: req.body.board_id,
            sender: {
                _id : req.body.sender_id,
                username: req.body.username
            }
        })
        const board = await Board.findById(req.body.board_id);
        if(!board) return res.status(400).send('Invalid board_id');
        board.board_comments.push(comment._id);

        try {
            new Fawn.Task()
              .save('comments', comment)
              .update('boards', { _id: board._id },{
                board_comments : board.board_comments
            })
              .run();
              res.send(comment);
          }
          catch(ex) {
              console.log(ex);
            res.status(500).send('Something failed.');
          }
    },

    deleteComment: async function(req, res){
        const { error } = objectIdValidator(req.params.comId);
        if(error) return res.status(400).send(eror.details[0].message);

        const comment = await Comment.findByIdAndRemove(req.params.comId);
        res.send(comment);
    }


}


// createComment: async function (req, res) {
        
//     const { error } = validate(req.body)
//     if(error) return res.status(400).send(error.details[0].message);

//     const comment = new Comment({
//         content: req.body.content,
//         board_id: req.body.board_id,
//         sender_id: req.body.sender_id
//     })
//     const board = await Board.findById(req.body.board_id);
//     if(!board) return res.status(400).send('Invalid board_id');
//     board.board_comments.push(comment._id);

//     try {
//         new Fawn.Task()
//           .save('comments', comment)
//           .update('boards', { _id: board._id },{
//             board_comments : board.board_comments
//         })
//           .run();
//           res.send(comment);
//       }
//       catch(ex) {
//           console.log(ex);
//         res.status(500).send('Something failed.');
//       }
// }