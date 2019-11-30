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

const AuthService = {
  getUserWithUserName(db, username) {
    return 'user'.where({ username }).first();
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },
  createJwt(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      expiresIn: config.JWT_EXPIRY,
      algorithm: 'HS256',
    });
  },
  verifyJwt(token) {
    return jwt.verify(token, config.JWT_SECRET, {
      algorithms: ['HS256'],
    });
  },
};

app.get('/api/users', (req, res) => {
  res.json(peek(usersList));
});

app.post('/api/users', jsonBodyParser, (req, res) => {
  const { user } = req.body;
  usersList.enqueue(user);
  res.status(200).json({ user });
});

app.get('/api/position', jsonBodyParser, (req, res) => {
  const { user } = req.body.id;
  let placeInLine = usersList.getUserPlaceInLine(user);
  res.status(200).json({ user, placeInLine });
});

app.get('/api/cats', (req, res) => {
  console.log(usersList.first);
  res.json(peek(catsList));
});

app.delete('/api/cats', jsonBodyParser, (req, res) => {
  let name = req.user.name;
  if (name !== usersList.first.value) {
    return res.status(401).json('You must wait your turn!');
  }
  catsList.dequeue();
  usersList.dequeue();
  res.status(204).end();
});

app.get('/api/dogs', (req, res) => {
  res.json(peek(dogsList));
});

app.delete('/api/dogs', jsonBodyParser, (req, res) => {
  let name = req.headers.authorization;
  if (name !== usersList.first.value) {
    return res.status(401).json({ error: 'You must wait your turn!' });
  }
  dogsList.dequeue();
  usersList.dequeue();
  res.status(204).end();
});

app.get('/api/queue', (req, res) => {
  let list = makeArrayFromQueue(usersList);
  res.status(200).send(list);
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
