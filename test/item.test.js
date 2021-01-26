/**
 * @jest-environment node
 */

const { db   } = require('../db');
const { User } = require('../models/userModel');
const { Item } = require('../models/itemModel');

const email    = Date.now() + '@nishaEmail.item';
const itemName = Date.now() + '-test-item';

beforeAll(async () => {

  const res = await register(
    email,
    'asdasldkjas',
    'nisha',
    'shukla'
  );
  axios.defaults.headers.common.authorization = res.data.token;

  const user = await User.findOne({email});
  user.role = 'owner';
  await user.save();

});

afterAll( async () => {
  await User.deleteOne({email});
  await Item.deleteOne({name:itemName+"1"});
  await Item.deleteOne({name:itemName+"2"});
  await Item.deleteOne({name:itemName+"3"});
  await Item.deleteOne({name:itemName+"4"});
  db.close();
});

const axios = require('axios');
axios.defaults.baseURL = 'http://127.0.0.1:5002/';

function register(email, password, firstName, lastName) {
  return axios.post('/users/register', {
    email,
    password,
    firstName,
    lastName,
  });
}

function create(
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

function get(id) {
  return axios.get(`/items/${id}`);
}

function getList(filters = {}) {
  return axios.get('/items/list', filters);
}

function update(id, item = {}) {
  return axios.patch(`/items/${id}`, item);
}

function remove(id) {
  return axios.delete(`/items/${id}`);
}

test('simple create items', async () => {
  const createRes = await create({
    name: itemName+"1",
    categoryLevel1: 'C.L. 1.1',
    categoryLevel2: 'C.L. 2.1',
    categoryLevel3: 'C.L. 3.1',
    currentPrice: 15,
    discountCategory: 'none',
  });
  expect(createRes.data.name).toMatch(itemName+"1");
});

test('should get single item', async () => {
  const createRes = await create({
    name: itemName+"2",
    categoryLevel1: 'C.L. 1.1',
    categoryLevel2: 'C.L. 2.1',
    categoryLevel3: 'C.L. 3.1',
    currentPrice: 15,
    discountCategory: 'none',
  });
  const getRes = await get(createRes.data._id);
  console.log(createRes.data._id);
  expect(getRes.data.name).toMatch(itemName+"2");
});

test('list items', async () => {
  const listRes = await getList({ currentPrice: { $gt: 0 } });

  expect(listRes.data.length).toBeGreaterThan(0);
});

test('should update item', async () => {
  const createRes = await create({
    name: itemName+"3",
    categoryLevel1: 'C.L. 1.1',
    categoryLevel2: 'C.L. 2.1',
    categoryLevel3: 'C.L. 3.1',
    currentPrice: 15,
    discountCategory: 'none',
  });
  const getRes = await update(createRes.data._id, { currentPrice: 20 });
  expect(getRes.data.currentPrice).toEqual(20);
});

test('should delete item', async () => {
  const createRes = await create({
    name: itemName+"4",
    categoryLevel1: 'C.L. 1.1',
    categoryLevel2: 'C.L. 2.1',
    categoryLevel3: 'C.L. 3.1',
    currentPrice: 15,
    discountCategory: 'none',
  });
  const deleteRes = await remove(createRes.data._id);
  expect(deleteRes.status).toBe(200);
  await expect( get(createRes.data._id) ).rejects.toThrow();
});
