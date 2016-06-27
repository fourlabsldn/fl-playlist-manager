/* eslint-env node */
const assert = require('assert');
const User = require('./User');


module.exports = class Round {
  constructor() {
    this.users = [];
    this.extractedTrackList = null;
    Object.preventExtensions(this);
  }

  /**
   * @public
   * @method addUser
   * @param  {User} user
   * @return {Boolean} successs/failure
   */
  addUser(user) {
    if (!this.isActive()) { return false; }
    assert(user instanceof User, `Invalid element being added to Round. Not of type User: ${user}`);
    if (this.hasUser(user)) {
      return false;
    }
    this.users.push(user);
    return true;
  }


  /**
   * @private
   * @method removeUser
   * @param  {User} user
   * @return {void}
   */
  removeUser(user) {
    if (!this.isActive()) { return; }
    const userIndex = this.users.find(u => u.isSame(user));
    if (userIndex === -1) { return; }
    const beforeIndex = this.users.slice(0, userIndex);
    const afterIndex = this.users.slice(userIndex + 1, this.users.length);
    this.users = beforeIndex.concat(afterIndex);
  }


  /**
   * @public
   * @method hasUser
   * @param  {user} user
   * @return {Boolean} [description]
   */
  hasUser(user) {
    const userFound = this.users.find(u => u.isSame(user));
    return userFound !== undefined;
  }

  /**
   * Creates a list of tracks based on the roundOffset and the
   * order in which users were added to this round.
   * @method previewTrackList
   * @param {Int} roundOffset
   * @return {Array<Track>}
   */
  getTrackList(roundOffset) {
    if (this.extractedTrackList !== null) { return this.extractedTrackList; }
    assert(typeof roundOffset === 'number', `Invalid round offset: ${roundOffset}`);

    const trackList = [];
    this.users.forEach(user => {
      const userTrack = user.getTrack(roundOffset);
      if (userTrack === undefined) {
        this.removeUser(user);
      } else {
        trackList.push(userTrack);
      }
    });
    return trackList;
  }

  /**
   * Returns the same result as getTrackList called with roundOffset of 0,
   * but differently from that method, extractTrackList is destructive and
   * will remove the selected tracks from their User objects. It will save the
   * extracted list and from then on getTrackList will always return this same list.
   * It will also render the round inactive.
   * @method extractTrackList
   * @return {Array<Track>}
   */
  extractTrackList() {
    assert(this.extractedTrackList === null, 'Extracting track list for round twice');
    const trackList = [];
    this.users.forEach(user => {
      const userTrack = user.extractTrack(0);
      if (userTrack === undefined) {
        this.removeUser(user);
      } else {
        trackList.push(userTrack);
      }
    });

    Object.freeze(this); // No changes any more my friend.
    return trackList;
  }

  /**
   * Once a trackList is extracted from the round, it has a static list of
   * tracks and is not active any more.
   * @method isActive
   * @return {Boolean}
   */
  isActive() {
    return this.extractedTrackList === null;
  }
};
