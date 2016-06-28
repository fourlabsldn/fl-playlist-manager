/* eslint-env node */
const assert = require('assert');
const User = require('./User');
const trackProperties = [
  'id',
  'name',
  'album',
  'artists',
  'uri',
  'duration_ms',
  'available_markets',
  'disc_number',
  'explicit',
  'external_ids',
  'external_urls',
  'href',
  'popularity',
  'preview_url',
  'track_number',
  'type',
];

module.exports = class Track {
  constructor(trackInfo) {
    assert(typeof trackInfo.album === 'object', 'Invalid trackInfo object. Invalid "album" property type.'); // eslint-disable-line max-len
    assert(Array.isArray(trackInfo.artists), 'Invalid trackInfo object. Invalid "artists" property type.'); // eslint-disable-line max-len
    assert(typeof trackInfo.id !== 'undefined', 'Invalid trackInfo object. No "id" property set.'); // eslint-disable-line max-len

    // Make sure we are creating an entirely new object.
    const info = JSON.parse(JSON.stringify(trackInfo));
    for (const propName of trackProperties) {
      this[propName] = info[propName];
    }

    this.user = undefined;
    this.used = false;
    Object.preventExtensions(this);
  }

  /**
   * @public
   * @method isSame
   * @param  {Track} track
   * @param {Boolean} trackUser - User to use in comparison
   * @return {Boolean}
   */
  isSame(track, trackUser) {
    if (!(track instanceof Track)) { return false; }

    const user = trackUser || track.user;
    const trackUserId = user ? user.id : undefined;
    const thisUserId = this.user ? this.user.id : undefined;

    return track.id === this.id && thisUserId === trackUserId;
  }

  /**
   * @public
   * @method setUser
   * @param  {User} user
   */
  setUser(user) {
    assert(user instanceof User, 'Invalid user being set for track. Not instance of User.');
    assert(this.user === undefined,
      `User already set for track "${this.name}".
      Current user "${this.user}". Trying to set "${user}".`);
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
   * @method getId
   * @return {String}
   */
  getId() {
    return this.id;
  }

  /**
   * @public
   * @method getInfo
   * @return {Object}
   */
  getInfo() {
    const ownKeys = Object.keys(this);
    const info = {};
    for (const key of ownKeys) {
      info[key] = this[key];
    }
    info.user = this.user ? this.user.getInfo() : undefined;
    return info;
  }

  /**
   * @public
   * @method setUsed
   */
  setUsed() {
    assert(this.user !== undefined,
      `Cannot set a track as used if no used is assigned to it. Track: ${this.name}`);
    this.used = true;
  }

  /**
   * @public
   * @method isUsed
   * @return {Boolean}
   */
  isUsed() {
    return this.used;
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
