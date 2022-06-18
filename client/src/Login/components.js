import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { validate } from 'react-email-validator';
import './style.css'

function LoginForm(props) {
  const [username, setUsername] = useState('testUser1@mail.com');
  const [password, setPassword] = useState('testPassword1');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (username === '' || password === '') {
      setErrorMessage('Please fill all the fields!');
      return;
    }
 
    if (!validate(username)) {
      setErrorMessage('Please insert a valid mail');
      return;
    }

    props.login(username, password).catch((err) => {
      setErrorMessage('Invalid credentials');
    });
  };

  return (
    <Container>
      <Row className='d-flex justify-content-center'>
        <Col className='login-form col-5 align-self-center'>
          <h2>Login</h2>
          <Form className='d-flex flex-column justify-content-center'>
            {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}

            <Form.Group className='mt-2' controlId='username'>
              <Form.Label className='text-danger'>Email</Form.Label>
              <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
            </Form.Group>

            <Form.Group className='mt-2' controlId='password'>
              <Form.Label className='text-danger'>Password</Form.Label>
              <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
            </Form.Group>

            <Button variant='danger' className='mt-2' onClick={handleSubmit}>Login</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

function LogoutButton(props) {
  return (
    <Col>
      <Button variant='light' className='h-25' onClick={props.logout}>Logout</Button>
    </Col>
  )
}

export { LoginForm, LogoutButton };