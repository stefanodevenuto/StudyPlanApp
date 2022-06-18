const AppDAO = require("../../../db/AppDAO");

class CourseDAO extends AppDAO {
  async getAllCourses() {
    const query = 'SELECT C.code, C.name, C.credits, C.maxStudents, C.propedeuticCourse \
            FROM course C';
    return await this.all(query);
  }

  async getCourseByID(courseId) {
    const query = 'SELECT C.code, C.name, C.credits, C.maxStudents, C.propedeuticCourse \
            FROM course C \
            WHERE C.code = ?';
    return await this.get(query, courseId);
  }

  async getIncompatibleCoursesByID(courseId) {
    const query = 'SELECT IC.secondCourse AS incompatibleCourse \
            FROM incompatibleCourse IC \
            LEFT JOIN course C ON C.code = IC.firstCourse \
            WHERE C.code = ?';

    return await this.all(query, [courseId]);
  }

  async getCurrentStudentdByID(courseId) {
    const query = 'SELECT COUNT(*) AS currentStudents FROM studyPlan_course WHERE course = ?'
    return await this.get(query, [courseId]);
  }
}

module.exports = CourseDAO;
