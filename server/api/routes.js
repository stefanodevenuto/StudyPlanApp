const express = require('express');
const morgan = require('morgan');
const registerApiRoutes = require('./components/index')
const { registerErrorHandler } = require("./helper")
const { Authenticator } = require('../services/auth/authentication')

function initRestRoutes(router) {
    const prefix = '/api';

    router.get(prefix, (req, res) => res.send('It works!'));

    router.use(morgan('dev'));
    router.use(express.json());

    const authenticator = new Authenticator(router);
    registerApiRoutes(router, prefix, authenticator);
    registerErrorHandler(router);
}

module.exports = initRestRoutes;
