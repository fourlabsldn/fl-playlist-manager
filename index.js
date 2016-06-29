/* eslint-env node */

const RoundHandler = require('./playlist_control/RoundHandler');
const roundHandler = new RoundHandler();

const Spotify = require('./spotify_control/Spotify');
const credentials = require('./spotify_control/credentials');
const spotify = new Spotify('Office', credentials);

const server = require('./server/server');


const trackData = require('./tests/trackData-original');
const userData = require('./tests/userData');

roundHandler.addTrack(trackData[0], userData[0]);
roundHandler.addTrack(trackData[1], userData[0]);
roundHandler.addTrack(trackData[2], userData[0]);

roundHandler.addTrack(trackData[3], userData[1]);
roundHandler.addTrack(trackData[4], userData[1]);

roundHandler.addTrack(trackData[9], userData[2]);

roundHandler.addTrack(trackData[5], userData[3]);
roundHandler.addTrack(trackData[6], userData[3]);
roundHandler.addTrack(trackData[7], userData[3]);
roundHandler.addTrack(trackData[8], userData[3]);


spotify.init()
.then(() => server(spotify, roundHandler));
