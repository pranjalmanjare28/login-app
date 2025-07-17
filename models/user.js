const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  mobile: String,
  password: String
});

module.exports = mongoose.model('User', userSchema);
