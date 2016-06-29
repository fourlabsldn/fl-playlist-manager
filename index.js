/* eslint-env node */

const PlaylistController = require('./server/PlaylistController');
const playlistName = 'Test-Office'; // Remember to change this for production
const playlistController = new PlaylistController(playlistName);

const server = require('./server/server');

playlistController.init()
  .then(() => server(playlistController));
