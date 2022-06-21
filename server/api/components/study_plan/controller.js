const StudyPlanDAO = require('./dao')
const StudyPlan = require('./studyPlan')
const { StudyPlanErrorFactory } = require('./error');

class StudyPlanController {
  constructor(courseController) {
    this.dao = new StudyPlanDAO();
    this.courseController = courseController;
  }

  // ################################ API

  async getStudyPlanByOwner(userId) {
    const rows = await this.dao.getStudyPlanByOwner(userId);
    if (rows.length === 0)
      throw StudyPlanErrorFactory.newStudyPlanNotFound();

    const [studyPlan] = await this.buildStudyPlan(rows);
    return studyPlan;
  }

  async createUpdateStudyPlan(userId, type, courses) {
    if (!StudyPlan.isValidType(type))
      throw StudyPlanErrorFactory.newTypeNotValid();

    let total = 0;
    for (let code of courses) {
      let course = await this.courseController.getCourseByID(code);

      if (course.propedeuticCourse && !courses.some((c) => c === course.propedeuticCourse))
        throw StudyPlanErrorFactory.newNoPropedeuticCourse();

      if (course.incompatibleCourses.length && courses.some((c) => course.incompatibleCourses.includes(c)))
        throw StudyPlanErrorFactory.newIncompatibleCourses();

      total += course.credits;
    }

    if (!this.checkNumberOfCredits(total, type))
      throw StudyPlanErrorFactory.newInvalidNumberOfCredits();

    try {
      await this.dao.createStudyPlan(userId, type, courses);
    } catch(err) {
      if (err.code === "SQLITE_CONSTRAINT") {
				if (err.message.includes("UNIQUE"))
					err = StudyPlanErrorFactory.newAlreadyInsertedCourse();

        if (err.message.includes("CHECK"))
					err = StudyPlanErrorFactory.newCourseMaxStudentsReached();
			}

      throw err;
    }
  }

  async deleteStudyPlan(userId) {
    await this.dao.deleteStudyPlan(userId);
  }

  // ################################ Utils

  async buildStudyPlan(rows) {
    console.log(this.courseController)
    let studyPlans = [];
    if (rows.length > 0) {
      // Setup last as the first restockOrder
      let lastStudyPlan = rows[0];

      let courses = [];
      for (let row of rows) {
        // If it's the same restockOrder, continue adding the related Skus
        if (row.id == lastStudyPlan.id) {
          if (row.course !== null) {
            let course = await this.courseController.getCourseByID(row.course);
            courses.push(course);
          }
        } else {
          // Otherwise, create the current studyPlan and clear the courses array
          const studyPlan = new StudyPlan(lastStudyPlan.id, lastStudyPlan.type, lastStudyPlan.user, courses);
          studyPlans.push(studyPlan);

          // Reset
          lastStudyPlan = row;
          courses = [];

          // Don't lose the current course!
          if (row.course !== null) {
            let course = await this.courseController.getCourseByID(row.course);
            courses.push(course);
          }
        }
      }

      // Create the last studyPlan
      const studyPlan = new StudyPlan(lastStudyPlan.id, lastStudyPlan.type, lastStudyPlan.user, courses);
      studyPlans.push(studyPlan);
    }

    return studyPlans;
  }

  checkNumberOfCredits(total, type) {
    if (type === StudyPlan.FULLTIME && (total > 80 || total < 60))
      return false;

    if (type === StudyPlan.PARTIME && (total > 40 || total < 20))
      return false;

    return true;
  }
}

module.exports = StudyPlanController;