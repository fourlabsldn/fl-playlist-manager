/* eslint-env node */
const express = require('express');
const bodyParser = require('body-parser');

module.exports = (spotify, roundHandler) => {
  const app = express();
  app.use(bodyParser.json()); // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

  app.get('/getTrackList', (req, res) => {
    const trackList = roundHandler.getTrackList();
    res.json(trackList);
  });

  app.post('/setUserTracks', (req, res) => {
    const tracks = req.body.tracks;
    const user = req.body.user;
    roundHandler.setUserTracks(user, tracks);
    res.json({ success: true });
  });

  app.get('/', (req, res) => {
    res.send('The root you have reached. content we have not.');
  });

  app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
  });
};
