/* eslint-env node */
const assert = require('assert');
const User = require('./User');

module.exports = class Track {
  constructor(trackInfo, user) {
    assert(typeof trackInfo.album === 'object', 'Invalid trackInfo object. Invalid "album" property type.'); // eslint-disable-line max-len
    assert(Array.isArray(trackInfo.artists), 'Invalid trackInfo object. Invalid "artists" property type.'); // eslint-disable-line max-len
    assert(typeof trackInfo.id !== 'undefined', 'Invalid trackInfo object. No "id" property set.'); // eslint-disable-line max-len
    this.info = trackInfo;

    this.info.user = undefined;
    this.user = undefined;
    if (user !== undefined) { this.setUser(user); }
    Object.preventExtensions(this);
  }

  /**
   * @public
   * @method isSame
   * @param  {Track} track
   * @return {Boolean}
   */
  isSame(track) {
    if (!(track instanceof Track)) { return false; }
    const trackInfo = track.getInfo();
    return trackInfo.id === this.info.id;
  }

  /**
   * @public
   * @method setUser
   * @param  {User} user
   */
  setUser(user) {
    assert(user instanceof User, 'Invalid user being set for track. Not instance of User.');
    assert(this.user === undefined,
      `User already set for track "${this.info.name}".
      Current user "${this.user.getInfo().name}". Trying to set "${user.getInfo().name}".`);
    this.info.user = user.getInfo();
    this.user = user;
  }

  /**
   * @public
   * @method getUser
   * @return {User}
   */
  getUser() {
    return this.user;
  }

  /**
   * @public
   * @method getInfo
   * @return {Object}
   */
  getInfo() {
    return this.info;
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
