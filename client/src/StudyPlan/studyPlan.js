class StudyPlanClass {
  static PARTIME = "PARTIME";
  static FULLTIME = "FULLTIME";

  static TYPES = [this.PARTIME, this.FULLTIME];

  constructor(id = undefined, type = undefined, owner = undefined, courses = []) {
    this.id = id;
    this.type = type;
    this.owner = owner;
    this.courses = courses;
    this.maxCredits = this.type === "PARTIME" ? 40 : 80;
    this.currentCredits = this.courses.reduce((acc, course) => acc + course.credits, 0)
  }
}

module.exports = StudyPlanClass;