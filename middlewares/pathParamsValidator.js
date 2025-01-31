const { validateTodoId } = require("../utils/validator");

module.exports = {
    todoIdPathValidator: (req, res, next) => {
        try {
            const { error } = validateTodoId(req.params);

            if (error) {
                throw error;
            }

            next();
        } catch (err) {
            next(err);
        }
    },
};