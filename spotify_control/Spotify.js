/* eslint-env node */

const SpotifyWebApi = require('spotify-web-api-node');
const runGenerator = require('./runGenerator');
const moment = require('moment');
const assert = require('assert');

module.exports = class Spotify {
  /**
   * @constructor constructor
   * @param  {String} playlistPrefix
   * @param  {Object} credentials
   * @param  {String} credentials.client_id
   * @param  {String} credentials.client_secret
   * @param  {String} credentials.redirect_uri
   * @param  {String} credentials.access_token
   * @param  {String} credentials.refresh_token
   * @param  {String} credentials.username
   */
  constructor(playlistPrefix, credentials) {
    this.playlistPrefix = playlistPrefix;
    this.currentPlaylist = this.generateDaysPLaylistName(moment());
    // Create a completely new object.
    this.credentials = JSON.parse(JSON.stringify(credentials));

    this.spotifyApi = new SpotifyWebApi({
      redirectUri: this.credentials.redirect_uri,
      clientId: this.credentials.client_id,
      clientSecret: this.credentials.client_secret,
      accessToken: this.credentials.access_token,
      refreshToken: this.credentials.refresh_token,
    });
  }


  /**
   * If the playlist exists it does nothing, if it does not exist
   * it creates it
   * @method initialiseDayPlaylist
   * @param  {Date | Moment} date
   * @return {Promise}
   */
  initialiseDayPlaylist(date = new Date()) {
    function showError(err) { if (err) { console.log('Something went wrong!', err); } }

    const playlistName = this.generateDaysPLaylistName(date);
    const promise = Promise.resolve()
    // Get a user's playlists
    .then(() => this.spotifyApi.getUserPlaylists(this.credentials.username))

    // If the playlist was found, get its id.
    .then((data) => {
      assert(
        data.body && Array.isArray(data.body.items),
        'Error in Spotify\'s response, "items" is not an array.'
      );

      console.log('Retrieved playlists', data.body.items.map(p => p.name));

      const foundPlaylist = data.body.items.find(p => p.name === playlistName);
      const playlistId = foundPlaylist ? foundPlaylist.id : null;
      return playlistId;
    })
    .catch(showError)
    .then((playlistId) => {
      if (playlistId) {
        return playlistId;
      }
      return this.spotifyApi.createPlaylist(
        this.credentials.username,
        playlistName,
        { public: true }
      )
      .then((playlist) => {
        console.log('Created playlist!', playlist);
        assert(playlist, 'No playlist returned from createPlaylist');
        return playlist.id;
      });
    })
    .catch((err) => console.log('Something went wrong!', err))
    .then((...args) => console.log('Final arguments:', args));

    return promise;
  }

  /**
   * @private
   * @method generateDaysPLaylistName
   * @param  {Date | Moment} day
   * @return {String}
   */
  generateDaysPLaylistName(day) {
    assert(day instanceof Date || day instanceof moment, `Invalid date: ${day}`);
    const date = moment(day);
    return `${this.playlistPrefix} ${date.format('dddd DD MMM YY')}`;
  }

  /**
   * Not fully implemented
   * @method authoriseWithUser
   * @return {Promise}
   */
  authoriseWithUser() {
    // generate authorisation url with './authorisationUrl.js'
    //
    // send user to authorisation url and get authCode from redirectUri
    const authCode = 'code_retrieved_from_redirectUri';

    // Retrieve an access token and a refresh token from authCode
    return this.spotifyApi.authorizationCodeGrant(authCode)
    .then((data) => {
      console.log(`
      The token expires in ${data.body.expires_in}
      The access token is ${data.body.access_token}
      The refresh token is ${data.body.refresh_token}`);

      // Set the access token on the API object to use it in later calls
      this.spotifyApi.setAccessToken(data.body.access_token);
      this.spotifyApi.setRefreshToken(data.body.refresh_token);
    })
    .catch((err) => console.log('Something went wrong!', err));
  }
};
