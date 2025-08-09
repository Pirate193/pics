const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// generates a random token for email verification or password reset
exports.generateToken = function(){
    return crypto.randomBytes(20).toString('hex');
}

// generate a token expiry date 

exports.generateTokenExpiry = function(hours = 1){
    return Date.now() + hours * 3600000;
};

// generate JWT token for authentication
exports.getJwtToken = function(userId){
    return jwt.sign({id:userId},process.env.JWT_SECRET,{
        expiresIn: '1d'
    });
};

// verify google id token
exports.verifyGoogleToken = async function(idToken){
    const {OAuth2Client} = require('google-auth-library');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    try {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        return payload; // Returns user info from Google
    } catch (error) {
        throw new Error('Invalid Google ID token');
    }
};
