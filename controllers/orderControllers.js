
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

  placeOrder: async ({order,body,user}, res) => {
    // destructure values from req.body
    const { deliveryAddress, paymentMethod } = body;

    // if values don't exist
    if ( ! deliveryAddress || ! paymentMethod ){
      // then it should fail
      return res.status(400).send('Bad Request');
    }

    try {
      // add values to the order object
      order.deliveryAddress = deliveryAddress;
      order.paymentMethod   = paymentMethod;
      // change status to palced
      order.status          = 'placed';
      // save the order
      await order.save();

      // add order to user history
      user.ordersHistory.push(order);

      // check if delivery address exist in the database
      let addressExists = false;
      
      for ( savedAddress of user.savedDeliveryAddresses ){
        if (
          savedAddress.country  === deliveryAddress.country  &&
          savedAddress.address1 === deliveryAddress.address1 &&
          savedAddress.address2 === deliveryAddress.address2 &&
          savedAddress.city     === deliveryAddress.city     &&
          savedAddress.postcode === deliveryAddress.postcode
        ) addressExists = true;
      }

      // else add it to the user
      if ( ! addressExists ) {
        user.savedDeliveryAddresses.push(deliveryAddress);
      }

      // save the user
      await user.save();

      return res.status(200).send(order);
    } catch (e) {
      console.error(e);
      return res.status(400).send('Bad Request');
    }
  },
};
