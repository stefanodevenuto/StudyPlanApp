const express = require('express');
const { param, body } = require("express-validator")
const StudyPlanController = require('./controller');
const { ErrorHandler } = require("../../helper");

class StudyPlanRoutes {
  constructor(authenticator, courseController) {
    this.authService = authenticator;
    this.errorHandler = new ErrorHandler();
    this.controller = new StudyPlanController(courseController);
    this.router = express.Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get(
      '/', 
      this.authService.isLoggedIn,
      (req, res, next) => this.controller.getStudyPlanByOwner(req.user.id)
        .then((course) => res.status(200).json(course))
        .catch((err) => next(err))
    );

    this.router.post(
      '/',
      this.authService.isLoggedIn,
      body('type').isString(),
      body('courses').isArray(),
			this.errorHandler.validateRequest,
      (req, res, next) => this.controller.createUpdateStudyPlan(req.user.id, req.body.type, req.body.courses)
        .then(() => res.status(200).send())
        .catch((err) => next(err))
    );

    this.router.delete(
      '/',
      this.authService.isLoggedIn,
      (req, res, next) => this.controller.deleteStudyPlan(req.user.id)
        .then(() => res.status(200).send())
        .catch((err) => next(err))
    );
  }
}

module.exports = StudyPlanRoutes;