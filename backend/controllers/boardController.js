const Board = require("../models/Board");
const Pin = require("../models/Pin");

//create a new board 
const createBoard = async(req,res)=>{
    const {name,description,isPrivate,coverImage}=req.body;
    const userId=req.user._id;
    try{
        const board = await Board.create({
            name,
            description,
            owner:userId,
            isPrivate:isPrivate||false,
            coverImage:coverImage||null
        });
        res.status(201).json(board);
    }catch(error){
        res.status(500).json({message:'error getting boards'});
    }
};

//get users board 
const getUserBoards = async(req,res)=>{
    try{
        const boards = await Board.find({owner:req.user._id})
              .populate('pins')
              .sort({createdAt:-1})
        
        res.json(boards);
    }catch(error){
        res.status(500).json({message:'error getting boards'});
    }
};

// get a single board with pins
const getBoardById = async(req,res)=>{
    try{
        const board = await Board.findById(req.params.id)
              .populate({
                path:'pins',
                populate:{
                    path:'owner',
                    select:'username profilePicture'
                }
              })
              .populate('owner', 'username profilePicture');
              if(!board){
                return res.status(404).json({message:'board not found'})
              }
              //check if board is private 
              if (board.isPrivate && board.owner._id.toString()!==req.user._id.toString()){
                return res.status(403).json({message:'This board is private'})
              }
              res.json(board);
    }catch(error){
        res.status(500).json({message:'server error'});
    }
};


//add pin to board
const addPinToBoard = async(req,res)=>{
    const {pinId} = req.body;
    try{
        const board = await Board.findById(req.params.id);
        const pin = await Pin.findById(pinId);
        if(!board){
            return res.status(404).json({message:'board not found'});
        }
        if(!pin){
            return res.status(404).json({message:'pin not found'});
        }
        //lets check if the user is owner or collabortor
        const isOwner = board.owner.toString()===req.user._id.toString();
        const isCollaborator = board.collaborators.some(collab=>
            collab.toString()===req.user._id.toString()
        );
        if(!isOwner && !isCollaborator){
            return res.status(403).json({message:'you are not authorized to add pin to this board'})
        }
        //check if pin is already in the board
        if (board.pins.includes(pinId)){
            return res.status(400).json({message:'pin already in the board'})
        }
        board.pins.push(pinId);
        await board.save();
        //lets update pin board
        pin.board = board._id;
        await pin.save();
    
    }catch(error){
        res.status(500).json({message:'error getting boards'});
    }
}

module.exports = { createBoard, getUserBoards, getBoardById, addPinToBoard };
