const CourseDAO = require('./dao')
const Course = require('./course')
const { CourseErrorFactory } = require('./error');

class CourseController {
    constructor() {
        this.dao = new CourseDAO();
    }

    // ################################ API

    async getAllCourses() {
        const rows = await this.dao.getAllCourses();
        const courses = [];

        for (let row of rows) {
            const incompatibleCourses = await this.dao.getIncompatibleCoursesByID(row.code);
            const { currentStudents } = await this.dao.getCurrentStudentdByID(row.code);

            const course = new Course(row.code, row.name, row.credits, row.maxStudents,
                row.propedeuticCourse, incompatibleCourses.map(c => c.incompatibleCourse), currentStudents);
            courses.push(course);
        }

        console.log(courses)

        return courses;
    }

    async getCourseByID(courseId) {
        const row = await this.dao.getCourseByID(courseId);
        if (row === undefined)
            throw CourseErrorFactory.newCourseNotFound();

        const incompatibleCourses = await this.dao.getIncompatibleCoursesByID(row.code);
        const { currentStudents } = await this.dao.getCurrentStudentdByID(row.code);

        const course = new Course(row.code, row.name, row.credits, row.maxStudents,
            row.propedeuticCourse, incompatibleCourses.map(c => c.incompatibleCourse), currentStudents);

        return course;
    }

    // ################################ Utils
}

module.exports = CourseController;