/* eslint-env node */
const express = require('express');
const bodyParser = require('body-parser')

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
    console.log('Tracks: ', tracks);
    console.log('User:', user);
    res.json({ success: true });
  });

  app.get('/', (req, res) => {
    console.dir(req.query);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  });

  app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
  });
};
