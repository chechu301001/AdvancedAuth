//All route actions
const User = require('../models/User');
const { registerValidation, loginValidation} = require('../validate/validation');
const bcrypt = require('bcrypt');
const ErrorResponse = require('../utils/errorResponse')
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');



exports.register = async (req, res, next) => {

    //VALIDATION REGISTER
    const {error} = registerValidation(req.body);
    if(error) {
        return next(new ErrorResponse(error.details[0].message, 400))
    } else {
        console.log('User data can be sent to DB');
    }

    const {username, email, password, cpassword} = req.body;

    //NEW USER REGISTER
    try {
        const user = new User({
            username,
            email,
            password,
            cpassword
        }); 

        const savedUser = await user.save();
        console.log('New User Registered Successfully.');

        //SEND TOKEN CALL
        sendToken(user, 201, res);
        
    } catch (error) {
        next(error);
    }
}


exports.login = async (req, res, next) => {

    //VALIDATION LOGIN
    const {error} = loginValidation(req.body);
    if(error) {
        return next(new ErrorResponse(error.details[0].message, 400))
    } else {
        console.log('User data is Validated');
    }

    //CHECKING IF REGISTERED EMAIL IS EXISTING 
    const user = await User.findOne({email: req.body.email}).select("+password");
    if(!user) {
        next(new ErrorResponse("Please provide a valid Email and Password", 404))
    } else {
        console.log('User found');
    }
    
    //PASSWORD COMPARING
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return next(new ErrorResponse("Invalid Email or Password Credentials", 404))

    //SEND TOKEN CALL
    sendToken(user, 201, res);

    console.log('Successfully Logged in.');

}


exports.forgotpassword = async (req, res, next) => {
    const {email} = req.body;
    try {
        const user = User.findOne({email});
        if(!user) {
            return next(new ErrorResponse("Email could not be found", 404)) 
        }

        //METHOD IN USER SCHEMA
        const resetToken = await user.getResetPasswordToken;
        console.log(resetToken);
        (await user).save;
        

        //RESET URL
        const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

        //MESSAGE TO BE SENT WITH THE MAIL
        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please go to this link to reset your password</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `
        //FOR MAILING (UTILS)

        try {
            await sendEmail({
                to: user.email,
                subject: "Password Reset Request",
                text: message
            });

            res.status(200).json({
                success: true,
                data: "Email has been sent"
            })
        } catch (error) {
            savedUser.resetPasswordToken = undefined;
            savedUser.resetPasswordExpire = undefined;

            (await savedUser).save();

            return next(new ErrorResponse("Email could not be sent", 500)); 
        }
    } catch (error) {
        next(error);
    }
}


exports.resetpassword = (req, res, next) => {
    res.send("Reset Password Route");
}

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