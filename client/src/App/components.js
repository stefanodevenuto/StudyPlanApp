import { Alert, Container, Row, Spinner } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import CustomNavbar from '../Navbar/Navbar';
import { LoginForm } from '../Login/components';
import { CourseList } from '../CourseList/components';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'

import API from './API';
import User from '../context';
import StudyPlan from '../StudyPlan/components';
import StudyPlanClass from '../StudyPlan/studyPlan';
import Course from '../CourseList/course';

const INCREMENT = 1;
const DECREMENT = 2;

function App() {

  // ------------------------------------------------------ Hooks

  const [courses, setCourses] = useState([]);
  const [studyPlan, setStudyPlan] = useState({});

  const [dirtyCourses, setDirtyCourses] = useState(true);
  const [dirtyStudyPlan, setDirtyStudyPlan] = useState(true);
  const [refreshCourses, setRefreshCourses] = useState([]);

  const [user, setUser] = useState({});
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ------------------------------------------------------ Login

  const handleError = (err, message) => {
    setError(message)
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setUser({ ...user, loggedIn: true });
      } catch (err) {
        if (err.status !== 401)
          handleError(err, "Cannot perform login");
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    async function getCoursesAndStudyPlan() {
      if (user.loggedIn) {
        setDirtyStudyPlan(true);
        //setDirtyCourses(true);
      }
    }

    getCoursesAndStudyPlan();
  }, [user.loggedIn])

  const login = async (email, password) => {
    const user = await API.login(email, password);
    setUser({ ...user, loggedIn: true });
    navigate('/');
  }

  const logout = async () => {
    try {
      await API.logout();
      setUser({});
      setCourses([]);
      setStudyPlan({});
      setDirtyCourses(true);
      setDirtyStudyPlan(true);
    } catch (err) {
      handleError(err, "Can't perform logout")
    }
  }

  // ------------------------------------------------------ Course

  useEffect(() => {
    if (dirtyStudyPlan) {
      API.getStudyPlan()
        .then((sp) => {
          const adjustedStudyPlan = new StudyPlanClass(sp.id,
            sp.type, sp.owner, sp.courses)

          setStudyPlan(adjustedStudyPlan);
          setDirtyStudyPlan(false);
          setDirtyCourses(true);
        })
        .catch(err => {
          console.log(err);
          if (err.status === 404 || err.status === 401) {
            setStudyPlan({});
            setDirtyStudyPlan(false);
            setDirtyCourses(true);
          } else {
            handleError(err, "Cannot recover the current Study Plan")
          }
        })
    }
  }, [dirtyStudyPlan])

  const filterCourses = (toFilterCourses, todo = []) => {
    const [action, courseCode] = todo;

    return toFilterCourses.map((c) => {
      let structuredCourse = new Course(c.code, c.name, c.credits, c.currentStudents,
        c.maxStudents, c.propedeuticCourse, c.incompatibleCourses)

      if (studyPlan?.courses?.some((sc) => sc.code === c.code))
        structuredCourse.added = true;

      if (studyPlan?.courses?.some((sc) => sc.propedeuticCourse === c.code))
        structuredCourse.propedeutic = true;

      if (studyPlan?.courses?.some((sc) => sc.incompatibleCourses.includes(c.code)))
        structuredCourse.incompatible = true;

      if (c.code === courseCode) {
        if (action === INCREMENT)
          structuredCourse.currentStudents += 1;
        if (action === DECREMENT)
          structuredCourse.currentStudents -= 1;
      }

      return structuredCourse;
    })
  }

  useEffect(() => {
    async function updateCourseList() {
      if (dirtyCourses) {
        try {
          const coursesAPI = await API.getAllCourses();
          let newCourses = filterCourses(coursesAPI);

          setCourses(newCourses);
          setDirtyCourses(false);
        } catch (err) {
          handleError(err, "Cannot recover the courses list")
        }
      }
    }
    updateCourseList();
  }, [dirtyCourses])

  useEffect(() => {
    async function updateCourseList() {
      if (refreshCourses.length) {
        let newCourses = filterCourses(courses, refreshCourses);

        setCourses(newCourses);
        setRefreshCourses([]);
      }
    }
    updateCourseList();
  }, [refreshCourses.length])

  // ------------------------------------------------------ Study Plan

  const createStudyPlan = (type) => {
    const newStudyPlan = new StudyPlanClass(undefined, type);
    setStudyPlan(newStudyPlan);
  }

  const addCourseToStudyPlan = (course) => {
    setStudyPlan(sp => {
      return new StudyPlanClass(sp.id, sp.type, sp.owner, [...sp.courses, course])
    });
    setRefreshCourses([INCREMENT, course.code]);
  }

  function removeCourseFromStudyPlan(code) {
    setStudyPlan(sp => new StudyPlanClass(sp.id, sp.type, sp.owner,
      sp.courses.filter(c => c.code !== code)))
    setRefreshCourses([DECREMENT, code]);
  }

  async function sendRequestCreateStudyPlan() {
    try {
      await API.createUpdateStudyPlan(studyPlan.type, studyPlan.courses.map((c) => c.code))
      setDirtyCourses(true);
    } catch (err) {
      handleError(err, "Cannot create/update the Study Plan")
    }
  }

  function undoCurrentChangesStudyPlan() {
    setDirtyStudyPlan(true);
  }

  async function sendRequestDeleteStudyPlan() {
    try {
      await API.deleteStudyPlan();
      setDirtyStudyPlan(true);
    } catch (err) {
      handleError(err, "Cannot delete the Study Plan")
    }
  }

  // ------------------------------------------------------ Routes

  function LoadingSpinner() {
    return (
      <div className='loading d-flex justify-content-center align-items-center'>
        <Spinner size="md" animation="border" />
      </div>
    );
  }

  return (
    <>
      <User.Provider value={user}>
        <CustomNavbar
          logout={logout}
          studyPlan={studyPlan}
          sendRequestDeleteStudyPlan={sendRequestDeleteStudyPlan}
          setRefreshCourses={setRefreshCourses}
        />
        <Container fluid>
          <Row className="vheight-100">

            { /* Main content */}
            <main className="below-nav">
              {error ? <Alert className='below-nav-2' variant='danger' onClose={() => setError("")} dismissible>{error}</Alert> : false}
              <Routes>

                <Route path="/" element={
                  dirtyCourses ?
                    <LoadingSpinner /> :
                    <Row>
                      <CourseList
                        courses={courses}
                        addCourse={addCourseToStudyPlan}
                      />
                      {user.loggedIn && !dirtyStudyPlan ?
                        <StudyPlan
                          studyPlan={studyPlan}
                          createStudyPlan={createStudyPlan}
                          removeCourse={removeCourseFromStudyPlan}
                          undoCurrentChanges={undoCurrentChangesStudyPlan}
                          sendRequestCreate={sendRequestCreateStudyPlan}
                        />
                        : undefined}
                    </Row>
                } />

                <Route path='/edit' element={
                  user.loggedIn ? (
                    dirtyCourses || dirtyStudyPlan ?
                      <LoadingSpinner /> :
                      <Row>
                        <CourseList
                          courses={courses}
                          addCourse={addCourseToStudyPlan}
                        />
                        <StudyPlan
                          studyPlan={studyPlan}
                          createStudyPlan={createStudyPlan}
                          removeCourse={removeCourseFromStudyPlan}
                          undoCurrentChanges={undoCurrentChangesStudyPlan}
                          sendRequestCreate={sendRequestCreateStudyPlan}
                        />
                      </Row>
                  ) : <Navigate to='/' />
                } />

                <Route path='/login' element={<LoginForm login={login} logout={logout} />} />
                <Route path='*' element={<Navigate to="/" />} />
              </Routes>
            </main>
          </Row>
        </Container>
      </User.Provider>
    </>
  );
}

export default App;
