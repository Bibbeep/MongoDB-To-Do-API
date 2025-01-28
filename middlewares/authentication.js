const { getClient } = require('../configs/redis');
const APIError = require('../utils/error');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
    verifyToken: async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];

            const redis = await getClient();
            const blacklisted = await redis.get(`blacklist_${token}`);

            if (blacklisted !== null) {
                throw new APIError(401, 'Invalid or expired token!');
            }

            const decoded = await jwt.verify(token, JWT_SECRET);

            req.userId = decoded.id;
            req.tokenExp = decoded.exp;
            req.token = token;

            next();
        } catch (err) {
            next(err);
        }
    },
};