const APIError = require('./error');

module.exports = (err, req, res, next) => {
    if (err instanceof APIError) {
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