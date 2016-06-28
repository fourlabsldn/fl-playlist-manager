/* eslint-env node */

const SpotifyWebApi = require('spotify-web-api-node');
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
    this.currentPlaylist = null; // playlist id
    this.refreshTimeout = null;

    // Create a completely new object.
    this.credentials = JSON.parse(JSON.stringify(credentials));

    this.spotifyApi = new SpotifyWebApi({
      redirectUri: this.credentials.redirect_uri,
      clientId: this.credentials.client_id,
      clientSecret: this.credentials.client_secret,
      accessToken: this.credentials.access_token,
      refreshToken: this.credentials.refresh_token,
    });

    Object.preventExtensions(this);
  }

  // ---------------------------------------------------------------------------
  //        Public
  // ---------------------------------------------------------------------------

  /**
   * Prepares the access token and today's playlist.
   * @method init
   * @return {Promise<void>}
   */
  init() {
    return this.refreshAccessToken()
    .then(() => this.initialiseDayPlaylist())
    .then((playlist) => {
      this.currentPlaylist = playlist.id;
      console.log('currentPlaylist: ', this.currentPlaylist);
    });
  }

  /**
   * Adds tracks to a playlist
   * @method addTracks
   * @param  {Array<String>} trackUris
   * @param  {String} playlistId = this.currentPlaylist
   */
  addTracks(trackUris, playlistId = this.currentPlaylist) {
    return this.spotifyApi.addTracksToPlaylist(
      this.credentials.username,
      playlistId,
      trackUris
    )
    .then(() => {
      console.log('Added tracks to playlist!');
    })
    .catch((err) => {
      console.log('Something went wrong!', err);
    });
  }

  // ---------------------------------------------------------------------------
  //        Private
  // ---------------------------------------------------------------------------
  /**
   * If the playlist exists it does nothing, if it does not exist
   * it creates it
   * @private
   * @method initialiseDayPlaylist
   * @param  {Date | Moment} date
   * @return {Promise<Object>} - The playlist object
   */
  initialiseDayPlaylist(date = new Date()) {
    const playlistName = this.generateDaysPLaylistName(date);

    return this.getPlaylist(playlistName)
    // If no playlist was found, create one.
    .then((playlist) => playlist || this.createPlaylist(playlistName));
  }

  /**
   * Returns a playlist if it is found or null if it isnt.
   * @private
   * @method getPlaylist
   * @param  {String} username
   * @param  {String} playlistName
   * @return {Promise<Object | null>} playlist
   */
  getPlaylist(playlistName, username = this.credentials.username) {
    return this.spotifyApi.getUserPlaylists(username)
    .then((data) => {
      assert(
        data.body && Array.isArray(data.body.items),
        'Error in Spotify\'s response, "items" is not an array.'
      );
      const foundPlaylist = data.body.items.find(p => p.name === playlistName);

      if (foundPlaylist) { console.log('Retrieved playlist', foundPlaylist.name); }
      return foundPlaylist;
    });
  }

  /**
   * Creates a playlist and returns its object.
   * @private
   * @method createPlaylist
   * @param  {String} username
   * @param  {String} playlistName
   * @return {Promise<String | null>} playlist
   */
  createPlaylist(playlistName, username = this.credentials.username) {
    return this.spotifyApi.createPlaylist(
      username,
      playlistName,
      { public: true }
    )
    .then((response = {}) => {
      const playlist = response.body;
      assert(playlist && typeof playlist === 'object', 'No playlist returned from createPlaylist');
      console.log('Created playlist', playlist.name);
      return playlist;
    });
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
   * Fetches a new access token to be used with all requests
   * @public
   * @method refreshAccessToken
   * @return {Promise<void>}
   */
  refreshAccessToken() {
    // Cancel scheduled refresh.
    clearTimeout(this.refreshTimeout);

    return this.spotifyApi.refreshAccessToken()
    .then((data) => {
      this.spotifyApi.setAccessToken(data.body.access_token);
      console.log('The access token has been refreshed.');

      // from seconds to miliseconds
      const timeToExpire = data.body.expires_in * 1000;
      // refresh the token five seconds before it expires.
      const refreshTime = timeToExpire - 10000;
      assert(refreshTime > 1000, `Invalid refresh time ${refreshTime}`);
      // Schedule next refresh
      this.refreshTimeout = setTimeout(() => this.refreshAccessToken(), refreshTime);
    })
    .catch((err) => console.log('Could not refresh access token', err));
  }

  // /**
  //  * Not fully implemented
  //  * @method authoriseWithUser
  //  * @return {Promise}
  //  */
  // authoriseWithUser() {
  //   // generate authorisation url with './authorisationUrl.js'
  //   //
  //   // send user to authorisation url and get authCode from redirectUri
  //   const authCode = 'code_retrieved_from_redirectUri';
  //
  //   // Retrieve an access token and a refresh token from authCode
  //   return this.spotifyApi.authorizationCodeGrant(authCode)
  //   .then((data) => {
  //     console.log(`
  //     The token expires in ${data.body.expires_in}
  //     The access token is ${data.body.access_token}
  //     The refresh token is ${data.body.refresh_token}`);
  //
  //     // Set the access token on the API object to use it in later calls
  //     this.spotifyApi.setAccessToken(data.body.access_token);
  //     this.spotifyApi.setRefreshToken(data.body.refresh_token);
  //   })
  //   .catch((err) => console.log('Something went wrong!', err));
  // }


};
