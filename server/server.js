/* eslint-env node */
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const http = require('http').Server(app); // eslint-disable-line new-cap
const io = require('socket.io')(http);
const cors = require('cors');

const setUserTracks = require('./setUserTracks');
const playlistUpdateMsg = 'playlist_update';

module.exports = (spotify, roundHandler) => {
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('user_playlist_update', (msg) => {
      const outcome = setUserTracks(msg, roundHandler);
      if (outcome.success) {
        // Tell everyone of the playlist update
        io.sockets.emit(playlistUpdateMsg, roundHandler.getTrackList());
      }
    });
  });

  // Initialisation
  app.use(cors());
  app.use(bodyParser.json()); // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

  app.get('/', (req, res) => res.send('The root you have reached. content we have not.'));

  app.get('/getTrackList', (req, res) => {
    const trackList = roundHandler.getTrackList();
    res.json(trackList);
  });

  app.post('/setUserTracks', (req, res) => {
    const outcome = setUserTracks(req.body, roundHandler);
    res.json(outcome);
    if (outcome.success) {
      // Tell everyone of the playlist update
      io.sockets.emit(playlistUpdateMsg, roundHandler.getTrackList());
    }
  });


  http.listen(3000, () => console.log('Spotify server listening on port 3000!'));
};
