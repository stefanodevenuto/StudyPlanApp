const AppDAO = require("../../../db/AppDAO");

class StudyPlanDAO extends AppDAO {

  async getStudyPlanByOwner(userId) {
    const query = 'SELECT SP.id, SP.type, SP.user, SPC.course \
            FROM studyPlan SP \
            LEFT JOIN studyPlan_Course SPC ON SPC.studyPlan = SP.id \
            WHERE SP.user = ?';
    return await this.all(query, [userId]);
  }

  async createStudyPlan(userId, type, courseIds) {
    const query_delete = 'DELETE FROM studyPlan WHERE user = ?';
    const query_update_course = 'UPDATE course SET currentStudents = currentStudents + 1 WHERE code = ?';

    const query_studyPlan = 'INSERT INTO studyPlan(type, user) VALUES (?, ?)';
    const query_association = 'INSERT INTO studyPlan_course(studyPlan, course) VALUES (?, ?)';

    await this.startTransaction();

    await this.run(query_delete, [userId]);
    const { id } = await this.run(query_studyPlan, [type, userId]);

    for (let courseId of courseIds) {
      await this.run(query_association, [id, courseId]);
      await this.run(query_update_course, [courseId])
    }

    await this.commitTransaction();
    return id;
  }

  async deleteStudyPlan(userId) {
    const query_delete = 'DELETE FROM studyPlan WHERE user = ?'
    await this.run(query_delete, [userId]);
  }
}

module.exports = StudyPlanDAO;
