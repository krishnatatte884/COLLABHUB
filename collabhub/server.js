const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
const profilesRouter = require('./routes/profiles');
app.use('/api/profiles', profilesRouter);

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle other frontend routes
app.get('/:page', (req, res) => {
  const page = req.params.page;
  if (['profile', 'create-profile', 'projects', 'search'].includes(page)) {
    res.sendFile(path.join(__dirname, 'public', `${page}.html`));
  } else {
    res.status(404).send('Not found');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});