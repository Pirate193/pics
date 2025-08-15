const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    pins:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Pin'
    }],
    collaborators:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    isPrivate:{
        type: Boolean,
        default: false
    },
    coverImage:{
        type:String
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

const Board = mongoose.model('Board',boardSchema);
module.exports = Board;