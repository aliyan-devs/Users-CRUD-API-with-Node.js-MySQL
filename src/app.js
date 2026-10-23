const express = require('express');
const usersRouter = require('./routes/users');

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use('/api/users', usersRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.status === 400 && err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body contains invalid JSON.' });
  }
  if (err.status === 413 && err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request body is too large.' });
  }
  if (err.status === 400 && err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'A user with this email already exists.' });
  }

  console.error('Unhandled request error:', err);
  return res.status(500).json({ error: 'Internal server error.' });
});

module.exports = app;
