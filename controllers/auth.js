//All route actions
const User = require('../models/User');
const { registerValidation, loginValidation} = require('../validate/validation');
const bcrypt = require('bcrypt');



exports.register = async (req, res, next) => {

    //VALIDATION REGISTER
    const {error} = registerValidation(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
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
        res.status(201).json({
            message: 'New user registered successfully.',
            success: true,
            savedUser
        })
        
    } catch (error) {
        res.status(400).json({
            success: false,
            error:error.message
        });
    }
}


exports.login = async (req, res, next) => {

    //VALIDATION LOGIN
    const {error} = loginValidation(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    } else {
        console.log('User data is Validated');
    }

    //CHECKING IF REGISTERED EMAIL IS EXISTING 
    const user = await User.findOne({email: req.body.email}).select("+password");
    if(!user) {
        res.status(404).send('Email or Password is incorrect.');
    } else {
        console.log('User found');
    }
    
    //PASSWORD COMPARING
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(404).send('Invalid credentials.');

    res.status(200).send('Successfully Logged in.')
    console.log('Successfully Logged in.');

}


exports.forgotpassword = (req, res, next) => {
    res.send("Forgot Password Route");
}
exports.resetpassword = (req, res, next) => {
    res.send("Reset Password Route");
}