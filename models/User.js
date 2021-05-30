const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        match: [
            /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
            "Please provide a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: 5,
        select: false
    },
    cpassword: {
        type: String,
        required: [true, "Please add a  confirm password"],
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

//HASHING PASSWORD
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        next();
    }
    //During register
    const saltRounds = 12;//complexity of generated string
    this.password = await bcrypt.hash(this.password, saltRounds);
    this.cpassword = await bcrypt.hash(this.cpassword, saltRounds);
    next();
});

//RESET TOKEN AFTER LOGIN METHOD
userSchema.methods.getResetPasswordToken = function() {
    //generating new token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //New schema field value set
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    
    
    //Reset password field
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);
    return resetToken;
}


const User = mongoose.model('User', userSchema);
module.exports = User;