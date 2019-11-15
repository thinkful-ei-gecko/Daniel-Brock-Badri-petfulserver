require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { node_env } = require('./config');
const { CLIENT_ORIGIN } = require('../config');

module.exports = {
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  PORT: process.env.port || 8080,
};

const app = express();
app.use(
  cors({
    origin: CLIENT_ORIGIN,
  })
);

const cat = {
  imageURL:
    'https://assets3.thrillist.com/v1/image/2622128/size/tmg-slideshow_l.jpg',
  imageDescription:
    'Orange bengal cat with black stripes lounging on concrete.',
  name: 'Fluffy',
  sex: 'Female',
  age: 2,
  breed: 'Bengal',
  story: 'Thrown on the street',
};

app.get('/api/cat', (req, res) => {
  res.json(cat);
});

// Catch-all 404
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Catch-all Error handler
// Add NODE_ENV check to prevent stacktrace leak
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: app.get('env') === 'development' ? err : {},
  });
});

app.listen(8080, () => {
  console.log('Serving on 8080');
});
