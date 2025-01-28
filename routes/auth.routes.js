const router = require('express').Router();
const { register, login, logout } = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/authentication');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', verifyToken, logout);

module.exports = router;