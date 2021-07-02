import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { Button, Form, Jumbotron } from "react-bootstrap";

import { useAuth } from "../../contexts/AuthContext";
import { authOptions } from "../../utils/requestOptions";

export default function EditDeletePost() {
  const axios = require("axios");

  // React router dom
  const history = useHistory();
  const { slug } = useParams();
  const location = useLocation();

  // State
  const [post, setPost] = useState(location.state.post);
  const [request, setRequest] = useState({
    content: post.content,
  });

  // Context
  const isAuth = useAuth();

  // Handling form input field changes
  const handleInputChange = (event) => {
    const { id, value } = event.currentTarget;

    setRequest({
      ...request,
      [id]: value,
    });
  };

  // Blog Post content edit request
  const handleEdit = async (event) => {
    event.preventDefault();

    await axios
      .put(
        `/api/p/${slug}/edit`,
        JSON.stringify(request),
        authOptions(localStorage.getItem("torch_at"))
      )
      .then(() => {
        alert("Edited Successfully!");
        history.push(`/p/${slug}`);
      })
      .catch((error) => console.log(error));
  };

  // Blog Post delete request
  const handleDelete = async (event) => {
    event.preventDefault();

    await axios
      .delete(`/api/p/${slug}`, authOptions(localStorage.getItem("torch_at")))
      .then(() => {
        alert("Deleted Successfully");
        history.push(`/${post.author}`);
      })
      .catch((error) => console.log(error));
  };

  // Fetching post from location.state or API
  // Then redirecting to login page if not logged in
  // or to previous url if user is not the author of the post
  useEffect(() => {
    const fetchPost = async () => {
      await axios
        .get(`/api/p/${slug}`)
        .then((response) => {
          setPost(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    if (location.state !== undefined) {
      setPost(location.state.post);
    } else {
      fetchPost();
    }

    if (!isAuth) {
      history.push("/login");
    } else if (
      post.author !==
      JSON.parse(localStorage.getItem("torch_user_data"))["username"]
    ) {
      alert("You can only edit your own blog posts.");
      history.goBack();
    }
  }, []);

  return (
    <Jumbotron className="d-flex p-2 text-center" style={{ width: "95%" }}>
      <Form>
        <h3>{request.title}</h3>
        <Form.Group className="d-flex p-2">
          <Form.Label className="m-2">Title:</Form.Label>
          <Form.Control id="title" type="text" value={post.title} />
          <Form.Text>Title once set cannot be changed</Form.Text>
        </Form.Group>
        <Form.Group className="d-flex p-2">
          <Form.Label className="m-2">Content:</Form.Label>
          <Form.Control
            id="content"
            as="textarea"
            value={request.content}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Button
          onClick={handleEdit}
          className="m-2"
          variant="outline-warning"
        >
          Save Changes
        </Button>
        <Button onClick={handleDelete} className="m-2" variant="danger">
          Delete Post
        </Button>
      </Form>
    </Jumbotron>
  );
}
