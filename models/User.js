const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
  firstName: { type: String },
  lastName: { type: String },
  phoneNumber: { type: String },
  addresses: [{
    street: String,
    city: String,
    country: String,
    postalCode: String
  }],
  paymentMethods: [{
    cardNumber: String,
    expiryDate: String,
    cvv: String
  }]
});

// Şifre hashleme middleware'i
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', UserSchema);
