require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/user');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.log('❌ MongoDB error:', err));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'facebook.html'));
});

// LOGIN Route
app.post('/facebook', async (req, res) => {
  const { username, email, mobile, password } = req.body;

  let query = { password };
  if (username) query.username = username;
  else if (email) query.email = email;
  else if (mobile) query.mobile = mobile;

  try {
    const user = await User.findOne(query);

    if (user) {
      // Render second.ejs with user's name
      res.render('second', { name: user.username });
    } else {
      res.send('<h2>Invalid credentials</h2>');
    }

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('<h2>Server error</h2>');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
