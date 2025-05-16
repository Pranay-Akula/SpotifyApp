const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  songName: String,
  artist: String,
  albumCoverUrl: String
});

module.exports = mongoose.model('Song', songSchema);
