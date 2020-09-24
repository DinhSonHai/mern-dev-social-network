const express = require('express');
const connectDB = require('./config/db');
const route = require('./routes');
require('dotenv').config();

const app = express();

//Init middlewares
app.use(express.json({ extended: false }));

//Connect DB
connectDB();

const PORT = process.env.PORT || 5000;

route(app);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
