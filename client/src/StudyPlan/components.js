import { Container, Row, Col, ListGroup, Table, Button, Alert, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { EraserFill } from 'react-bootstrap-icons';
import { useEffect } from 'react';

import './style.css'
import StudyPlanClass from './studyPlan';
import { useState } from 'react';

function StudyPlan(props) {
  const [errors, setErrors] = useState([]);

  if (Object.keys(props.studyPlan).length === 0)
    return <StudyPlanNotCreated createStudyPlan={props.createStudyPlan} />

  return <StudyPlanContent
    studyPlan={props.studyPlan}
    removeCourse={props.removeCourse}
    sendRequestCreate={props.sendRequestCreate}
    sendRequestDelete={props.sendRequestDelete}
    undoCurrentChanges={props.undoCurrentChanges}
    setErrors={setErrors}
    errors={errors}
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

    console.log(props.studyPlan.currentCredits, props.studyPlan.type)
    if (!checkNumberOfCredits(props.studyPlan.currentCredits, props.studyPlan.type)) {
      errorMessages.push(`Please, add/remove some courses, because the bounds for \
        credits are not respected`);
    }

    props.studyPlan.courses.forEach((c) => {
      if (c.propedeuticCourse && !props.studyPlan.courses.some((course) => course.code === c.propedeuticCourse))
        errorMessages.push(`Please, add the course ${c.propedeuticCourse}, because is \
        propedeutic for ${c.code}`)
    })

    console.log(errorMessages)

    if (errorMessages.length !== 0) {
      props.setErrors(errorMessages);
    } else {
      props.setErrors([]);
      setLoadingSave(true);
    }
  }

  return (
    <Container className="col-6 below-nav mx-5">
      <Row>
        <Col>
          <StudyPlanInfo studyPlan={props.studyPlan} />
        </Col>
      </Row>
      <Row>
        <Col>
          <StudyPlanCourses courses={props.studyPlan.courses} removeCourse={props.removeCourse} />
        </Col>
      </Row>
      <Row>
        {
          location.pathname === "/edit" ? <>
            <Button onClick={sendRequestCreate} className='md-3 mb-1' variant='danger'>
              {loadingSave ? <Spinner animation="border" size="sm" /> : "Save" }  
            </Button>
            <Button onClick={props.undoCurrentChanges} className='md-3 undo-current-changes' variant='danger'>Cancel</Button>
          </> : undefined
        }
      </Row>
      {props.errors.length ?
        <Row>
          <ErrorsAlert close={() => props.setErrors([])} errors={props.errors}/>
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
    console.log("ciao")
    props.createStudyPlan(type);
    navigate("/edit");
  }

  return (
    <Container className="col-6 below-nav mx-5">
      <Row className='h-100'>
        <Col>
          <h1>No study plan yet...</h1>
          <h1>...start by selecting your frequency!</h1>
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
  const location = useLocation();

  return (
    <>
      <h2>Info</h2>
      <ListGroup>
        <ListGroup.Item>
          {`Type: ${printType(props.studyPlan.type)}`}
        </ListGroup.Item>
        <ListGroup.Item>
          Credits: {props.studyPlan.currentCredits}/{props.studyPlan.maxCredits}
        </ListGroup.Item>
      </ListGroup>
    </>
  );
}

function StudyPlanCourses(props) {
  const location = useLocation();

  return (
    <>
      <h2>Courses</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th># Code</th>
            <th>Name</th>
            <th>Credits</th>
            <th>Max № of Students</th>
          </tr>
        </thead>
        <tbody>
          {
            props.courses.map((course, i) =>
              <tr key={i}>
                <td>{course.code}</td>
                <td>{course.name}</td>
                <td>{course.credits}</td>
                <td>{course.maxStudents === null ? "Unlimited" : course.maxStudents}</td>
                {location.pathname === "/edit" ?
                  <td><EraserFill onClick={() => props.removeCourse(course.code)} /></td>
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