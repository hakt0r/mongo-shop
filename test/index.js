require('./db');

const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const { readAuth } = require('./middlewares');
app.use(readAuth);

const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/users', userRoutes);
app.use('/items', itemRoutes);
app.use('/orders', orderRoutes);

app.listen(5002, '127.0.0.1', () => {
  console.log('backend ready');
});
