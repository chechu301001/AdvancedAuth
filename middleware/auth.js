const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse')

exports.protect = async (req, res, next) =>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        //split by space
        token = req.headers.authorization.split(" ")[1]
        console.log('header token')
    }
    if(!token) {
        return next(new ErrorResponse("Not authorized to access this Route", 401))
    }

    //JWT VERIFY
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findById(verified.id);
        next();
        if(!user) {
            return next(new ErrorResponse("No user found with this ID", 404))
        }
        req.user = user;
        next();
    } catch (err) {
        return next(new ErrorResponse("Not authorized to access this Route", 401));
    }
}