import { Alert, Container, Row, Spinner } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import CustomNavbar from '../Navbar/components';
import { LoginForm } from '../Login/components';
import { CourseList } from '../CourseList/components';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'

import API from './API';
import User from '../context';
import StudyPlan from '../StudyPlan/components';
import StudyPlanClass from '../StudyPlan/studyPlan';
import { filterCourses, ACTION, ERRORS } from '../util';

function Homepage() {

  // ------------------------------------------------------ Hooks

  const [courses, setCourses] = useState([]);
  const [studyPlan, setStudyPlan] = useState(null);

  const [dirtyCourses, setDirtyCourses] = useState(true);
  const [dirtyStudyPlan, setDirtyStudyPlan] = useState(true);
  
  const [refreshCourses, setRefreshCourses] = useState([]);

  const [user, setUser] = useState({});
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ------------------------------------------------------ Login

  const handleError = (err, message) => {
    setError("Internal Server Error: " + message)
  }

  useEffect(() => {
    const checkAuth = async () => {
      setError("");
      try {
        const user = await API.getUserInfo();
        setUser({ ...user, loggedIn: true });
      } catch (err) {
        if (err.status !== 401)
          handleError(err, ERRORS.LOGIN_ERROR);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    async function getCoursesAndStudyPlan() {
      if (user.loggedIn)
        setDirtyStudyPlan(true);
    }

    getCoursesAndStudyPlan();
  }, [user.loggedIn])

  const login = async (email, password) => {
    try {
      setError("");

      const user = await API.login(email, password);
      setUser({ ...user, loggedIn: true });
      navigate('/');
    } catch (err) {
      if (err.status === 401)
        throw err;
      else
        handleError(err, ERRORS.LOGIN_ERROR)
    }

  }

  const logout = async () => {
    try {
      setError("");

      await API.logout();
      setUser({});
      setCourses([]);
      setStudyPlan(null);
      setDirtyCourses(true);
      setDirtyStudyPlan(true);
    } catch (err) {
      handleError(err, ERRORS.LOGOUT_ERROR)
    }
  }

  // ------------------------------------------------------ Update Content

  useEffect(() => {
    if (dirtyStudyPlan) {
      setError("");
      API.getStudyPlan()
        .then((sp) => {
          const adjustedStudyPlan = new StudyPlanClass(sp.type, sp.courses)
          setStudyPlan(adjustedStudyPlan);
          setDirtyStudyPlan(false);
          setDirtyCourses(true);
        })
        .catch(err => {
          if (err.status === 404 || err.status === 401) {
            setStudyPlan(null);
            setDirtyStudyPlan(false);
            setDirtyCourses(true);
          } else {
            handleError(err, ERRORS.GET_STUDYPLAN_ERROR)
          }
        })
    }
  }, [dirtyStudyPlan])

  useEffect(() => {
    async function updateCourseList() {
      if (dirtyCourses) {
        setError("");
        try {
          const coursesAPI = await API.getAllCourses();
          let newCourses = filterCourses(coursesAPI, studyPlan);

          setCourses(newCourses);
          setDirtyCourses(false);
        } catch (err) {
          handleError(err, ERRORS.GET_STUDYPLAN_ERROR)
        }
      }
    }
    updateCourseList();
  }, [dirtyCourses])

  useEffect(() => {
    async function updateCourseList() {
      if (refreshCourses.length) {
        let newCourses = filterCourses(courses, studyPlan, refreshCourses);

        setCourses(newCourses);
        setRefreshCourses([]);
      }
    }
    updateCourseList();
  }, [refreshCourses.length])

  // ------------------------------------------------------ Study Plan

  async function sendRequestCreateStudyPlan() {
    setError("");
    try {
      await API.createUpdateStudyPlan(studyPlan.type, studyPlan.courses.map((c) => c.code))
      setDirtyCourses(true);
    } catch (err) {
      handleError(err, ERRORS.CREATE_STUDYPLAN_ERROR)
    }
  }

  async function sendRequestDeleteStudyPlan() {
    setError("");
    try {
      await API.deleteStudyPlan();
      setDirtyStudyPlan(true);
    } catch (err) {
      handleError(err, ERRORS.DELETE_STUDYPLAN_ERROR)
    }
  }

  const addCourseToStudyPlan = (course) => {
    setStudyPlan(sp => {
      return new StudyPlanClass(sp.type, [...sp.courses, course])
    });
    setRefreshCourses([ACTION.INCREMENT, course.code]);
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
          setDirtyStudyPlan={setDirtyStudyPlan}
          sendRequestDeleteStudyPlan={sendRequestDeleteStudyPlan}
        />
        <Container fluid>
          <Row className="vheight-100">

            { /* Main content */}
            <main className="below-nav">
              {error ? <Alert variant='danger' onClose={() => setError("")} dismissible>{error}</Alert> : false}
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
                          courses={courses}
                          studyPlan={studyPlan}
                          setCourses={setCourses}
                          setStudyPlan={setStudyPlan}
                          sendRequestCreateStudyPlan={sendRequestCreateStudyPlan}
                          setRefreshCourses={setRefreshCourses}
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
                          courses={courses}
                          studyPlan={studyPlan}
                          setCourses={setCourses}
                          setStudyPlan={setStudyPlan}
                          sendRequestCreateStudyPlan={sendRequestCreateStudyPlan}
                          setRefreshCourses={setRefreshCourses}
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

export default Homepage;
