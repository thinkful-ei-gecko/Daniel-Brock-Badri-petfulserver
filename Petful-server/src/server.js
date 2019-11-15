require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { node_env } = require('./config');
const { CLIENT_ORIGIN } = require('./config');
const { dogs, cats, users } = require('./Data');
const { peek } = require('./Queue');

const dogsList = dogs();
const catsList = cats();
const usersList = users();

const app = express();
const jsonBodyParser = express.json();
app.use(helmet());
app.use(
  cors({
    origin: CLIENT_ORIGIN,
  })
);

// app.use(function validateBearerToken(req, res, next) {
//   const apiToken = process.env.API_TOKEN;
//   const authToken = req.get('Authorization');

//   if (!authToken || authToken.split(' ')[1] !== apiToken) {
//     return res.status(401).json({ error: 'Unauthorized Request' });
//   }
//   next();
// });

app.get('/api/users', (req, res) => {
  res.json(peek(usersList));
});

app.post('/api/users', jsonBodyParser, (req, res) => {
  const { userName } = req.body;
  usersList.enqueue(userName);
  res.status(204).end();
});

app.delete('/api/users', (req, res) => {
  usersList.dequeue();
  res.status(204).end();
});

app.get('/api/cats', (req, res) => {
  res.json(peek(catsList));
});

app.delete('/api/cats', (req, res) => {
  catsList.dequeue();
  res.status(204).end();
});

app.get('/api/dogs', (req, res) => {
  res.json(peek(dogsList));
});

app.delete('/api/dogs', (req, res) => {
  dogsList.dequeue();
  res.status(204).end();
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
