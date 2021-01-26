
const { Order } = require('../models/orderModel');
const { Item  } = require('../models/itemModel');

module.exports = {
  createOrder: async (req, res) => {
    try {

      const resolvePrices = req.body.items.map(
        async ({item,quantity}) => {
          const dbItem = await Item.findById(item);
          return {
            item,
            quantity,
            price: dbItem.currentPrice,
            priceReduction: 0
          };
        }); // array of promises because of Item.findById
      const items = await Promise.all(resolvePrices);

      const order = new Order({
        items,
        user: req.user._id
      });
      
      if (order) await order.save();
      
      res.status(201).send(order);
    
    } catch (error) {
      console.log('catch', error);
      res.status(400).send(error.message);
    }
  },

  getOrders: async (req, res) => {
    const filter = req.body;
    const isOwner = req.user.role === 'owner';
    const userFilter = isOwner ? {} : { user: req.user._id };
    const list = await Order
    .find({
      ...filter,
      ...userFilter // override user: filters to make
      // sure noone can get order hX not suposed to see
    })
    .populate('user',['email','name'])
    .populate({
      path:'items.item',
      model: "Item",
      select: ['name','price']
    });

    res.status(200).send(list);
  },

  getOrder: async (req, res) => {
    res.status(200).send(req.order);
  },

  updateOrder: async ({order,body,user}, res) => {
    try {
      const isOwner = user.role === 'owner';
      const forceUser = isOwner ? {} : { user: user._id };
      if (order) Object.assign(order, body, forceUser);
      await order.save();
      res.status(200).send(order);
    } catch (error) {
      console.error(error);
      return res.status(400).send(error.message);
    }
  },

  deleteOrder: async (req, res) => {
    try {
      await req.order.remove();
      res.status(200).send({ message: 'order deleted' });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
};
