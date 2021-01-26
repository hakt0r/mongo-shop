const express = require('express');
//const { Order } = require('../models/orderModel');
const router = express.Router();
const { checkAuth } = require('../middlewares');

router.use(checkAuth);

const {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderControllers');

router.post('/', createOrder);

router.get('/list', getOrders);

router.get('/:id', getOrder);

router.patch('/:id', updateOrder);

router.delete('/:id', deleteOrder);

module.exports = router;
