/**
 * @jest-environment node
 */

const axios = require('axios');
axios.defaults.baseURL = 'http://127.0.0.1:5002/';

const { db } = require('../db');
const { User } = require('../models/userModel');
const { Item } = require('../models/itemModel');
const { Order } = require('../models/orderModel');

const email = Date.now() + '@nishaEmail.order';

let item, anotherItem, user;

beforeAll(async () => {
  
  const res = await register(
    email,
    'asdasldkjas',
    'nisha',
    'shukla'
  );
  axios.defaults.headers.common.authorization = res.data.token;

  user = await User.findOne({email});
  user.role = 'owner';
  await user.save();

  const createRes = await createItem({
    name: 'order-test-item',
    categoryLevel1: 'C.L. 1.1',
    categoryLevel2: 'C.L. 2.1',
    categoryLevel3: 'C.L. 3.1',
    currentPrice: 15,
    discountCategory: 'none',
  });
  item = createRes.data;

  const createRes2 = await createItem({
    name: 'order-test-anotherItem',
    categoryLevel1: 'C.L. 1.1',
    categoryLevel2: 'C.L. 2.1',
    categoryLevel3: 'C.L. 3.1',
    currentPrice: 20,
    discountCategory: 'none',
  });
  anotherItem = createRes2.data;
});

afterAll( async () => {
  await User.deleteOne({email});
  await Item.deleteOne({name:'order-test-item'});
  await Item.deleteOne({name:'order-test-anotherItem'});
  await Order.deleteMany({user:user._id});
  db.close();
});

function createItem(
  name,
  categoryLevel1,
  categoryLevel2,
  categoryLevel3,
  currentPrice,
  discountCategory
) {
  return axios.post(
    '/items/',
    name,
    categoryLevel1,
    categoryLevel2,
    categoryLevel3,
    currentPrice,
    discountCategory
  );
}

function register(email, password, firstName, lastName) {
  return axios.post('/users/register', {
    email,
    password,
    firstName,
    lastName,
  });
}

function create(items) {
  return axios.post('/orders/', items);
}

function get(id) {
  return axios.get(`/orders/${id}`);
}

function getList(filters = {}) {
  return axios.get('/orders/list', filters);
}

function update(id, order = {}) {
  return axios.patch(`/orders/${id}`, order);
}

function remove(id) {
  return axios.delete(`/orders/${id}`);
}

test('simple create order', async () => {
  const createRes = await create({
    items: [{ item: item._id, quantity: 45, price: 0, priceReduction: 0 }],
  });
  expect(createRes.data.items.length).toEqual(1);
  expect(createRes.data.items[0].price).toEqual(item.currentPrice);
});

test('should get single order', async () => {
  const createRes = await create({
    items: [{
      item: item._id,
      quantity: 45,
      price: 34,
      priceReduction: 21
    },
    {
      item: anotherItem._id,
      quantity: 12,
      price: 32,
      priceReduction: 12
    }],
  });
  const getRes = await get(createRes.data._id);
  console.log(getRes.data.user)
  // console.log(typeof user._id)
  // console.log(user._id)
  // => {
  // id: 'ef7a543fe423f5a42ef54ae2f',
  // ref: "User",
  // toString: ()=> this.id;
  // }
  //console.log(user._id) // this prints a string but it ain't a string
                          // it's an object representing a reference
                          // because this user object comes directly
                          // out of mongoose, not axios
                          // => console.log calls toString() implicitly if available
                          // => this also happen inside express when we .send() sth.
  expect(getRes.data.user._id).toMatch(user._id.toString());
  expect(getRes.data.items[0].item._id).toMatch(item._id);
  expect(getRes.data.items[1].item._id).toMatch(anotherItem._id);
  expect(getRes.data.items[1].item.price).toEqual(anotherItem.price);
  expect(getRes.data.items[1].item.price).not.toEqual(32);
  expect(getRes.data.items.length).toEqual(2);
});

test('list of order', async () => {
  const listRes = await getList({ date: { $gt: 0 } });

  expect(listRes.data.length).toBeGreaterThan(0);
});

test('should update order', async () => {
  const createRes = await create({
    items: [{ item: item._id, quantity: 45, price: 34, priceReduction: 21 }],
  });
  const getRes = await update(createRes.data._id, { items: [{ price: 20 }] });
  expect(getRes.data.items[0].price).toBe(20);
});

test('should delete order', async () => {
  const createRes = await create({
    items: [{ item: item._id, quantity: 45, price: 34, priceReduction: 21 }],
  });
  const getRes = await remove(createRes.data._id);
  expect(getRes.status).toBe(200);
  await expect( get(createRes.data._id) ).rejects.toThrow();
});
