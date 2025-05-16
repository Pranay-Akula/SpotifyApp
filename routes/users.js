const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Song = require('../models/Song');

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { username } = req.body;
  let user = await User.findOne({ username });

  if (!user) {
    user = new User({ username });
    await user.save();
  }

  res.redirect(`/songs/dashboard?user=${user._id}`);
});

module.exports = router;
