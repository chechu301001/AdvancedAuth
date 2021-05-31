const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const crypto = require('crypto');

//FUNCTION FOR SENDING TOKEN AND RES TO SIMPLIFY
const sendToken = (user, statusCode, res) => {
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, 
        {expiresIn: process.env.JWT_EXPIRE});
    res.status(statusCode).json({
        success: true, 
        message: "Token appear",
        token
    })
}

const sendResetToken = (user) => {
    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    
    return resetToken;
}
module.exports.sendResetToken = sendResetToken;
module.exports.sendToken = sendToken;