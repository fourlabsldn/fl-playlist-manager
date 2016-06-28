/* eslint-env node */

const moment = require('moment');
const assert = require('assert');

module.exports = class SpotifyAPI {
  constructor(playlistPrefix, userId) {
    this.playlistPrefix = playlistPrefix;
    this.currentPlaylist = this.generateDaysPLaylistName(moment());
  }

  /**
   * @private
   * @method generateDaysPLaylistName
   * @param  {Date | Moment} day
   * @return {String}
   */
  generateDaysPLaylistName(day) {
    assert(day instanceof Date || day instanceof moment, `Invalid date: ${day}`);
    const date = moment(day);
    return `${this.playlistPrefix} ${date.format('dddd DD MMM YY')}`;
  }
};
