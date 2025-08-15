const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true,
        trim: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    pin:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Pin',
        required: true
    },
    createdAt:{
        type: Date,
        default:Date.now
    }
});

const Comment = mongoose.model('Comment',commentSchema);
module.exports = Comment;