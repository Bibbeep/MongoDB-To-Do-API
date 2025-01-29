const APIError = require('../utils/error');

module.exports = {
    authorizeUserIdQueryParam: async (req, res, next) => {
        try {
            const userId = req.query.userId || null;

            if (!userId) {
                throw new APIError(403, 'Unauthorized request! userId is required.');
            } else if (userId !== req.userId) {
                throw new APIError(403, 'Unauthorized request! Different userId access.');
            }

            next();
        } catch (err) {
            next(err);
        }
    },
};
