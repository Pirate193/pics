const User = require('../models/User');
const {ErrorResponse}= require('../utils/errorHandler');
const {generateToken,generateTokenExpiry,getJwtToken,verifyGoogleToken}=require('../services/tokenService');
const {sendVerificationEmail,sendPasswordResetEmail}=require('../services/emailService');

exports.register = async (req,res,next)=>{
    const {username,email,password}= req.body;
    try{
        //check if user already exissts
        const existingUser = await User.findOne({email});
        if(existingUser){
            return next(new ErrorResponse('user already exists with this email',400));
        }
        //create verification token
        const verificationToken = generateToken();

        //create user
        const user = await User.create({
            username,
            email,
            password,
            emailVerificationToken: verificationToken,
            emailVerificationExpires: generateTokenExpiry() // 1 hour expiry
        });

        // lets now send the verification email
        await sendVerificationEmail(email,verificationToken);

        //create a token 
        const token = getJwtToken(user._id);

        //send token in cookie and response
        sendTokenResponse(user,201,res);
    }catch (err){
        next(err);
    }
};

//now for the login 
exports.login = async (req,res,next)=>{
    const {email,password}= req.body; //we are using email and password for login and we are requesting them from the client
    try{
        //lets validate email and password
        if(!email || !password){
            return next(new ErrorResponse('please provide an email and password',400));
        }

        //lets check if user exists 
        const user = await User.findOne({email}).select('+password'); //we are selecting the password field because we excluded it from queries by default
        if(!user){
            return next(new ErrorResponse('Invalid credentials',401));
        }
        //check if password matches 
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return next(new ErrorResponse('Invalid credentials',401));
        }
        //check if email is verified also skip for google users
        if (!user.isVerified && !user.googleId){
            return next(new ErrorResponse('please verify your email',401));
        }
        //create a token
        sendTokenResponse(user,200,res);
    }catch(err){
        next(err);
    }
};

//verify email
exports.verifyEmail = async (req,res,next)=>{
    const {token} = req.params; //we are getting the token from the url
    try{
        const user = await User.findOne({
            emailVerificationToken:token,
            emailVerificationExpires: {$gt: Date.now()}
        });
        if(!user){
            return next(new ErrorResponse('Invalid or expired token',400));
        }
        //mark  user as verified and clear the token and expiry
        user.isVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();
        //send token to automaticllay log in the user
        sendTokenResponse(user,200,res);
    }catch(err){
        next(err);
    }
};

//forgot password 
exports.forgotPassword = async (req,res,next)=>{
    const {email} = req.body; //we are getting the email from the request body
    try{
        const user = await User.findOne({email});
        //dont send email if user does not exist
        if(!user){
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        //get reset token 
        const resetToken = generateToken();
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = generateTokenExpiry();
        await user.save();
        //send email
        try{
            await sendPasswordResetEmail(email,resetToken);
            res.status(200).json({
                success: true,
                message: 'Password reset email sent'
            });
        }catch (err){
            //reset the token and expiry if email fails
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();
            return next(new ErrorResponse('Failed to send password reset email',500));
        }
    }catch(err){
        next(err);
    }
};

// reset password 
exports.resetPassword = async (req,res,next)=>{
    const {token} = req.params; //we are getting the token from the url
    const {password} = req.body;
    try{
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: {$gt: Date.now()}
        });
        if(!user){
            return next(new ErrorResponse('Invalid or expired token',400));
        }
        //set new password
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        //send token to automatically log in the user
        sendTokenResponse(user,200,res);
    }catch(err){
        next(err);
    }

};
// get current user
exports.getMe = async (req,res,next)=>{
    try{
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    }catch(err){
        next(err);
    }
};

// logout user
exports.logout = async(req,res,next)=>{
    res.cookie('token','none',{
        expires: new Date(Date.now() + 10 * 1000), // Set cookie to expire in 10 seconds
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        // sameSite: 'strict' // Helps prevent CSRF attacks
    });
    res.status(200).json({
        success: true,
        data: {}
    });
};

// authenticate with Google
exports.googleAuth = async (req, res, next) => {
    const { idToken} = req.body; // Get the ID token from the request body
    try {
        //verify google id token 
        const payload = await verifyGoogleToken(idToken);
        const {email, name:username, picture, sub: googleId} = payload; // Extract necessary fields from the payload
        //check if user already exists
        let user = await User.findOne({email});
        if (!user){
            // create new user if does not exist
            user = await User.create({
                username,
                email,
                password: crypto.randomBytes(20).toString('hex'), // Generate a random password
                googleId,
                isVerified: true // Automatically verify Google users
            })
        } else if (!user.googleId){
            // If user exists but does not have a Google ID, update the user
            user.googleId = googleId;
            await user.save();
        }
    }catch(err){
        next(err);
    }
};

// Helper function to send token response
const sendTokenResponse = (user, statusCode, res) => {
    //create a token 
    const token = getJwtToken(user._id);
    //cookie options
    const options = {
        expires: new Date(Date.now()+ 30 * 24 * 60 * 60 * 1000), // 30 days expiry
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    };
    res
       .status(statusCode)
       .cookie('token', token, options) // Set the token in a cookie
       .json({
         success: true,
       })
}
