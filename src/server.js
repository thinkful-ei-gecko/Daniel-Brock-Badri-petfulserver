require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { node_env } = require('./config');
const { CLIENT_ORIGIN } = require('./config');
const { dogs, cats, users } = require('./Data');
const { peek, makeArrayFromQueue } = require('./Queue');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('./config');

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

//Posts a new user
app.post('/api/users', jsonBodyParser, (req, res) => {
  const { user } = req.body;
  usersList.enqueue(user);
  res.status(200).json({ user });
});

//Returns the entire queue as an array
app.get('/api/queue', (req, res) => {
  let list = makeArrayFromQueue(usersList);
  res.status(200).send(list);
});

//Returns the cats queue as an  object
app.get('/api/cats', (req, res) => {
  let catsQueue = makeArrayFromQueue(catsList);
  res.status(200).send(catsQueue);
});

//If name passed in request matches the value in the queue,
//dequeues the cat and the user (adoption successful)
app.delete('/api/cats', jsonBodyParser, (req, res) => {
  let name = req.headers.authorization;
  if (name !== usersList.first.value) {
    return res.status(401).json({ error: 'You must wait your turn!' });
  }
  catsList.dequeue();
  usersList.dequeue();
  res.status(204).end();
});

//Returns the dog queue as an object
app.get('/api/dogs', (req, res) => {
  let dogsQueue = makeArrayFromQueue(dogsList);
  res.status(200).send(dogsQueue);
});

//If name passed in request matches the value in the queue,
//dequeues the cat and the user (adoption successful)
app.delete('/api/dogs', jsonBodyParser, (req, res) => {
  let name = req.headers.authorization;
  if (name !== usersList.first.value) {
    return res.status(401).json({ error: 'You must wait your turn!' });
  }
  dogsList.dequeue();
  usersList.dequeue();
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
