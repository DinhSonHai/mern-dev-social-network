const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');
const route = require('./routes');

const app = express();

//Init middlewares
app.use(express.json({ extended: false }));

//Connect DB
connectDB();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const PORT = process.env.PORT || 5000;

route(app);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
