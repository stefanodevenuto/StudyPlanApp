class StudyPlanClass {
  static PARTIME = "PARTIME";
  static FULLTIME = "FULLTIME";

  static TYPES = [this.PARTIME, this.FULLTIME];

  constructor(type, courses = []) {
    this.type = type;
    this.courses = courses;
    this.maxCredits = this.type === "PARTIME" ? 40 : 80;
    this.minCredits = this.type === "PARTIME" ? 20 : 60;
    this.currentCredits = this.courses.reduce((acc, course) => acc + course.credits, 0);
  }
}

module.exports = StudyPlanClass;