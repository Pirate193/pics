const jwt = require('jsonwebtoken');
const User = require('../models/User')

// proect routes by verifying JWT token
exports.protect = async (req,res, next)=>{
    let token;
    //get token from cookie , authourization header
    if (req.cookies.token){
        token = req.cookies.token;
    }else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    //lets make sure token exists
    if(!token){
        return res.status(401).json({
            success: false,
            error: 'Not authorized to access this route'
        });
    }

    try {
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // check if user exists 
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'User not found'
            });
        }
        //check if email is verified also skip for google users
        if (!user.isVerified && !user.googleId){
            return res.status(401).json({
                success: false,
                error: 'please verify your email '
            });
        }
        // attach user to request object
        req.user = user;
        next();
    }catch (err){
        return res.status(401).json({
            success: false,
            error: 'Not authorized to access this route'
        });
    }

};

// authorize  by user role 
exports.authorize = (...roles)=> {
    return (req,res,next)=>{
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};