const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        ]

    },
    password:{
        type: String,
        required: true,
        minlength: 8,
        select: false // Exclude password from queries by default
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows for null values without index conflicts
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    profilePicture:{
        type:String,
        default:''
    },
    bio:{
        type: String,
        default:'',
        maxlength:200
    },
    followers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    following:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    savedPins:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Pin'
    }]
});

userSchema.pre('save', async function(next){
    //only runs if password is modified
    if(!this.isModified('password')) return next();
    try{
        //we are generating a salt
        //10 is the number of rounds to generate the salt
        //the higher the number, the more secure but slower it is
        const salt = await bcrypt.genSalt(10);
        //hash the password
        this.password = await bcrypt.hash(this.password,salt);
        next();
    }catch(error){
        next(error);
    }
});


// methods to compare passwords 
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword,this.password);

};

module.exports= mongoose.model('User', userSchema);