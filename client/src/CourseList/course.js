class Course {
  constructor(code, name, credits, currentStudents, maxStudents, 
    propedeuticCourse, incompatibleCourses, added = false, propedeutic = false, incompatible = false) {
    
    this.code = code;
    this.name = name;
    this.credits = credits;
    this.currentStudents = currentStudents; 
    this.maxStudents = maxStudents;
    this.propedeuticCourse = propedeuticCourse;
    this.incompatibleCourses = incompatibleCourses
    this.added = added;
    this.propedeutic = propedeutic;
    this.incompatible = incompatible;
  }
}

module.exports = Course;