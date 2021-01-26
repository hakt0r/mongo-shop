
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

    const list = await Order
    .find({ ...filter })
    .populate('user',['email','name'])
    .populate({
      path:'items.item',
      model: "Item",
      select: ['name','price']
    });

    res.status(200).send(list);
  },

  getOrder: async (req, res) => {
    const { id } = req.params;
    let order;
    try {
      order = await Order
      .findById(id)
      .populate('user',['email','name'])
      .populate({
        path:'items.item',
        model: "Item",
        select: ['name','price']
      });

      // order.user // have => afe4a67a546ae5f76ae54fa7e65f47ae5fea
      //            // want => { name:"anx", ... }
      // order.user = await User.findById(order.user);
    } catch (error) {
      return res.status(400).send(error.message);
    }
    if ( ! order )
      return res.status(404).send('not found');
    res.status(200).send(order);
  },

  updateOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const order = await Order.findById(id);

      if (order) Object.assign(order, { ...req.body });

      await order.save();

      res.status(200).send(order);
    } catch (error) {
      return res.status(400).send(error.message);
    }
  },

  deleteOrder: async (req, res) => {
    try {
      const order = await Order.findOneAndDelete({_id:req.params.id});
      if (order) res.status(200).send({ message: 'order deleted' });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
};
