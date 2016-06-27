/* eslint-env node */
const assert = require('assert');

module.exports = class User {
  constructor({ id, name }) {
    assert(typeof id !== 'undefined' && typeof name !== 'undefined',
      `The combination { id: ${id}, name: ${name}} is not valid.`);
    this.id = id;
    this.name = name;
    this.tracks = [];
    Object.preventExtensions(this);
  }

  /**
   * Adds a track to the user list. If this track was already added,
   * it is rejected.
   * @public
   * @method addTrack
   * @param  {Track} track
   * @return {Boolean} success/failure
   */
  addTrack(track) {
    if (this.hasTrack(track)) {
      return false;
    }
    track.setUser(this);
    this.tracks = this.tracks.concat([track]);
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
   * Returns the track in the index requested and removes it from
   * the tracks array
   * @method extractTrack
   * @param {Int} trackNo - zero indexed
   * @return {Track}
   */
  extractTrack(trackNo) {
    assert(typeof trackNo === 'number', `Invalid track number: ${trackNo}`);
    const track = this.tracks[trackNo];
    const beforeIndex = this.tracks.slice(0, trackNo);
    const afterIndex = this.tracks.slice(trackNo + 1, this.tracks.length);
    this.tracks = beforeIndex.concat(afterIndex);
    return track;
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
    const userInfo = user.getInfo();
    if (userInfo.id !== this.info.id) {
      return false;
    }
    assert(userInfo.name === this.info.name,
      `Bad data. User of id "${userInfo.id}" found with different names:
      "${userInfo.name}", "this.info.name"`);
    return true;
  }

  /**
   * @public
   * @method toJSON
   * @return {String}
   */
  toJSON() {
    return JSON.stringify(this.getInfo());
  }
};
