const mongoose = require("mongoose");

const pinSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        trim: true
    },
    imageUrl:{
        type: String,
        required: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    board:{
        type :mongoose.Schema.Types.ObjectId,
        ref: 'Board'
    },
    tags:[{
        type:String,
        trim:true
    }],
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    Comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
    createdAt:{
        type:Date,
        default: Date.now
    }
});

const Pin = mongoose.model('Pin',pinSchema);
module.exports = Pin;