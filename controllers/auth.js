//All route actions
const User = require('../models/User');
const { forgotValidation, resetPasswordValidation, registerValidation, loginValidation} = require('../validate/validation');
const bcrypt = require('bcrypt');
const ErrorResponse = require('../utils/errorResponse')
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();
const {sendToken, sendResetToken} = require('../utils/sendToken');


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

        await user.save();
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
    //VALIDATION FORGOT PASSWORD
    const {error} = forgotValidation(req.body);
    if(error) {
        return next(new ErrorResponse(error.details[0].message, 400))
    } else {
        console.log('User data is valid');
    }

    const {email} = req.body;
    try {

        const user = await User.findOne({email: email}).select("+password");
        if(!user) {
            next(new ErrorResponse("Please provide a valid Email and Password", 404))
        } else {
            console.log('User found');
        }

        //RESET TOKEN
        const getResetToken = sendResetToken(user, 201, res);
        user.save();
        

        //RESET URL
        const resetUrl = `http://localhost:3000/passwordreset/${getResetToken}`;

        
        //FOR MAILING (UTILS)
        try {

            const mailjet = require ('node-mailjet')
            .connect('5f4e0bb2739dc42aea9618c4854c88f7', 'dd121ed76597b24605d4f670e823013c')
            console.log('Sending mail')
            const request = mailjet
            .post("send", {'version': 'v3.1'})
            .request({
            "Messages":[
                {
                "From": {
                    "Email": process.env.EMAIL_FROM,
                    "Name": "SHREYAS"
                },
                "To": [
                    {
                    "Email": email,
                    "Name": "SHREYAS"
                    }
                ],
                "Subject": "Greetings from FORGOTPASSWORD.",
                "TextPart": "FORGOTPASSWORD email",
                "HTMLPart": `<h3>HELLO, CLICK THE LINK TO RESET PASSWORD: <a href='${resetUrl}'>${resetUrl}</a></h3>`,
                "CustomID": "AppGettingStartedTest"
                }
            ]
            })
            request
            .then((result) => {
                console.log(result.body)
                console.log('Mail sent')
                res.status(200).send(
                    `Email has been sent to ${email}`
                )
            })
            .catch((err) => {
                console.log(err.statusCode)
            })
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            (await user).save();

            return next(new ErrorResponse("Email could not be sent", 500)); 
        }
    } catch (error) {
        next(error);
    }
}


exports.resetpassword = async (req, res, next) => {
    
    //VALIDATION RESET PASSWORD
    const {error} = resetPasswordValidation(req.body);
    if(error) {
        return next(new ErrorResponse(error.details[0].message, 400))
    } else {
        console.log('User data is valid');
    }

    //ROUTE HAS RESET PARAMS
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

    //COMPARE THE TOKENS
    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now()}
        })
        if(!user) {
            return next(new ErrorResponse('Invalid Reset Token', 400))
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).send(
            `Hey ${user.username}.
            Your password has been succesfully changed`
        )

    } catch (error) {
        next(error);
    }
}





