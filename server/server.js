/* eslint-env node */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const assert = require('assert');

module.exports = (spotify, roundHandler) => {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json()); // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

  app.get('/getTrackList', (req, res) => {
    const trackList = roundHandler.getTrackList();
    res.json(trackList);
  });

  app.post('/setUserTracks', (req, res) => {
    const tracks = req.body.tracks;
    const user = req.body.user;

    try {
      assert(tracks, 'Missing key. Tracks array not sent in request.');
      assert(Array.isArray(tracks), 'Tracks key is not an array.');
      assert(user, 'Missing key. User object not sent.');
      assert(typeof user.id === 'string', 'Invalid user id type.');
      assert(typeof user.name === 'string', 'Invalid user id type.');
      roundHandler.setUserTracks(user, tracks);
      res.json({ success: true });
    } catch (e) {
      console.log(e.message);
      res.json({ error: e.message });
      return;
    }
  });

  app.get('/', (req, res) => {
    res.send('The root you have reached. content we have not.');
  });

  app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
  });
};
