/* eslint-env node */

const PlaylistController = require('./server/PlaylistController');
const playlistName = 'Office';
const playlistController = new PlaylistController(playlistName);

const server = require('./server/server');

playlistController.init()
  .then(() => server(playlistController));
