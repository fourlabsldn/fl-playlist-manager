/* eslint-env node */

const RoundHandler = require('./RoundHandler');
const trackData = require('./demoData/trackData');
const userData = require('./demoData/userData');
const handler = new RoundHandler();

console.log('Length of trackData:', trackData.length);
console.log('Length of userData:', userData.length);

handler.addTrack(trackData[0], userData[0]);
handler.addTrack(trackData[1], userData[0]);
handler.addTrack(trackData[2], userData[0]);

handler.addTrack(trackData[3], userData[1]);
handler.addTrack(trackData[4], userData[1]);

//
//
console.log(handler.getTrackList());
//
// handler.setUserTracks(userId, tracks);
//
//
//
//
//
//
// //////////////////////////////////////////
// // When it's 20 seconds for the playlist to finish, add new round to playlist.
// userSongs.createRound();
