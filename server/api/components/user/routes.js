const express = require('express');
const { param, body } = require("express-validator")
const UserController = require('./controller');
const { ErrorHandler } = require("../../helper");
const User = require('./user');

class UserRoutes {
	constructor(authenticator) {
		this.authService = authenticator;
		this.errorHandler = new ErrorHandler();
		this.controller = new UserController(authenticator);
		this.router = express.Router();
		this.initRoutes();
	}

	initRoutes() {
		this.router.get(
			'/',
			this.authService.isLoggedIn,
			(req, res, next) => this.controller.getAllUsers()
				.then((user) => res.status(200).json(user))
				.catch((err) => next(err))
		);

    this.router.get(
			'/current',
			this.authService.isLoggedIn,
			(req, res, next) => res.status(200).json(req.user)
		);

    this.router.post(
			'/login',
			body('email').isEmail(),
			body('password').isString(),
			this.errorHandler.validateRequest,
			(req, res, next) => this.controller.login(req, req.body.email, req.body.password)
				.then((user) => res.status(200).json(user))
				.catch((err) => next(err))
		);

		this.router.delete(
			'/logout',
			this.authService.logout
		);
	}
}

module.exports = UserRoutes;