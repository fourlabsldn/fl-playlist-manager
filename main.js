/* eslint-env node */

const RoundHandler = require('./RoundHandler');
const trackData = require('./demoData/trackData');
const userData = require('./demoData/userData');
const handler = new RoundHandler();

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

function logTracks(trackList) {
  const list = trackList.map(t => {
    if (!t.getInfo) { return t; }
    const tInfo = t.getInfo();
    return {
      used: tInfo.used,
      user_name: tInfo.user.name,
      track_name: tInfo.name,
    };
  });
  console.log(' ');
  console.log(list);
}

logTracks(handler.generateNextTrackListRound());

try {
  handler.setUserTrackOrder(userData[3], [
    trackData[8],
    trackData[6],
    trackData[5],
  ]);
} catch (e) {
  console.log(e.message);
}
logTracks(handler.getTrackList());
