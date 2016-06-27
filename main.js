round = new Round();
track = new Track();
user = new User({
  id: 1,
  name: 'afd',
  tracks: [track, track],
});

users = [user];
rounds = [round];
spotify = new SpotifyAPI();


roundTracks = round.generateTracklist();
playedTracks = playedTracks.concat(roundTracks);
spotify.addToPlaylist(roundTracks);





//////////////////////////////////////////
// When it's 20 seconds for the playlist to finish, add new round to playlist.
userSongs.createRound();
