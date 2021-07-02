import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Alert, Button, Form, Jumbotron } from "react-bootstrap";

import { useAuth, useUpdateAuth } from "../../contexts/AuthContext";
import { authOptions, NO_TOKEN_OPTIONS } from "../../utils/requestOptions";

export default function Login() {
  const axios = require("axios");
  const history = useHistory();

  // State
  const [request, setRequest] = useState({
    username: "",
    password: "",
  });
  const [msg, setMsg] = useState({
    show: false,
    error: "",
  });

  // Context
  const isAuth = useAuth();
  const setAuth = useUpdateAuth();

  // If already logged in redirect to home page
  if (isAuth) {
    history.push("/");
  }

  // Handling change of form input fields
  const handleInputChange = (event) => {
    const { id, value } = event.currentTarget;

    setRequest({
      ...request,
      [id]: value,
    });
  };

  // Obtaining access and refresh tokens and then the user data
  const handleSubmit = async (event) => {
    event.preventDefault();

    await axios
      .post("/api/token/obtain", JSON.stringify(request), NO_TOKEN_OPTIONS)
      .then((response) => {
        // ! Use cookies here instead
        localStorage.setItem("torch_at", response.data.access);
        localStorage.setItem("torch_rt", response.data.refresh);

        return axios.get(
          `/api/${request.username}`,
          authOptions(localStorage.getItem("torch_at"))
        );
      })
      .then((response) => {
        localStorage.setItem("torch_user_data", JSON.stringify(response.data));
        setAuth(true);
        setMsg({ status: false, error: [] });
        history.push("/");
      })
      .catch((error) => {
        console.log(error);
        setMsg({
          show: true,
          error: error.response !== undefined ? error.response.data : error,
        });
        setRequest({
          ...request,
          password: "",
        });
        history.push("/login");
      });
  };

  return (
    <Jumbotron className="d-flex pt-2 justify-content-center text-center">
      <Form onSubmit={handleSubmit}>
        <Form.Row
          className="p-4"
          style={{
            backgroundColor: "darkblue",
            borderRadius: "20px 50px",
            color: "white",
          }}
        >
          <h2>Login</h2>
        </Form.Row>
        <br />
        <Form.Group className="d-flex p-2">
          <Form.Label className="m-2">Username:</Form.Label>
          <Form.Control
            id="username"
            type="text"
            value={request.username}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group className="d-flex p-2">
          <Form.Label className="m-2">Password:</Form.Label>
          <Form.Control
            id="password"
            type="password"
            value={request.password}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        {msg.show === true && (
          <Alert variant="danger">{msg.error["detail"]}</Alert>
        )}

        <Button
          type="submit"
          className="m-2"
          variant="outline-success"
          style={{ borderWidth: "3px" }}
        >
          Login
        </Button>

        <Alert variant="warning" style={{ borderRadius: "20px 50px" }}>
          Don't have an account?
          <Button href="/signup" variant="link">
            Signup
          </Button>
        </Alert>
      </Form>
    </Jumbotron>
  );
}
