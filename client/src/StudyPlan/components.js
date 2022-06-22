import { Container, Row, Col, ListGroup, Table, Button, Alert, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { EraserFill } from 'react-bootstrap-icons';
import { useEffect, useRef, useContext } from 'react';

import './style.css'
import StudyPlanClass from './studyPlan';
import { useState } from 'react';

import { ACTION, ERRORS } from '../util';

import User from "../context";

function StudyPlan(props) {
  const oldStudyPlanCourses = useRef(props.studyPlan ? props.studyPlan.courses : []);
  const oldCourses = useRef(props.courses);

  const [errors, setErrors] = useState([]);
  const location = useLocation();
  
  const createStudyPlan = (type) => {
    const newStudyPlan = new StudyPlanClass(type);
    props.setStudyPlan(newStudyPlan);
  }

  function removeCourseFromStudyPlan(code) {
    props.setStudyPlan(sp => new StudyPlanClass(sp.type, sp.courses.filter(c => c.code !== code)))
    props.setRefreshCourses([ACTION.DECREMENT, code]);
  }

  function undoCurrentChangesStudyPlan(oldStudyPlanCourses, oldCourses) {
    props.setStudyPlan(sp => {
      return new StudyPlanClass(sp.type, oldStudyPlanCourses)
    });

    props.setCourses(oldCourses);
    props.setRefreshCourses([ACTION.NOTHING]);
  }

  if (!props.studyPlan && location.pathname !== "/edit")
    return <StudyPlanNotCreated createStudyPlan={createStudyPlan} />

  return <StudyPlanContent
    studyPlan={props.studyPlan}
    removeCourse={removeCourseFromStudyPlan}
    sendRequestCreate={props.sendRequestCreateStudyPlan}
    undoCurrentChanges={undoCurrentChangesStudyPlan}
    setErrors={setErrors}
    errors={errors}
    oldStudyPlanCourses={oldStudyPlanCourses}
    oldCourses={oldCourses}
  />
}

function ErrorsAlert(props) {
  return (
    <Alert className='mt-3' variant='danger' onClose={props.close} dismissible>
      Please, resolve the conflicts before submitting:
      <ul className='pt-2'>
        {props.errors.map((e, i) => <li key={i}>{e}</li>)}
      </ul>
    </Alert>
  );
}

function StudyPlanContent(props) {
  const [loadingSave, setLoadingSave] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function sendRequestCreate() {
      if (loadingSave) {
        await props.sendRequestCreate();
        setLoadingSave(false);
        navigate("/");
      }
    }

    sendRequestCreate();
  }, [loadingSave])

  const checkNumberOfCredits = (total, type) => {
    if (type === StudyPlanClass.FULLTIME && (total > 80 || total < 60))
      return false;

    if (type === StudyPlanClass.PARTIME && (total > 40 || total < 20))
      return false;

    return true;
  }

  const sendRequestCreate = () => {
    let errorMessages = [];
    props.setErrors([]);

    if (!checkNumberOfCredits(props.studyPlan.currentCredits, props.studyPlan.type)) {
      errorMessages.push(ERRORS.BOUND_EXCEEDED_ERROR);
    }

    props.studyPlan.courses.forEach((c) => {
      if (c.propedeuticCourse && !props.studyPlan.courses.some((course) => course.code === c.propedeuticCourse))
        errorMessages.push(`Please, add the course ${c.propedeuticCourse}, because is \
        propedeutic for ${c.code}`)
    })

    if (errorMessages.length !== 0) {
      props.setErrors(errorMessages);
    } else {
      props.setErrors([]);
      setLoadingSave(true);
    }
  }

  return (
    <Container className="col-4 mx-5">
      <Row>
        <Col>
          <StudyPlanInfo studyPlan={props.studyPlan} />
        </Col>
      </Row>
      <Row>
        <Col>
          <StudyPlanCourses courses={props.studyPlan?.courses} removeCourse={props.removeCourse} />
        </Col>
      </Row>
      <Row>
        {
          location.pathname === "/edit" ? <>
            <Button onClick={sendRequestCreate} className='md-3 mb-1' variant='danger'>
              {loadingSave ? <Spinner animation="border" size="sm" /> : "Save"}
            </Button>
            <Button onClick={() => props.undoCurrentChanges(props.oldStudyPlanCourses.current, props.oldCourses.current)} className='md-3 undo-current-changes' variant='danger'>Reset</Button>
          </> : undefined
        }
      </Row>
      {props.errors.length ?
        <Row>
          <ErrorsAlert close={() => props.setErrors([])} errors={props.errors} />
        </Row> : false}
    </Container>
  );
}

function StudyPlanCoverCard(props) {
  return (
    <div className="studyplan-card d-flex flex-row-reverse" onClick={props.createStudyPlan}>
      <div className='description p-2'>
        <label>{props.name}</label>
      </div>
    </div>
  );
}

function StudyPlanNotCreated(props) {
  const navigate = useNavigate();

  const createStudyPlan = (type) => {
    props.createStudyPlan(type);
    navigate("/edit");
  }

  const { name } = useContext(User);

  return (
    <Container className="col-4 mx-5">
      <Row className='h-100'>
        <Col>
          <h1><span className='red-color'>{name}</span>, select the frequency of the new plan!</h1>
          <Row className='height-20 my-3'>
            <StudyPlanCoverCard name="Part Time" createStudyPlan={() => createStudyPlan(StudyPlanClass.PARTIME)} />
          </Row>
          <Row className='height-20 my-3'>
            <StudyPlanCoverCard name="Full time" createStudyPlan={() => createStudyPlan(StudyPlanClass.FULLTIME)} />
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

const printType = (type) => {
  if (type === StudyPlanClass.PARTIME)
    return "Partime";

  if (type === StudyPlanClass.FULLTIME)
    return "Fulltime";
}

function StudyPlanInfo(props) {
  const { name } = useContext(User);

  return (
    <>
      <h2>Study Plan of <span className='red-color'>{name}</span></h2>
      <ListGroup>
        <ListGroup.Item>
          <span className='bold'>Type:</span> {printType(props.studyPlan.type)}
        </ListGroup.Item>
        <ListGroup.Item>
          <span className='bold'>Min credits:</span> {props.studyPlan.minCredits}
        </ListGroup.Item>
        <ListGroup.Item>
          <span className='bold'>Max credits:</span> {props.studyPlan.maxCredits}
        </ListGroup.Item>
        <ListGroup.Item>
          <span className='bold'>Credits:</span> {props.studyPlan.currentCredits}/{props.studyPlan.maxCredits}
        </ListGroup.Item>
      </ListGroup>
    </>
  );
}

function StudyPlanCourses(props) {
  const location = useLocation();

  return (
    <>
      <h2 className='mt-4'>Courses</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th className='bold'># Code</th>
            <th className='bold'>Name</th>
            <th className='bold'>Credits</th>
            <th className='bold'>Max № of Students</th>
          </tr>
        </thead>
        <tbody>
          {
            props.courses?.map((course, i) =>
              <tr key={i}>
                <td>{course.code}</td>
                <td>{course.name}</td>
                <td>{course.credits}</td>
                <td>{course.maxStudents === null ? "Unlimited" : course.maxStudents}</td>
                {location.pathname === "/edit" ?
                  <td className='remove-course' onClick={() => props.removeCourse(course.code)}>
                    <EraserFill />
                  </td>
                  : undefined}
              </tr>
            )
          }
        </tbody>
      </Table>
    </>
  );
}

export default StudyPlan;