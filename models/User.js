const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
const saltRounds = 12;//complexity of generated string
userSchema.pre('save', async function(next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, saltRounds);
        this.cpassword = await bcrypt.hash(this.cpassword, saltRounds);
    }
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;