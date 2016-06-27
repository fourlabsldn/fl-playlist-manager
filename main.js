/* eslint-env node */

const RoundHandler = require('./RoundHandler');
const trackData = require('./demoData/trackData');
const userData = require('./demoData/userData');
const handler = new RoundHandler();

console.log('Length of trackData:', trackData.length);
console.log('Length of userData:', userData.length);
console.log(userData[0]);
console.log(userData[1]);
console.log(userData[2]);
console.log(userData[3]);


handler.addTrack(trackData[0], userData[0]);
handler.addTrack(trackData[1], userData[0]);
handler.addTrack(trackData[2], userData[0]);

handler.addTrack(trackData[3], userData[1]);
handler.addTrack(trackData[4], userData[1]);

handler.addTrack(trackData[3], userData[2]);

handler.addTrack(trackData[5], userData[3]);
handler.addTrack(trackData[6], userData[3]);
handler.addTrack(trackData[7], userData[3]);
handler.addTrack(trackData[8], userData[3]);

let trackList = handler.getTrackList().map(t => {
  if (!t.getInfo) { return t; }
  const tInfo = t.getInfo();
  return {
    // id: tInfo.id,
    user_name: tInfo.user.name,
    track_name: tInfo.name,
  };
});

console.log(trackList);

handler.setUserTrackOrder(userData[3], [
  trackData[8],
  trackData[5],
  trackData[6],
  trackData[7],
]);

console.log(' ');

trackList = handler.getTrackList().map(t => {
  if (!t.getInfo) { return t; }
  const tInfo = t.getInfo();
  return {
    // id: tInfo.id,
    user_name: tInfo.user.name,
    track_name: tInfo.name,
  };
});
console.log(trackList);
