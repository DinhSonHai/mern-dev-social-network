const express = require('express');
const connectDB = require('./config/db');
const route = require('./routes');
const path = require('path');
require('dotenv').config();

const app = express();

//Init middlewares
app.use(express.json({ extended: false }));

//Connect DB
connectDB();

const PORT = process.env.PORT || 5000;

route(app);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  //Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
