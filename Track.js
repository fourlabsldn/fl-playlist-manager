/* eslint-env node */
const assert = require('assert');
const User = require('./User');

module.exports = class Track {
  constructor(trackInfo) {
    assert(typeof trackInfo.album === 'object', 'Invalid trackInfo object. Invalid "album" property type.'); // eslint-disable-line max-len
    assert(Array.isArray(trackInfo.artists), 'Invalid trackInfo object. Invalid "artists" property type.'); // eslint-disable-line max-len
    assert(typeof trackInfo.id !== 'undefined', 'Invalid trackInfo object. No "id" property set.'); // eslint-disable-line max-len

    // Make sure we are creating an entirely new object.
    this.info = JSON.parse(JSON.stringify(trackInfo));
    this.info.user = undefined;
    this.user = undefined;
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
    const trackUserId = trackInfo.user ? track.user.id : undefined;
    const thisUserId = this.user ? this.user.id : undefined;

    return trackInfo.id === this.info.id && thisUserId === trackUserId;
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
      Current user "${this.user}". Trying to set "${user}".`);
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
