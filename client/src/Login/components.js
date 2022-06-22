import { Form, Button, Alert, Container, Row, Col, Spinner } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { validate } from 'react-email-validator';
import './style.css'

import { ERRORS } from '../util';

function LoginForm(props) {
  const [username, setUsername] = useState('testUser1@mail.com');
  const [password, setPassword] = useState('password');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (username === '' || password === '') {
      setErrorMessage(ERRORS.FILL_FIELDS_ERROR);
      return;
    }

    if (!validate(username)) {
      setErrorMessage(ERRORS.INVALID_MAIL_ERROR);
      return;
    }

    setLoadingLogin(true);
  };

  useEffect(() => {
    async function handleLogin() {
      if (loadingLogin) {
        try {
          await props.login(username, password);
          setLoadingLogin(false);
        } catch(err) {
          setErrorMessage(ERRORS.INVALID_CREDENTIALS_ERROR);
          setLoadingLogin(false);
        }
      }
    }

    handleLogin();
  }, [loadingLogin])

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

            <Button variant='danger' type="submit" className='mt-2' onClick={handleSubmit}>
              {loadingLogin ? <Spinner animation="border" size="sm" /> : "Login"}
            </Button>
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