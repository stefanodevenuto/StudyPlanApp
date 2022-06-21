import Course from "../CourseList/course";

const INCREMENT = 1;
const DECREMENT = 2;
const NOTHING = 3;

const ACTION = {
  INCREMENT: INCREMENT,
  DECREMENT: DECREMENT,
  NOTHING: NOTHING
}

const LOGIN_ERROR = "Cannot perform login";
const LOGOUT_ERROR = "Cannot perform logout";
const GET_STUDYPLAN_ERROR = "Cannot recover the current Study Plan";
const GET_COURSES_ERROR = "Cannot recover the courses list";
const CREATE_STUDYPLAN_ERROR = "Cannot create/update the Study Plan";
const DELETE_STUDYPLAN_ERROR = "Cannot delete the Study Plan";
const BOUND_EXCEEDED_ERROR = "Please, add/remove some courses, because the bounds for credits are not respected"
const FILL_FIELDS_ERROR = "Please fill all the fields";
const INVALID_MAIL_ERROR = "Please insert a valid mail";
const INVALID_CREDENTIALS_ERROR = "Invalid credentials";

const ERRORS = {
  LOGIN_ERROR: LOGIN_ERROR,
  LOGOUT_ERROR: LOGOUT_ERROR,
  GET_STUDYPLAN_ERROR: GET_STUDYPLAN_ERROR,
  GET_COURSES_ERROR: GET_COURSES_ERROR,
  CREATE_STUDYPLAN_ERROR: CREATE_STUDYPLAN_ERROR,
  DELETE_STUDYPLAN_ERROR: DELETE_STUDYPLAN_ERROR,
  BOUND_EXCEEDED_ERROR: BOUND_EXCEEDED_ERROR,
  FILL_FIELDS_ERROR: FILL_FIELDS_ERROR,
  INVALID_MAIL_ERROR: INVALID_MAIL_ERROR,
  INVALID_CREDENTIALS_ERROR: INVALID_CREDENTIALS_ERROR,
}

const filterCourses = (toFilterCourses, studyPlan, todo = []) => {
  const [action, courseCode] = todo;

  return toFilterCourses.map((c) => {
    let structuredCourse = new Course(c.code, c.name, c.credits, c.currentStudents,
      c.maxStudents, c.propedeuticCourse, c.incompatibleCourses)

    if (studyPlan?.courses.some((sc) => sc.code === c.code))
      structuredCourse.added = true;

    if (studyPlan?.courses.some((sc) => sc.propedeuticCourse === c.code))
      structuredCourse.propedeutic = true;

    if (studyPlan?.courses.some((sc) => sc.incompatibleCourses.includes(c.code)))
      structuredCourse.incompatible = true;

    if (c.code === courseCode) {
      if (action === INCREMENT)
        structuredCourse.currentStudents += 1;
      if (action === DECREMENT)
        structuredCourse.currentStudents -= 1;
    }

    return structuredCourse;
  })
}

export { filterCourses, INCREMENT, DECREMENT, NOTHING, ERRORS, ACTION }