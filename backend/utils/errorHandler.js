class ErrorResponse extends  Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
    }
}

const errorHandler = (err, req, res , next)=>{
    let error = {...err};
    error.message = err.message;
    //log to console for dev
    console.error(err.stack.red);

    //mongose bad object id error
    if(err.name === 'CastError'){
        const message = `Resource not found. Invalid: ${err.value}`;
        error = new ErrorResponse(message, 404);
    }
    //mongoose duplicate key error
    if(err.code === 11000){
        const message = `Duplicate field value entered`;
        error = new ErrorResponse(message, 400);
    }
    //mongoose validation error
    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }
    //jwt errors 
    if(err.name === 'JsonWebTokenError'){
        const message = 'JSON Web Token is invalid. Try again';
        error = new ErrorResponse(message, 400);
    }
    if(err.name === 'TokenExpiredError'){
        const message = 'JSON Web Token has expired. Try again';
        error = new ErrorResponse(message, 400);
    }
    //send error response 
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = {
    ErrorResponse,
    errorHandler
};