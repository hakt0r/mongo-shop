const express = require('express');

const { generateToken } = require('../services/auth');

const { User } = require('../models/userModel');

module.exports = {
  register: async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    const userExists = await User.findOne({ email });
    console.log(userExists);

    if (userExists) {
      return res.status(401).send('Not Authorized');
    }

    const user = new User({
      email,
      password,
      firstName,
      lastName,
      token: generateToken(email),
    });

    try {
      await user.save();
    } catch (e) {
      console.error(e);
      return res.status(400).send('Bad Request');
    }
    res.send({ token: user.token });
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).send('Bad Request');

    let user = await User.findOne({ email });

    if (!user) return res.status(401).send('Not Authorized');

    if (user.password !== password)
      return res.status(401).send('Not Authorized');

    user.token = generateToken(email);
    await user.save();

    res.send({ token: user.token });
  },

  logout: async (req, res) => {
    const { user } = req;
    user.token = false;
    await user.save();
    res.status(204).send();
  },

  unregister: async ({ user }, res) => {
    await user.delete();
    res.status(204).send();
  },
};
