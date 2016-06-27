/* eslint-env node */
const assert = require('assert');
const Track = require('./Track');
const Round = require('./Round');
const User = require('./User');

module.exports = class RoundHandler {
  constructor() {
    this.rounds = [];
    this.users = [];
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
    const track = new Track(trackInfo, userInfo);
    const user = this.getUser(userInfo, user);
    const trackAdded = user.addTrack(track);
    if (!trackAdded) { return false; }

    let userAddedToRound = false;
    for (const round of this.rounds) {
      userAddedToRound = round.addUser(user);
      if (userAddedToRound) { break; }
    }
    // If there was no success in adding the user to any of the existing rounds,
    // it means it is already present in all rounds. So let's create a new
    // round for him.
    if (!userAddedToRound) {
      const newRound = new Round();
      userAddedToRound = newRound.addUser(user);
      this.rounds = this.rounds.concat([newRound]);
    }

    assert(userAddedToRound, 'Bug found. User was misteriously not added to any round.');
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
   * Get list of tracks without changing any round's active state
   * @method getTrackList
   * @return {Array<Track>}
   */
  getTrackList() {
    let fullTrackList = [];
    let roundOffset = -1;
    for (const round of this.rounds) {
      // We will be sending roundOffset -1 while we have inactive rounds.
      // As soon as we hit active rounds we will start counding the offset.
      roundOffset += round.isActive() ? 1 : 0;
      const roundTrackList = round.getTracklist(roundOffset);
      fullTrackList = fullTrackList.concat(roundTrackList);

      assert(round.isActive() && roundOffset >= 0 || roundOffset === -1,
        `Round inactive after active rounds. Round offset ${roundOffset}`);
    }
    return fullTrackList;
  }

  /**
   * Returns one round of tracks and sets the first active round
   * as inactive.
   * @method generateNextTrackListRound
   * @return {Array<Track>}
   */
  generateNextTrackListRound() {
    const firstActiveRound = this.rounds.find(r => r.isActive());
    // This will set the round as inactive and freeze its tracks.
    // It will also make those tracks non-modifiable.
    const trackList = firstActiveRound.extractTrackList();
    return trackList;
  }
};
