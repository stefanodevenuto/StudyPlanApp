const express = require('express');
const { param, body } = require("express-validator")
const CourseController = require('./controller');
const { ErrorHandler } = require("../../helper");

class CourseRoutes {
  constructor(authenticator) {
    this.authService = authenticator;
    this.errorHandler = new ErrorHandler();
    this.controller = new CourseController();
    this.router = express.Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get(
      '/',
      //this.authService.isLoggedIn,
      (req, res, next) => this.controller.getAllCourses()
        .then((courses) => res.status(200).json(courses))
        .catch((err) => next(err))
    );

    this.router.get(
      '/:courseId',
      this.authService.isLoggedIn,
      param('courseId').isString(),
      this.errorHandler.validateRequest,
      (req, res, next) => this.controller.getCourseByID(req.params.courseId)
        .then((course) => res.status(200).json(course))
        .catch((err) => next(err))
    );
  }
}

module.exports = CourseRoutes;