// makeAdmin.js
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await User.updateMany({}, { role: 'admin' }); // Make ALL users admin for now
  console.log('✅ All users now admin!');
  const users = await User.find({}, 'email role');
  console.log(users);
  process.exit();
});