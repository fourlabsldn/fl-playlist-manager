/* eslint-env node */
const express = require('express');
const app = express();

module.exports = () => {
  app.get('/finish', () => {
  });

  app.get('/', (req, res) => {
    console.dir(req.query);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  });

  app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
  });
};
