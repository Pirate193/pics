const User = require("../models/User.js");
const Pin = require("../models/Pin.js");
const Board = require("../models/Board.js");
const cloudinary = require("../config/cloudinary.js");

//getting user profile 
const getUserProfile = async(req,res)=>{
    try{
        const user = await User.findOne({username:req.params.username})
              .select('-password -email')
              .populate('followers','username profilePicture')
              .populate('following','username profilePicture');
        if(!user){
            return res.status(404).json({message:'user not found'});
        }
        // get users pins 
        const pins = await Pin.find({owner:user._id})
            .populate('board','name')
            .sort({createdAt:-1})
            .limit(12);
        //get users boards
        const boards = await Board.find({owner:user._id})
             .populate('pins')
             .sort({createdAt:-1})
             .limit(6);
        
        res.json({
            user,
            pins,
            boards
        });
    }catch(error){
        res.status(500).json({message:'server error'})
    }
};
// follow a user 
const followUser = async(req,res)=>{
    try{
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user._id);

        if(!userToFollow){
            return res.status(404).json({message:"user not found "});
        }
        //check if already following
        if(currentUser.following.includes(userToFollow._id)){
            return res.status(400).json({message:'you are already following '})
        }
        //add to current user following
        currentUser.following.push(userToFollow._id);
        await currentUser.save();
        // add to target user followers 
        userToFollow.followers.push(currentUser._id);
        await userToFollow.save();
        res.json({message:'user followed successfully'})
    }catch(error){
        res.status(500).json({message:'server error'})
    }
};
//unfollow a user 
const unfollowUser = async(req,res)=>{
    try{
        const userToUnfollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user._id);

        if(!userToUnfollow){
            return res.status(404).json({message:"user not found"});
        }
        //check if following 
        if(!currentUser.following.includes(userToUnfollow._id)){
            return res.status(400).json({message:'you are not following this user'})
        }
        //remove from current user following
        currentUser.following = currentUser.following.filter(id=>id.toString()!==userToUnfollow._id.toString());
        await currentUser.save();
        // remove from target user followers
        userToUnfollow.followers = userToUnfollow.followers.filter(id=>id.toString()!==currentUser._id.toString());
        await userToUnfollow.save();

        res.json({message:'user unfollowed successfully'});
    }catch(error){
        res.status(500).json({message:'server error '});
    }
};

//update user profile 
const updateUserProfile = async(req,res)=>{
    const {username,bio}= req.body;
    try{
        const user = await User.findById(req.user._id);
        if(!user){
            return res.status(404).json({message:"user not found"});

        }
        if(req.cloudinary?.image){
            if(user.profilePicture){
                const oldPublicId = user.profilePicture.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`Home/image/${oldPublicId}`);
            }
            user.profilePicture= req.cloudinary.image.url;
            
        }
        if (username) user.username = username;
        if (bio) user.bio = bio;
        
        const updatedUser = await user.save();
        res.json({
            _id:updatedUser._id,
            username:updatedUser.username,
            profilePicture:updatedUser.profilePicture,
            bio:updatedUser.bio
        });
    }catch(error){
        if (req.cloudinary?.image?.public_id) {
            await cloudinary.uploader.destroy(req.cloudinary.image.public_id);
          }
        res.status(500).json({message:'server error'});
    }
};

module.exports = { getUserProfile, followUser, unfollowUser, updateUserProfile };