const Pin = require('../models/Pin');
const Board = require('../models/Board');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

const createPin = async (req,res)=>{
    try{
        const {title,description,boardId,tags}=req.body;
        const userId=req.user._id;
        //lets now upload to cloudinary
        if (!req.cloudinary|| !req.cloudinary.image){
            return res.status(400).json({message:'image upload failed '})
        }
        const pin = await Pin.create({
            title,
            description,
            imageUrl: result.secure_url,
            owner:userId,
            board:boardId,
            tags:tags?tags.split(',').map(tag=>tag.trim()):[]
        });
        //add pin to board
        if (boardId){
            await Board.findByIdAndDelete(
                boardId,
                {$push:{pins:pin._id}},
                {new:true}
            );
        }
        // add pin to user's created pins
        await User.findByIdAndDelete(
            userId,
            {$push:{createdPins:pin._id}},
            {new:true}
        );
        res.status(201).json(pin);
    }catch(error){
        //delete uploaded file if pin creation fails
        if (req.cloudinary?.image?.public_id){
            await cloudinary.uploader.destroy(req.cloudinary.image.public_id);
        }
        res.status(500).json({message:'error creating pin ',error:error.message});
    }
};
const getPins = async (req,res)=>{
    try{
        const {search,tag}=req.query;
        let query = {};
        if (search){
            query.title={$regex:search,$options:'i'};
        }
        if (tag){
            query.tags=tag;
        }
        const pins = await Pin.find(query)
            .populate('owner','username profilePicture')
            .populate('board','name')
            .sort({createdAt: -1});
        
        res.json(pins);
    }catch(error){
        res.status(500).json({message:'server error in getting pins'})
    }
};

const getPinsById = async(req,res)=>{
    try{
        const pin = await Pin.findById(req.params.id)
              .populate('owner','username profilePicture')
              .populate('board', 'name')
              .populate({
                path:'comments',
                populate:{
                    path:'author',
                    select:'username profilePicture'
                }
              });
              if(!pin){
                return res.status(404).json({message:'pin not found'});
              
              }
              res.json(pin);
    }catch(error){
        res.status(500).json({message:'sever error in getting pin'})
    }
};

const likePin = async(req,res)=>{
    try{
        const pin = await Pin.findById(req.params.id);
        
        if(!pin){
            return res.status(404).json({message:'pin not found'});
        }
        // check if already liked
        if(pin.likes.includes(req.user._id)){
            return res.status(400).json({message:'pin already liked'})
        }
        pin.likes.push(req.user._id);
        await pin.save();
        res.json({message:'pin liked successfully'})
    }catch (error){
        res.status(500).json({message:'sever error in getting pin'})
    }
};
const savePin = async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(user.savedPins.includes(req.params.id)){
            return res.status(400).json({message:'Pin already saved'});
        }
        user.savedPins.push(req.params.id);
        await user.save();
        res.json({message:'pin saved'})
    }catch(error){
        res.status(500).json({message:'sever error'})
    }
};

module.exports = { createPin, getPins, getPinsById, likePin, savePin };