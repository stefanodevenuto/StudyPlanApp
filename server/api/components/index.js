const UserRoutes = require('./user/routes');
const CourseRoutes = require('./courses/routes');
const StudyPlanRoutes = require('./study_plan/routes');


function registerApiRoutes(router, prefix = '', authenticator = null) {

	// Create all Routes
	const userRoute = new UserRoutes(authenticator);
	const courseRoutes = new CourseRoutes(authenticator);
	const studyPlanRoutes = new StudyPlanRoutes(authenticator, courseRoutes.controller);
	
	// Set all Routes
	router.use(`${prefix}/user`, userRoute.router);
	router.use(`${prefix}/course`, courseRoutes.router);
	router.use(`${prefix}/studyPlan`, studyPlanRoutes.router);
}

module.exports = registerApiRoutes;
