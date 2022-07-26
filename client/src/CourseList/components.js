import { useContext } from 'react';
import { Accordion } from 'react-bootstrap';
import { Container, Row, Col, OverlayTrigger, Popover } from 'react-bootstrap';
import { CheckCircle, PlusCircleFill, InfoCircle, SlashCircle } from "react-bootstrap-icons";
import { useLocation } from 'react-router-dom';

import './style.css'
import User from "../context";

function CourseList(props) {
  const { loggedIn } = useContext(User);

  return (
    <aside className={loggedIn ? "col-7" : "col-12"} id="left-sidebar">
      <Accordion defaultActiveKey={['0']} alwaysOpen>
        <CourseListHeader />
        {
          props.courses.map((course, i) =>
            <CourseItem
              key={i}
              eventKey={i}
              course={course}
              addCourse={props.addCourse}
            />
          )
        }
      </Accordion>
    </aside>
  );
}

function CourseListHeader() {
  const location = useLocation();

  return (
    <Accordion.Item>
      <Accordion.Header id='courselist-header'>
        <Container>
          <Row>
            {
              location.pathname === "/edit" ?
                <>
                  <Col className='col-1'></Col>
                  <Col><label>Course</label></Col>
                  <Col><span>Code</span></Col>
                  <Col><span>Credits</span></Col>
                  <Col><span>Students number</span></Col>
                  <Col className='col-1'></Col>
                  <Col className='col-1'></Col>
                </>
                :
                <>
                  <Col><label>Course</label></Col>
                  <Col><span>Code</span></Col>
                  <Col><span>Credits</span></Col>
                  <Col><span>Students number</span></Col>
                </>
            }
          </Row>
        </Container>
      </Accordion.Header>
    </Accordion.Item>
  );
}

function CourseItem(props) {
  return (
    <Accordion.Item eventKey={props.eventKey}>
      <Accordion.Header>
        <CourseHeader course={props.course} addCourse={props.addCourse} eventKey={props.eventKey} />
      </Accordion.Header>
      <Accordion.Body>
        <CourseDescription course={props.course} />
      </Accordion.Body>
    </Accordion.Item>
  );
}

function CustomPopover(props) {
  return (
    <OverlayTrigger
      trigger={["hover", "focus"]}
      key={props.eventKey}
      placement="right"
      overlay={
        <Popover>
          <Popover.Header as="h3">{props.header}</Popover.Header>
          <Popover.Body>
            {props.text + props.courses?.map((c) => c)}
          </Popover.Body>
        </Popover>
      }
    >
      {props.children}
    </OverlayTrigger>
  );
}

function CourseHeader(props) {
  const location = useLocation();

  const addCourse = (event) => {
    event.preventDefault();
    event.stopPropagation();

    props.addCourse(props.course);
  };

  return (
    <>
      <Container>
        <Row>
          {
            location.pathname === "/edit" ?
              <>
                <Col className='col-1'>
                  {props.course.added ? <CheckCircle className='added' height={24} width={24} /> : undefined}
                  {!props.course.added && !props.course.incompatible &&
                    (!props.course.maxStudents || props.course.maxStudents > props.course.currentStudents) ? <PlusCircleFill height={24} width={24} onClick={(event) => addCourse(event)} /> : undefined}
                </Col>
                <Col>
                  <label className='text-danger'>{props.course.name}</label>
                </Col>
                <Col><span>{props.course.code}</span></Col>
                <Col><span>{props.course.credits} CFU</span></Col>
                <Col><span>{props.course.currentStudents} / {props.course.maxStudents === null ? "unlimited" : props.course.maxStudents}</span></Col>
                <Col className='col-1'>
                  {!props.course.added && props.course.propedeutic ?
                    <CustomPopover eventKey={props.eventKey}
                      header="Propedeutic Course"
                      text="Be sure to insert this course if you want to keep the already inserted!"
                      courses={[]}>
                      <InfoCircle className='propedeutic' height={24} width={24} />
                    </CustomPopover> : undefined}
                </Col>
                <Col className='col-1'>
                  {!props.course.added && (props.course.maxStudents && props.course.maxStudents <= props.course.currentStudents) ?
                    <CustomPopover eventKey={props.eventKey}
                      header="Maximum Students cap reached"
                      text="Sorry, you can't select this course because is full"
                      courses={[]}>
                      <SlashCircle className='incompatible' height={24} width={24} />
                    </CustomPopover> : undefined}

                  {!props.course.added && props.course.incompatible ?
                    <CustomPopover eventKey={props.eventKey}
                      header="Incompatible Course"
                      text="If you really want to add this course, please remove the incompatible ones: "
                      courses={props.course.incompatibleCourses}>
                      <SlashCircle className='incompatible' height={24} width={24} />
                    </CustomPopover> : undefined}
                </Col>
              </>

              :
              <>
                <Col><label className='text-danger'>{props.course.name}</label></Col>
                <Col><span>{props.course.code}</span></Col>
                <Col><span>{props.course.credits} CFU</span></Col>
                <Col><span>{props.course.currentStudents} / {props.course.maxStudents === null ? "unlimited" : props.course.maxStudents}</span></Col>
              </>
          }
        </Row>
      </Container>
    </>
  );
}

function CourseDescription(props) {
  return (
    <Container>
      <Row>
        <Col><label className='bold'>Propedeutic Course:</label></Col>
        <Col><span>{props.course.propedeuticCourse === null ? "None" : props.course.propedeuticCourse}</span></Col>
      </Row>
      <Row>
        <Col><label className='bold'>Incompatible Courses:</label></Col>
        <Col>
          {props.course.incompatibleCourses.length !== 0 ?
            props.course.incompatibleCourses.map((c, i) => {
              return <Row key={i}><Col><span>{c}</span></Col></Row>;
            }) : <Col><span>{"None"}</span></Col>
          }
        </Col>
      </Row>
    </Container>
  );
}

export { CourseList, CourseDescription };