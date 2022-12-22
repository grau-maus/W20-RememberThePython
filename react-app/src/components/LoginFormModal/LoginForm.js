import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import "./LoginForm.css";
import { Button, Form } from "react-bootstrap";

const LoginForm = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const close = document.querySelector("#modal-background");

  const retryLogin = (credential, password) => {
    setIsLoggingIn(true);

    let retries = 0;
    const loginInterval = setInterval(async () => {
      if (retries < 5) {
        const data = await dispatch(
          sessionActions.login({ credential, password })
        );

        if (data && data.errors) {
          setErrors(["Invalid Credentials"]);
          setIsLoggingIn(false);
          clearInterval(loginInterval);
        } else if (data && data.status === 200) {
          clearInterval(loginInterval);
          history.go(0);
          close.click();
          return;
        }

        retries += 1;
      } else {
        setIsLoggingIn(false);
        clearInterval(loginInterval);
      }
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    retryLogin(credential, password);
  };

  const handleDemoLogIn = async () => {
    retryLogin("demoUser@user.io", "password");
  };

  return (
    <Form onSubmit={handleSubmit} className="loginform__Form">
      {errors.length > 0 && <h2>{errors} </h2>}
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Username or Email</Form.Label>
        <Form.Control
          type="text"
          autoComplete="username"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
          placeholder="Enter Username or Email"
        />
      </Form.Group>
      <Form.Group controlId="formGroupPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter Password"
        />
      </Form.Group>
      <Button variant="primary" type="submit" disabled={isLoggingIn}>
        Log In
      </Button>
      <Button
        variant="secondary"
        onClick={handleDemoLogIn}
        className="demo_login"
        disabled={isLoggingIn}
      >
        Demo User
      </Button>
    </Form>
  );
};
export default LoginForm;
