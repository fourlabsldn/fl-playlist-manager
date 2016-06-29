/* eslint-env node */

const RoundHandler = require('./playlist_control/RoundHandler');
const roundHandler = new RoundHandler();

const Spotify = require('./spotify_control/Spotify');
const credentials = require('./spotify_control/credentials');
const spotify = new Spotify('Office', credentials);

const server = require('./server/server');

spotify.init()
.then(() => server(spotify, roundHandler));
