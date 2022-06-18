const STUDYPLAN_NOT_FOUND = "StudyPlan not found";
const TYPE_NOT_VALID = "Type not valid";
const INVALID_CREDITS = "The total number of credits exceeds the constraints of the selected Study Plan type";
const INCOMPATIBLE_COURSES = "There are some courses that are incompatible";
const PROPEDEUTIC_COURSES = "Some propedeutic courses are not present";

class StudyPlanErrorFactory extends Error {
  static newStudyPlanNotFound() {
    let error = new Error();
    error.customMessage = STUDYPLAN_NOT_FOUND;
    error.customCode = 404;

    return error;s
  }

  static newTypeNotValid() {
    let error = new Error();
    error.customMessage = TYPE_NOT_VALID;
    error.customCode = 422;

    return error;
  }

  static newInvalidNumberOfCredits() {
    let error = new Error();
    error.customMessage = INVALID_CREDITS;
    error.customCode = 422;

    return error;
  }

  static newNoPropedeuticCourse() {
    let error = new Error();
    error.customMessage = PROPEDEUTIC_COURSES;
    error.customCode = 422;

    return error;
  }

  static newIncompatibleCourses() {
    let error = new Error();
    error.customMessage = INCOMPATIBLE_COURSES;
    error.customCode = 422;

    return error;
  }
}

module.exports = { StudyPlanErrorFactory }