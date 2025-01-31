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

const createTodoSchema = Joi.object({
    title: Joi.string().required(),
    note: Joi.string().optional(),
    onDate: Joi.date().iso().required(),
    dueDate: Joi.date().iso().optional(),
    subTodos: Joi.array().items(Joi.object({
        title: Joi.string().required(),
        note: Joi.string().optional(),
        dueDate: Joi.date().iso().optional(),
    })).optional(),
});

const editTodoSchema = Joi.object({
    title: Joi.string().optional(),
    note: Joi.string().optional(),
    onDate: Joi.date().iso().optional(),
    dueDate: Joi.date().iso().optional(),
    isDone: Joi.boolean().optional(),
    subTodos: Joi.array().items(Joi.object({
        title: Joi.string().optional(),
        note: Joi.string().optional(),
        dueDate: Joi.date().iso().optional(),
        isDone: Joi.boolean().optional(),
    })).optional(),
}).min(1);

module.exports = {
    validateRegister: validator(registerSchema),
    validateLogin: validator(loginSchema),
    validateCreateTodo: validator(createTodoSchema),
    validateEditTodo: validator(editTodoSchema),
};