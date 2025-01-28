const Auth = require('../models/auth');
const { validateRegister, validateLogin } = require('../utils/validator');

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
            const { error, value } = validateLogin(req.body);

            if (error) {
                throw error;
            }

            const data = await Auth.login(value);

            return res.status(200).json({
                status: 'success',
                message: 'Successfully logged in.',
                data: {
                    user: data.user,
                    accessToken: data.accessToken,
                },
            });
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