/* eslint-env node */
const assert = require('assert');
const Track = require('./Track');
const User = require('./User');

module.exports = class RoundHandler {
  constructor() {
    this.users = [];
    this.usedTracks = [];
    this.lastPlaylistData = { duration: 0, generationTime: new Date() };
    Object.preventExtensions(this);
  }

  /**
   * Adds a track to a user's track list and adds the user who sent the track
   * to the earliest round he is not in. The track will thus be available for
   * retrievable during playlist creation time.
   * @public
   * @method addTrack
   * @param  {Object} track
   * @param  {Object} userInfo
   * @return {Boolean} success/failure
   */
  addTrack(trackInfo, userInfo) {
    const track = new Track(trackInfo);
    const user = this.getUser(userInfo);
    const trackAdded = user.addTrack(track);
    if (!trackAdded) { return false; }
    return true;
  }


  /**
   * Returns an existing user object or, if not found, creates a new one.
   * @private
   * @method getUser
   * @param  {Object} param
   * @param  {String} param.id
   * @param  {String} param.name
   * @return {User}
   */
  getUser({ id, name }) {
    assert(id !== undefined && name !== undefined, 'No "id" or "name" parameters given.');

    const userFound = this.users.find(u => u.getInfo().id === id);
    if (userFound) { return userFound; }

    const newUser = new User({ id, name });
    this.users.push(newUser);
    return newUser;
  }


  /**
   * Get list of tracks without changing anything in any object
   * @method getTrackList
   * @return {Array<Track>}
   */
  getTrackList() {
    let fullTrackList = [].concat(this.usedTracks);
    let roundTracks = [];
    let roundOffset = 0;

    do {
      const tracksAndTimes = [];
      for (const user of this.users) {
        const track = user.getTrack(roundOffset);
        const settingTime = user.getTrackSettingTime(roundOffset);
        if (track) { tracksAndTimes.push({ track, settingTime }); }
      }

      // Order by setting time.
      tracksAndTimes.sort((t1, t2) => t1.settingTime.diff(t2.settingTime));

      // Get just the tracks
      roundTracks = tracksAndTimes.map(t => t.track);
      roundOffset += 1;

      fullTrackList = fullTrackList.concat(roundTracks);
    } while (roundTracks.length > 0);

    return fullTrackList;
  }

  /**
   * Returns one round of tracks and sets all tracks in this round to
   * used, so they can't be moved anymore.
   * as inactive.
   * @method generateNextTrackListRound
   * @return {Array<Track>}
   */
  generateNextTrackListRound() {
    const roundOffset = 0;
    const roundTrackList = [];
    for (const user of this.users) {
      const track = user.extractTrack(roundOffset);
      if (track) { roundTrackList.push(track); }
    }
    this.usedTracks = this.usedTracks.concat(roundTrackList);

    this.lastPlaylistData.duration = this.calculateRoundDuration(roundTrackList);
    this.lastPlaylistData.generationTime = new Date();
    return roundTrackList;
  }

  /**
   * @public
   * @method getLastPlaylistData
   * @return {Object}
   */
  getLastPlaylistData() {
    return {
      duration: this.lastPlaylistData.duration,
      generationTime: this.lastPlaylistData.generationTime,
    };
  }

  /**
   * Repeated tracks are removed
   * @public
   * @method setUserTracks
   * @throws if trackOrder doesn't have the exact same tracks as user.tracks.
   * @param  {Object} userInfo
   * @param  {Array<Object>} trackObjects
   */
  setUserTracks(userInfo, trackObjects) {
    const user = this.getUser(userInfo);
    const allTracks = trackObjects.map(t => new Track(t));

    // Remove all tracks that have already been used.
    const notUsedTracks = allTracks.filter(t => {
      return !this.usedTracks.find(used => used.isSame(t, user));
    });

    return user.setTracks(notUsedTracks);
  }


  /**
   * @public
   * @method calculateRoundDuration
   * @param  {Array<track>} tracks
   * @return {Int} - in milliseconds
   */
  calculateRoundDuration(tracks) {
    return tracks.reduce((sum, t) => sum + t.duration_ms, 0);
  }
};
