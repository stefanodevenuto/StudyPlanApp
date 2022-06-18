const COURSE_NOT_FOUND = "Course not found";

class CourseErrorFactory extends Error{
    static newCourseNotFound() {
        let error = new Error();
		error.customMessage = COURSE_NOT_FOUND;
        error.customCode = 404;

		return error;
    }
}

module.exports = { CourseErrorFactory }