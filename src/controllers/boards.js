
const _ = require('lodash');
const { Board, validate } = require('../models/board')
const { User } = require('../models/user')
const objectIdValidator = require('../Validators/objectId');

module.exports =  {

    getOneBoard: async function(req, res){

        try {
            const { error } = objectIdValidator(req.params.boardId);
            if(error) return res.status(400).send(error.details[0].message);

            const board = await Board.findById(req.params.boardId)
            .select('-__v')
            .populate('board_members', '_id username email')
            .populate('board_admins', '_id username email')
            .populate('board_tasks', '_id task_name task_desc task_state')
           // .populate('board_comments', '_id content created_at' )
           .populate({path: 'board_comments'})
           //.populate({
          //  path: 'board_comments',
            // Get friends of friends - populate the 'friends' array for every friend
         //   populate: { path: 'sender_id' }
         // });
        
          
            

         console.log('fetch board');
            if(!board) return res.status(404).send('A board with the given ID was not found.')
            res.send(board);
        } catch (error) {
            res.status(404).send(error)
        }
    },


    getAllBoards: async function(req, res){
        
        if(req.query){
            console.log(req.query.name);
        }
        try { 
            const boards = await Board.find();
            res.send(boards);
        } catch (error) {
            res.status(404).send(error)
        }
    },



    createBoard: async function(req, res){
        //console.log('body',req.body);
        const { error } = validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const user = await User.findById(req.body.created_by);
        if(!user) return res.status(400).send('Invalid id created_by')
        


        //board = new Board(_.pick(req.body, ["board_admins","board_members", "board_title","created_by", "board_desc" ]));
        
        board = new Board({
            board_admins: [req.body.created_by],
            board_members: [req.body.created_by],
            board_title: req.body.board_title,
            created_by: req.body.created_by,
        })


      
       user.boards.push(board._id);
        
        
        await board.save();
        await user.save();
        res.send(_.pick(board, ["_id", "board_admins","board_members", "created_by", "board_title","board_desc", "created_At"]));
    },

    updateBoard: async function(req, res){
       
        try {
            const result =  objectIdValidator(req.params.boardId);
            if(result.error !== null) return res.status(400).send(result.error.details[0].message);
 
        
           const { error } = validate(req.body);
           if(error) return res.status(400).send(error.details[0].message);

            let board = await Board.findById(req.params.boardId);
            if(!board) return res.status(404).send('A board with the given ID was not found.')
            
            board.board_admin = req.body.board_admin;
            board.board_members = req.body.board_members;
            board.board_tasks = req.body.board_tasks ? req.body.board_tasks : board.board_tasks;
            board.board_title = req.body.board_title ? req.body.board_title : board.board_title;
            board.board_desc = req.body.board_desc ? req.body.board_desc : board.board_desc;

            board.save();
            res.send(board)

            

        res.status(200).send(board)
        } catch (error) {
           res.status(500).send('Error occured.')
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