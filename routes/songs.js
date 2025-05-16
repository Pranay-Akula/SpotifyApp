const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const Song = require('../models/Song');

let accessToken = '';
async function getSpotifyAccessToken() {
  const authBuffer = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
  const response = await axios.post('https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    { headers: { 'Authorization': `Basic ${authBuffer}`, 'Content-Type': 'application/x-www-form-urlencoded' } });
  accessToken = response.data.access_token;
}

router.get('/dashboard', async (req, res) => {
  const userId = req.query.user;
  const songs = await Song.find({ userId });
  res.render('dashboard', { songs, userId });
});

router.post('/search', async (req, res) => {
  const { songName, userId } = req.body;
  if (!accessToken) await getSpotifyAccessToken();

  try {
    const response = await axios.get(`https://api.spotify.com/v1/search`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      params: { q: songName, type: 'track', limit: 1 }
    });

    const track = response.data.tracks.items[0];
    if (track) {
      const newSong = new Song({
        userId,
        songName: track.name,
        artist: track.artists[0].name,
        albumCoverUrl: track.album.images[0].url
      });
      await newSong.save();
    }
  } catch (err) {
    console.error('Error searching Spotify:', err);
  }

  res.redirect(`/songs/dashboard?user=${userId}`);
});

module.exports = router;
