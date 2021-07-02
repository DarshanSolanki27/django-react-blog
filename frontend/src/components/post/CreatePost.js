import React, { useState } from "react";
import { Button, Form, Jumbotron } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import { authOptions } from "../../utils/requestOptions";

export default function CreatePost() {
  const axios = require("axios");
  const history = useHistory();

  // State
  const [request, setRequest] = useState({
    title: "",
    content: "",
    author: JSON.parse(localStorage.getItem("torch_user_data"))["username"],
  });

  // Handling form fields change
  const handleInputChange = (event) => {
    const { id, value } = event.currentTarget;

    setRequest({
      ...request,
      [id]: value,
    });
  };

  // Create post request to API
  const handleSubmit = async (event) => {
    event.preventDefault();


    await axios
      .post(
        "/api/p",
        JSON.stringify(request),
        authOptions(localStorage.getItem("torch_at"))
      )
      .then(() => {
        alert("Post successful");
        history.push(
          `/${JSON.parse(localStorage.getItem("torch_user_data"))["username"]}`
        );
      })
      .catch((error) => console.log(error));
  };

  return (
    <Jumbotron className="d-flex p-2 text-center" style={{ width: "95%" }}>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="d-flex p-2">
          <Form.Label className="m-2">Title:</Form.Label>
          <Form.Control
            id="title"
            type="text"
            value={request.title}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group className="d-flex p-2">
          <Form.Label className="m-2">Content:</Form.Label>
          <Form.Control
            id="content"
            as="textarea"
            value={request.content}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Button type="submit" className="m-2" variant="outline-success">
          Create Post
        </Button>
      </Form>
    </Jumbotron>
  );
}
