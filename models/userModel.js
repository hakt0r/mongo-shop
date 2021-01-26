const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    required: true,
    unique: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  token: {
    index: true,
    type: String,
  },
  firstName: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
    type: String,
  },
  role: {
    type: String,
    enum: ['owner', 'accounting', 'logistics', 'user'],
    default: 'user',
  },
  mobilePhoneNumber: String,
  twoStepVerification: Boolean,
  savedDeliveryAddresses: [
    {
      country: {
        type: String,
        enum: [
          'Albania',
          'Andorra',
          'Austria',
          'Belarus',
          'Belgium',
          'Bosnia and Herzegovina',
          'Bulgaria',
          'Croatia',
          'Cyprus',
          'Czechia',
          'Denmark',
          'Estonia',
          'Finland',
          'France',
          'Germany',
        ],
        default: 'Germany',
      },
      address1: String,
      address2: String,
      city: String,
      postcode: Number,
    },
  ],
  savedPaymentMethods: [{}],
  savedItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
    },
  ],
  ordersHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
