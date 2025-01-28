const Auth = require('../models/auth');
const { validateRegister } = require('../utils/validator');

module.exports = {
    register: async (req, res, next) => {
        try {
            const { error, value } = validateRegister(req.body);

            if (error) {
                throw error;
            }

            const user = await Auth.createUser(value);

            return res.status(201).json({
                status: 'success',
                message: 'Successfully registered a new account.',
                data: {
                    user: {
                        id: user.insertedId.toString(),
                    },
                },
            });
        } catch (err) {
            next(err);
        }
    },
    login: async (req, res, next) => {
        try {

        } catch (err) {
            next(err);
        }
    },
    logout: async (req, res, next) => {
        try {

        } catch (err) {
            next(err);
        }
    },
};