const crypto = require('crypto');

const { User } = require('../models/userModel');

function generateToken(userId, salt = 'c765a454a7sc534as7c5437$') {
  return crypto
    .createHash('sha512')
    .update(`${userId}:${Date.now()}:${salt}`)
    .digest('hex');
}

function findUserByToken(token) {
  return User.findOne({ token });
}

module.exports = {
  generateToken,
  findUserByToken,
};
