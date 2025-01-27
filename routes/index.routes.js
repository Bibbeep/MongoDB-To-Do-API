const router = require('express').Router();
const AuthRoutes = require('./auth.routes');
const TodoRoutes = require('./todo.routes');

router.use('/auth', AuthRoutes);
router.use(TodoRoutes);

module.exports = router;