const express = require('express');
const router = express.Router();

const { checkAuth, checkOrderUserOrOwner } = require('../middlewares');

router.use(checkAuth);

const {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderControllers');

router.post(  '/',     createOrder);
router.get(   '/list', getOrders);

router.get(   '/:id', checkOrderUserOrOwner, getOrder);
router.patch( '/:id', checkOrderUserOrOwner, updateOrder);
router.delete('/:id', checkOrderUserOrOwner, deleteOrder);

module.exports = router;
