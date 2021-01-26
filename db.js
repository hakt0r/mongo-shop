const mongoose = require('mongoose');

const dbURL = 'mongodb://localhost:27017/onlineShop';

mongoose.connect(dbURL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', function (e) {
  console.error('db.error:', e);

  process.exit(1);
});

db.once('open', function () {
  console.log('db.ready');
});

module.exports = { db };
