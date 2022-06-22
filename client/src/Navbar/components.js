import { Navbar, Nav, Spinner, Button, Col } from "react-bootstrap";
import { HouseFill } from "react-bootstrap-icons";
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';

import './style.css';

import User from "../context";

function CustomNavbar(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { loggedIn } = useContext(User);

  const [loadingLogout, setLoadingLogout] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    async function sendRequestDeleteStudyPlan() {
      if (loadingDelete) {
        await props.sendRequestDeleteStudyPlan();
        setLoadingDelete(false);
      }
    }

    sendRequestDeleteStudyPlan();
  }, [loadingDelete])

  useEffect(() => {
    async function logout() {
      if (loadingLogout) {
        await props.logout();
        setLoadingLogout(false);
      }
    }

    logout();
  }, [loadingLogout])

  return (
    <Navbar bg="danger" expand="md" variant="dark" fixed="top" className="navbar-padding d-flex" >

      {/* <!-- Toggle the left sidebar --> */}
      <Navbar.Toggle aria-controls="left-sidebar" bs-target="#left-sidebar" aria-expanded="false" aria-label="Toggle sidebar" />

      {/* <!-- Logo and title --> */}
      <Navbar.Brand className="cursor-pointer" onClick={() => navigate("/")}>
        <HouseFill color="white" height={16} width={16} />
        <label>PoliTO Courses</label>
      </Navbar.Brand>

      <Navbar.Collapse className="flex-row-reverse">
        {/* <!-- Link to the user profile --> */}
        {loggedIn ? (
          <>
            <Nav.Item>
              <Nav.Link>
                <Col>
                  <Button variant='light' className='h-25' onClick={() => setLoadingLogout(true)}>Logout
                    {loadingLogout ? <Spinner animation="border" size="sm" /> : false}
                  </Button>
                </Col>
              </Nav.Link>
            </Nav.Item>
            {
              location.pathname !== "/edit" && props.studyPlan ?
                <>
                  <Nav.Item>
                    <Nav.Link>
                      <Button variant='light' onClick={() => setLoadingDelete(true)}> Delete Study Plan
                        {loadingDelete ? <Spinner animation="border" size="sm" /> : false}
                      </Button>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link>
                      <Button variant='light' onClick={() => { navigate(`/edit`) }}>Modify Study Plan</Button>
                    </Nav.Link>
                  </Nav.Item>
                </>
                : undefined
            }
            <Nav.Item>
              <Nav.Link>
                <Col>
                  <Button variant='light' onClick={() => { navigate(`/`) }}>Home</Button>
                </Col>
              </Nav.Link>
            </Nav.Item>
          </>
        ) :
          <Nav.Item>
            <Nav.Link>
              <Button variant='light' onClick={() => navigate(`/login`)}>Login
              </Button>
            </Nav.Link>
          </Nav.Item>
        }
      </Navbar.Collapse>
    </Navbar>
  );
}

export default CustomNavbar;