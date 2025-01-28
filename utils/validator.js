const Joi = require('joi');

const validator = (schema) => {
    return (payload) => {
        return schema.validate(payload, { abortEarly: false });
    };
};

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(50).required(),
    fullName: Joi.string().required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(50).required(),
});

module.exports = {
    validateRegister: validator(registerSchema),
    validateLogin: validator(loginSchema),
};