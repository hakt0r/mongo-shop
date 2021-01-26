const express = require('express');

const { checkAuth } = require('../middlewares');

const {
  register,
  login,
  logout,
  unregister,
} = require('../controllers/userControllers');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', checkAuth, logout);
router.post('/unregister', checkAuth, unregister);

module.exports = router;
