class Course {
    constructor(code, name, credits, maxStudents, propedeuticCourse, incompatibleCourses = [], currentStudents) {
        this.code = code;
        this.name = name;
        this.credits = credits;
        this.maxStudents = maxStudents;
        this.propedeuticCourse = propedeuticCourse;
        this.incompatibleCourses = incompatibleCourses;
        this.currentStudents = currentStudents;
    }
}

module.exports = Course;