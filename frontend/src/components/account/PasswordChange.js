import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Alert, Button, Form, Jumbotron } from "react-bootstrap";

import { authOptions } from "../../utils/requestOptions";

export default function PasswordChange() {
  const axios = require("axios");

  const history = useHistory();
  const { username } = useParams();

  // State
  const [request, setRequest] = useState({
    old_password: "",
    password: "",
    password2: "",
  });
  const [msg, setMsg] = useState({
    show: false,
    error: {},
  });

  // Handling change of form input fields
  const handleInputChange = (event) => {
    const { id, value } = event.currentTarget;

    setRequest({
      ...request,
      [id]: value,
    });
  };

  // Password change request to API
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (request.password !== request.password2) {
      setRequest({
        ...request,
        password: "",
        password2: "",
      });
      alert("Passwords must match");
    } else {
      delete request.password2;

      await axios
        .put(
          `/api/${username}/change-password`,
          request,
          authOptions(localStorage.getItem("torch_at"))
        )
        .then(() => {
          alert("Password Updated");
          history.push("/");
        })
        .catch((error) => {
          setMsg({
            show: true,
            error:
              error.response.data["password"] !== null
                ? error.response.data["password"]
                : ["Unknown error occured"],
          });
          console.log(error);
        });
    }
  };

  return (
    <Jumbotron className="d-flex p-2 justify-content-center text-center">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="d-flex p-2">
          <Form.Label className="m-2">Old Password:</Form.Label>
          <Form.Control
            id="old_password"
            type="password"
            value={request.old_password}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group className="p-2">
          <div className="d-flex justify-content-center">
            <Form.Label className="m-2">New Password:</Form.Label>
            <Form.Control
              id="password"
              type="password"
              value={request.password}
              onChange={handleInputChange}
              required
            />
          </div>
          {msg.show && (
            <div className="d-flex justify-content-end">
              <Alert variant="danger">
                {msg.error.map((error) => (
                  <div>{error}</div>
                ))}
              </Alert>
            </div>
          )}
        </Form.Group>

        <Form.Group className="d-flex p-2">
          <Form.Label className="m-2">Confirm Password:</Form.Label>
          <Form.Control
            id="password2"
            type="password"
            value={request.password2}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Button type="submit" className="m-2" variant="outline-danger">
          Save Password
        </Button>
      </Form>
    </Jumbotron>
  );
}
