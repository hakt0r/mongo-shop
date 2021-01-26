const { Item } = require('../models/itemModel');

module.exports = {
  createItems: async (req, res) => {
    try {
      const item = new Item({
        name: req.body.name,
        categoryLevel1: req.body.categoryLevel1,
        categoryLevel2: req.body.categoryLevel2,
        categoryLevel3: req.body.categoryLevel3,
        currentPrice: req.body.currentPrice,
        discountCategory: 'none',
      });
      if (item) await item.save();
      res.status(201).send(item);
    } catch (error) {
      console.log('catch', error);
      res.status(400).send(error.message);
    }
  },

  getItems: async (req, res) => {
    const filter = req.body;

    const list = await Item.find({ ...filter });
    res.status(200).send(list);
  },

  getItem: async (req, res) => {
    const { id } = req.params;
    let item;
    try {
      item = await Item.findById(id);
    } catch (error) {
      res.status(400).send(error.message);
    }
    if (!item) res.status(404).send('not found');
    res.status(200).send(item);
  },

  updateItem: async (req, res) => {
    const { id } = req.params;
    const item = await Item.findById(id);

    Object.assign(item, { ...req.body });
    try {
      await item.save();
    } catch (error) {
      return res.status(400).send(error.message);
    }
    if (!item) res.status(404).send('not found');
    res.status(200).send(item);
  },

  deleteItem: async (req, res) => {
    try {
      const item = await Item.findOneAndDelete({_id:req.params.id});
      if (item) res.status(200).send({ message: 'item deleted' });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
};
