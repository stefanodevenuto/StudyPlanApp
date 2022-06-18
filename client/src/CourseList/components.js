import { useState } from 'react';
import { Table, Button, Accordion } from 'react-bootstrap';
import { Container, Row, Col, OverlayTrigger, Popover } from 'react-bootstrap';
import { CheckCircle, PlusCircleFill, InfoCircle, SlashCircle } from "react-bootstrap-icons";
import { useLocation } from 'react-router-dom';

import './style.css'

function CourseList(props) {

  return (
    <aside className="col-5 below-nav" id="left-sidebar">
      <Accordion defaultActiveKey={['0']} alwaysOpen>
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
                <Col className='col-1'>
                  {!props.course.added && props.course.propedeutic ?
                    <CustomPopover eventKey={props.eventKey}
                      header="Propedeutic Course"
                      text="Be sure to insert this course if you want to keep "
                      courses={[props.course.code]}>
                      <InfoCircle className='propedeutic' height={24} width={24} />
                    </CustomPopover> : undefined}
                </Col>
                <Col className='col-1'>
                  {!props.course.added && (props.course.maxStudents && props.course.maxStudents <= props.course.currentStudents) ?
                    <CustomPopover eventKey={props.eventKey}
                      header="Maximum Students cap reached"
                      text="Sorry, you can't select this course because is full"
                      courses={props.course.incompatibleCourses}>
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
              <Col><label className='text-danger'>{props.course.name}</label></Col>
          }
        </Row>
      </Container>
    </>
  );
}

function CourseDescription(props) {
  return (
    <Container className='px-0'>
      <Row>
        <Col><label className='bold'>Code:</label></Col>
        <Col><span>{props.course.code}</span></Col>
      </Row>
      <Row>
        <Col><label className='bold'>Credits:</label></Col>
        <Col><span>{props.course.credits}</span></Col>
      </Row>
      <Row>
        <Col><label className='bold'>№ of Students:</label></Col>
        <Col><span>{props.course.currentStudents} / {props.course.maxStudents === null ? "Unlimited" : props.course.maxStudents}</span></Col>
      </Row>
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
            }) : <Col><span>{"Not set!"}</span></Col>
          }
        </Col>
      </Row>
    </Container>
  );
}

export { CourseList, CourseDescription };