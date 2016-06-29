/* eslint-env node */
const RoundHandler = require('../playlist_control/RoundHandler');
const Spotify = require('../spotify_control/Spotify');
const credentials = require('../spotify_control/credentials');

module.exports = class PlaylistController {
  /**
   * @constructor
   * @param  {String} playlistPrefix
   */
  constructor(playlistPrefix) {
    this.spotify = new Spotify(playlistPrefix, credentials);
    this.roundHandler = new RoundHandler();
  }

  init() {
    return this.spotify.init();
  }

  getTrackList(...args) {
    return this.roundHandler.getTrackList(...args);
  }

  setUserTracks(...args) {
    return this.roundHandler.setUserTracks(...args);
  }
};
