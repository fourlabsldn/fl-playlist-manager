/* eslint-env node */

// HTTPS data
const fs = require('fs');
const path = require('path');
const hskey = fs.readFileSync(path.join(__dirname, 'playlist-manager-key.pem'));
const hscert = fs.readFileSync(path.join(__dirname, 'playlist-manager-cert.pem'));
const httpsOptions = { key: hskey, cert: hscert };

const assert = require('assert');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const https = require('https').createServer(httpsOptions, app); // eslint-disable-line new-cap
const io = require('socket.io')(https);
const cors = require('cors');
const playlistUpdateMsg = 'playlist_update';

module.exports = (playlistController) => {
  // Initialisation
  app.use(cors());
  app.use(bodyParser.json()); // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

  // ---------------------------------------------------------------------------
  //  Socket
  // ---------------------------------------------------------------------------

  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('user_playlist_update', (msg) => {
      const outcome = setUserTracks(msg, playlistController);
      if (outcome.success) {
        playlistUpdate();
      }
    });
  });

  function playlistUpdate() {
    // Tell everyone of the playlist update
    io.sockets.emit(playlistUpdateMsg, playlistController.getTrackList());
  }
  // ---------------------------------------------------------------------------
  //  Express server
  // ---------------------------------------------------------------------------

  app.get('/', (req, res) => res.send('The root you have reached. content we have not.'));

  app.get('/getTrackList', (req, res) => {
    const trackList = playlistController.getTrackList();
    res.json(trackList);
  });

  app.post('/setUserTracks', (req, res) => {
    const outcome = setUserTracks(req.body, playlistController);
    res.json(outcome);
    if (outcome.success) {
      playlistUpdate();
    }
  });

  https.listen(3000, () => console.log('Spotify server listening on port 3000!'));
};


/**
 * Updates a user's tracks and, if successfull, emits a message to everyone
 * with an updated track list
 * @method setUserTracks
 * @param  {Object} obj
 */
function setUserTracks(obj, playlistController) {
  const tracks = obj.tracks;
  const user = obj.user;
  const outcome = { sucess: false, error: false };
  try {
    assert(tracks, 'Missing key. Tracks array not sent in request.');
    assert(Array.isArray(tracks), 'Tracks key is not an array.');
    assert(user, 'Missing key. User object not sent.');
    assert(typeof user.id === 'string', 'Invalid user id type.');
    assert(typeof user.name === 'string', 'Invalid user id type.');
    playlistController.setUserTracks(user, tracks);
    outcome.success = true;
  } catch (e) {
    console.log(e.message);
    outcome.error = e.message;
  }

  return outcome;
}
