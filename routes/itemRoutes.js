const express = require('express');
const { Item } = require('../models/itemModel');
const router = express.Router();
const { checkAuth, checkUserRole } = require('../middlewares');

router.use(checkAuth);

const ownerOnly = checkUserRole('owner');

const {
  createItems,
  getItems,
  getItem,
  updateItem,
  deleteItem,
} = require('../controllers/itemControllers');

router.post('/', ownerOnly, createItems);
router.get('/list', getItems);
router.get('/:id', getItem);
router.patch('/:id', ownerOnly, updateItem);
router.delete('/:id', ownerOnly, deleteItem);

module.exports = router;
