const Joi = require('joi').extend(require('@hapi/joi-date'));

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
    onDate: Joi.date().utc().format('YYYY-MM-DD').required(),
    dueDate: Joi.date().utc().iso().optional(),
    subTodos: Joi.array().items(Joi.object({
        title: Joi.string().required(),
        note: Joi.string().optional(),
        dueDate: Joi.date().utc().iso().optional(),
    })).optional(),
});

const userIdSchema = Joi.object({
    userId: Joi.string().hex().length(24).required(),
});

const editTodoSchema = Joi.object({
    title: Joi.string().optional(),
    note: Joi.string().optional(),
    onDate: Joi.date().utc().format('YYYY-MM-DD').optional(),
    dueDate: Joi.date().utc().iso().optional(),
    isDone: Joi.boolean().optional(),
    subTodos: Joi.array().items(Joi.object({
        title: Joi.string().optional(),
        note: Joi.string().optional(),
        dueDate: Joi.date().utc().iso().optional(),
        isDone: Joi.boolean().optional(),
    })).optional(),
}).min(1);

const todoIdSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
});

const getTodoQuerySchema = Joi.object({
    userId: Joi.string().hex().length(24).required(),
    date: Joi.date().utc().format('YYYY-MM-DD').optional(),
    sortBy: Joi.string().valid('date', '-date').optional(),
    page: Joi.string().pattern(/^(0|[1-9][0-9]*)$/).optional(),
    count: Joi.string().pattern(/^(0|[1-9][0-9]*)$/).optional(),
    includeSubTodos: Joi.string().valid('true', 'false').optional(),
});

module.exports = {
    validateRegister: validator(registerSchema),
    validateLogin: validator(loginSchema),
    validateCreateTodo: validator(createTodoSchema),
    validateUserId: validator(userIdSchema),
    validateEditTodo: validator(editTodoSchema),
    validateTodoId: validator(todoIdSchema),
    validateGetTodoQuery: validator(getTodoQuerySchema),
};