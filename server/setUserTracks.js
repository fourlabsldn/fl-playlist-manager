/* eslint-env node */
const assert = require('assert');

/**
 * Updates a user's tracks and, if successfull, emits a message to everyone
 * with an updated track list
 * @method setUserTracks
 * @param  {Object} obj
 */
function setUserTracks(obj, roundHandler) {
  const tracks = obj.tracks;
  const user = obj.user;
  const outcome = { sucess: false, error: false };
  try {
    assert(tracks, 'Missing key. Tracks array not sent in request.');
    assert(Array.isArray(tracks), 'Tracks key is not an array.');
    assert(user, 'Missing key. User object not sent.');
    assert(typeof user.id === 'string', 'Invalid user id type.');
    assert(typeof user.name === 'string', 'Invalid user id type.');
    roundHandler.setUserTracks(user, tracks);
    outcome.success = true;
  } catch (e) {
    console.log(e.message);
    outcome.error = e.message;
  }

  return outcome;
}

module.exports = setUserTracks;
