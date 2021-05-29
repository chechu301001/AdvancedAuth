//All route actions
const User = require('../models/User');


exports.register = async (req, res, next) => {
    const {username, email, password, cpassword} = req.body;

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


exports.login = (req, res, next) => {
    res.send("Login Route");
}
exports.forgotpassword = (req, res, next) => {
    res.send("Forgot Password Route");
}
exports.resetpassword = (req, res, next) => {
    res.send("Reset Password Route");
}