class StudyPlan {
  static PARTIME = "PARTIME";
  static FULLTIME = "FULLTIME";

  static TYPES = [this.PARTIME, this.FULLTIME];

  constructor(id, type, owner, courses) {
    this.id = id;
    this.type = type;
    this.owner = owner;
    this.courses = courses;
  }

  static isValidType(type) {
    return this.TYPES.some((t) => t === type);
  }
}

module.exports = StudyPlan;