/**
 * @jest-environment node
 */

const { db } = require('../db');
const { User } = require('../models/userModel');

const user1 = Date.now() + '-1@nishaEmail.user';
const user2 = Date.now() + '-2@nishaEmail.user';
const user3 = Date.now() + '-3@nishaEmail.user';

beforeAll(async () => {});

afterAll( async () => {
  await User.deleteOne({email:user1});
  await User.deleteOne({email:user2});
  await User.deleteOne({email:user3});
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

test('simple registration should work', async () => {
  await register(user1, 'asdasldkjas', 'nisha', 'shukla');
});

test('registration should return a token', async () => {
  const res = await register(user2, 'asdasldkjas', 'nisha', 'shukla');
  console.log(res.data);
  expect(res.data.token).toBeTruthy();
});

function login(email, password) {
  return axios.post('/users/login', { email, password });
}

function logout(token) {
  return axios.post('users/logout', null, {
    headers: { authorization: token },
  });
}

function unregister(token) {
  return axios.post('users/unregister', null, {
    headers: { authorization: token },
  });
}

test('login should work / return a token', async () => {
  const res = await login(user1, 'asdasldkjas');
  expect(res.data.token).toBeTruthy();
});

test('logout should work', async () => {
  const registerRes = await register(
    user3,
    'asdasldkjas',
    'nisha',
    'shukla'
  );
  const loginRes = await login(user3, 'asdasldkjas');
  const logoutRes = await logout(loginRes.data.token);
});

test('unregister should work', async () => {
  const loginRes = await login( user3, 'asdasldkjas' );
  const unregisterRes = await unregister(loginRes.data.token);
});
