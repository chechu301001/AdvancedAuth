//VALIDATION
const Joi = require('joi');

//REGISTER VALIDATION
const registerValidation = (info) => {
    const schema = Joi.object({
        username: Joi.string()
            .min(3)
            .max(30)
            .required(),
        email: Joi.string()
            .min(3)
            .max(30)
            .email()
            .required(),
        password: Joi.string()
            .min(3)
            .max(30)
            .required(),
    
        cpassword: Joi.ref('password')
    
    }).unknown();

    return schema.validate(info);
};

//LOGIN VALIDATION
const loginValidation = (info) => {
    const schema = Joi.object({
        email: Joi.string()
            .min(3)
            .max(30)
            .email()
            .required(),
        password: Joi.string()
            .min(3)
            .max(30)
            .required()
    
    }).unknown();

    return schema.validate(info);

};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;