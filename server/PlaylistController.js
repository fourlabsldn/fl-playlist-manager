/* eslint-env node */
const moment = require('moment');
const RoundHandler = require('../playlist_control/RoundHandler');
const Spotify = require('../spotify_control/Spotify');
const credentials = require('../spotify_control/credentials');

// Takes care of dealing with tracks and submitting them automatically
// to spotify.
module.exports = class PlaylistController {
  /**
   * @constructor
   * @param  {String} playlistPrefix
   */
  constructor(playlistPrefix) {
    this.spotify = new Spotify(playlistPrefix, credentials);
    this.roundHandler = new RoundHandler();
    this.playlistFinishTime = moment(new Date());

    Object.preventExtensions(this);

    setInterval(() => {
      console.log(
        'Time to next playlist update:',
        this.playlistFinishTime.diff(moment(), 'seconds'),
        'seconds', 'seconds.'
      );
    }, 1000);
  }

  init() {
    return this.spotify.init();
  }

  getTrackList(...args) {
    return this.roundHandler.getTrackList(...args);
  }

  setUserTracks(...args) {
    this.roundHandler.setUserTracks(...args);

    const playlistAlreadyFinished = moment().diff(this.playlistFinishTime) >= 0;
    if (playlistAlreadyFinished) {
      this.submitToSpotify();
    }
  }


  /**
   * Extracts a round of tracks and submits it to spotify
   * @method submitToSpotify
   * @return {void}
   */
  submitToSpotify() {
    const trackList = this.roundHandler.generateNextTrackListRound();
    const trackListDuration = this.roundHandler.calculateRoundDuration(trackList);

    const trackUris = trackList.map(t => t.getInfo().uri);
    try {
      this.spotify.addTracks(trackUris);
    } catch (e) {
      console.error('Error: ', e);
    }

    // Get the latest time.
    const playlistFinishTime = this.playlistFinishTime.diff(moment(), 'milliseconds') > 0
      ? this.playlistFinishTime
      : moment();

    const newPlaylistFinishTime = moment(playlistFinishTime).add(trackListDuration, 'milliseconds');
    this.playlistFinishTime = newPlaylistFinishTime;

    const timeToPLaylistEnd = this.playlistFinishTime.diff(moment(), 'milliseconds'); // in ms
    // submit next track round 10 seconds before the tracklist ends.
    const timeToNextSubmission = timeToPLaylistEnd - 10000; // in ms

    // Schedule next update
    setTimeout(() => this.submitToSpotify(), timeToNextSubmission);
  }
};
