'use strict';
require('dotenv').config();
const cors = require('cors');

var express = require('express');
var initRestRoutes = require('./api/routes')

var app = new express();
var port = process.env.PORT || 3002;

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

initRestRoutes(app);

app.listen(port, function () {
    console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;
