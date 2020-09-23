const express = require('express');
const connectDB = require('./config/db');
const route = require('./routes');
const path = require('path');
require('dotenv').config();

const users = require('./routes/api/users');
const auth = require('./routes/api/auth');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

//Init middlewares
app.use(express.json({ extended: false }));

//Connect DB
connectDB();

const PORT = process.env.PORT || 5000;

// route(app);

app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/profile', profile);
app.use('/api/posts', posts);
app.use('/', (req, res) => res.send('API running'));

app.use(express.static('client/build'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
