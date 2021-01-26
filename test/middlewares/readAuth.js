const { findUserByToken } = require('../services/auth');

module.exports = async function readAuth(req, res, next) {
  const token = req.headers.authorization;
  if (token) {
    try {
      req.user = await findUserByToken(token);
    } catch (error) {
      console.error('AUTH: validation failed:', error);
    }
  }
  next();
};
