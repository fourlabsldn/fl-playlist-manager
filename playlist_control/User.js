/* eslint-env node */
const assert = require('assert');
const moment = require('moment');

module.exports = class User {
  constructor({ id, name }) {
    assert(typeof id !== 'undefined' && typeof name !== 'undefined',
      `The combination { id: ${id}, name: ${name}} is not valid.`);
    this.id = id;
    this.name = name;
    this.tracks = [];

    // A chronologically ordered array containing the time that
    // each track position was filled.
    // Index 0 has the time the first tracks was addded, index 1 the second...
    this.trackSettingTimes = [];
    Object.preventExtensions(this);
  }

  /**
   * Adds a track to the user list. If this track was already added,
   * it is rejected.
   * @public
   * @method addTrack
   * @param  {Track} track
   * @param {Date | moment} trackSettingTime
   * @return {Boolean} success/failure
   */
  addTrack(track, trackSettingTime = moment()) {
    if (this.hasTrack(track)) {
      return false;
    }
    track.setUser(this);
    this.tracks = this.tracks.concat([track]);
    this.trackSettingTimes = this.trackSettingTimes.concat([trackSettingTime]);
    return true;
  }

  /**
   * @public
   * @method hasTrack
   * @param  {Track} track
   * @return {Boolean}
   */
  hasTrack(track) {
    const trackFound = this.tracks.find(t => t.isSame(track));
    return trackFound !== undefined;
  }

  /**
   * @public
   * @method getTrack
   * @param  {Int} trackNo
   * @return {Track}
   */
  getTrack(trackNo) {
    return this.tracks[trackNo];
  }

  /**
   * @public
   * @method getTrackSettingTime
   * @param  {Int} trackNo
   * @return {Moment}
   */
  getTrackSettingTime(trackNo) {
    return this.trackSettingTimes[trackNo];
  }

  /**
   * Replaces all user tracks for new ones.
   * @public
   * @method setTracks
   * @param  {Array<Track>} tracks
   */
  setTracks(tracks) {
    const settingTimes = this.trackSettingTimes;
    this.trackSettingTimes = [];
    this.tracks = [];
    tracks.forEach((t, idx) => this.addTrack(t, settingTimes[idx]));

    // Trim trackSettingTimes to this.tracks size, in case the new tracks
    // have less elements than the last tracks
    this.trackSettingTimes = this.trackSettingTimes.slice(0, this.tracks.length);
  }

  /**
   * Returns the track in the index requested and removes it from
   * the tracks array
   * @method extractTrack
   * @param {Int} trackNo - zero indexed
   * @return {Track}
   */
  extractTrack(trackNo) {
    assert(typeof trackNo === 'number', `Invalid track number: ${trackNo}`);
    const track = this.tracks[trackNo];
    if (!track) { return null; }

    track.setUsed();
    this.tracks = withoutIndex(this.tracks, trackNo);
    this.trackSettingTimes = withoutIndex(this.trackSettingTimes, trackNo);
    assert(this.tracks.length === this.trackSettingTimes.length,
      `User ${this.name} tracks and trackSettingTimes out of sync.`);
    return track;
  }

  /**
   * @public
   * @method setTrackOrder
   * @throws if trackOrder doesn't have the exact same tracks as user.tracks.
   * @param  {Array<Object>} tracks - Array of track objects. Must contain the
   * same track ids that the user's current tracks array has.
   */
  setTrackOrder(tracks) {
    this.setTracks(tracks);
  }

  /**
   * @public
   * @method getInfo
   * @return {Object}
   */
  getInfo() {
    return {
      id: this.id,
      name: this.name,
    };
  }

  /**
   * @public
   * @method isSame
   * @return {Boolean}
   */
  isSame(user) {
    if (!(user instanceof User)) { return false; }
    const userInfo = user.getInfo();
    if (userInfo.id !== this.id) {
      return false;
    }
    assert(userInfo.name === this.name,
      `Bad data. User of id "${userInfo.id}" found with different names:
      "${userInfo.name}", "this.name"`);
    return true;
  }

  /**
   * @public
   * @method toJSON
   * @return {String}
   */
  toJSON() {
    return this.getInfo();
  }
};

function withoutIndex(arr, idx) {
  const beforeIndex = arr.slice(0, idx);
  const afterIndex = arr.slice(idx + 1, arr.length);
  return beforeIndex.concat(afterIndex);
}
