
const { Order } = require('../models/orderModel');

module.exports =
async function checkOrderUserOrOwner (req, res, next) {
  try {
    const order = req.order = await Order
    .findById(req.params.id)
    .populate('user',['email','firstName','lastName'])
    .populate({ path:'items.item', model: "Item" });
    if ( ! order ) return res.status(404).send('Not Found');
    if ( req.user.role === 'owner'       ) return next();
    if ( req.user._id === order.user._id ) return next();
    res.status(403).send('Forbidden');
  } catch (e){
    console.error(e);
    res.status(500).send('Internal Server Error');
  }
}