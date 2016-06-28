/* eslint-env node */

const tracks = require('./trackData-original');
const Spotify = require('../spotify_control/Spotify');
const credentials = require('../spotify_control/credentials');

const trackUris = tracks.map(t => t.uri);
const spotify = new Spotify('Office', credentials);
spotify.init()
.then(() => {
  return spotify.addTracks(trackUris);
})
.catch((e) => {
  console.log('Error:', e);
})
.then(() => console.log('finished'));
