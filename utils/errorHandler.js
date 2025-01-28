const APIError = require('./error');
const Joi = require('joi');

module.exports = (err, req, res, next) => {
    if (err instanceof Joi.ValidationError) {
        return res.status(400).json({
            status: 'fail',
            message: 'Validation error!',
            errors: err.details,
        });
    } else if (err instanceof APIError) {
        return res.status(err.statusCode).json({
            status: 'fail',
            message: err.message,
        });
    }

    console.error(err);
    return res.status(500).json({
        status: 'error',
        message: 'There is an issue with the server.',
    });
};