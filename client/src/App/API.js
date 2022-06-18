const APIURL = new URL('http://localhost:3001/api/');

const COURSE = "course";
const STUDY_PLAN = "studyPlan";
const USER = "user";

async function getAllCourses() {
  const response = await fetch(new URL(COURSE, APIURL), { credentials: 'include' });
  const coursesJson = await response.json();
  if (response.ok) {
    return coursesJson.map((course) => ({
      code: course.code,
      name: course.name,
      credits: course.credits,
      currentStudents: course.currentStudents, 
      maxStudents: course.maxStudents,
      propedeuticCourse: course.propedeuticCourse,
      incompatibleCourses: course.incompatibleCourses
    }));
  } else {
    throw coursesJson;
  }
}

async function getStudyPlan() {
  const response = await fetch(new URL(STUDY_PLAN, APIURL), { credentials: 'include' });
  const studyPlanJson = await response.json();
  if (response.ok) {
    return studyPlanJson;
  } else {
    throw studyPlanJson;
  }
}

async function getUserInfo() {
  const response = await fetch(new URL(`${USER}/current`, APIURL), { credentials: 'include' });
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server
  }
}

async function createUpdateStudyPlan(type, courses) {
  let response = await fetch(new URL(`${STUDY_PLAN}/`, APIURL), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: type, courses: courses }),
  });
  if (!response.ok) {
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

async function deleteStudyPlan() {
  await fetch(new URL(`${STUDY_PLAN}/`, APIURL), {
    method: 'DELETE',
    credentials: 'include'
  });
}

async function login(email, password) {
  console.log(email, password)
  let response = await fetch(new URL(`${USER}/login`, APIURL), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: email, password: password }),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

async function logout() {
  await fetch(new URL(`${USER}/logout`, APIURL), {
    method: 'DELETE',
    credentials: 'include'
  });
}

const API = { getAllCourses, getStudyPlan, getUserInfo, createUpdateStudyPlan, login, logout, deleteStudyPlan };
export default API;