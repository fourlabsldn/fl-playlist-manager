/* eslint-env node */

const Spotify = require('./spotify_control/Spotify');
const credentials = require('./spotify_control/credentials');

const spotify = new Spotify('office', credentials);

// Get a user's playlists
spotify.initialiseDayPlaylist(new Date());
