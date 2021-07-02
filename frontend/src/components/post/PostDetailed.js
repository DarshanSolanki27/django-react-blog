import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

import { useAuth } from "../../contexts/AuthContext";

export default function PostDetailed() {
  const axios = require("axios");

  const history = useHistory();
  const location = useLocation();
  const { slug } = useParams();

  // State
  const [post, setPost] = useState({});
  const [isAuthor, setIsAuthor] = useState(false);

  // Context
  const isAuth = useAuth();

  // Fetching post from location.state or API
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

    if (isAuth) {
      setIsAuthor(
        post.author ===
          JSON.parse(localStorage.getItem("torch_user_data"))["username"]
      );
    }
  }, []);

  // Link to edit post page
  const handleEditClick = () => {
    history.push({
      pathname: `/p/${slug}/edit`,
      state: { post },
    });
  };

  return (
    <Container fluid>
      <div>
        <h1>
          <p>{post.title}</p>
        </h1>
        {isAuthor === true && <Button onClick={handleEditClick}>Edit</Button>}
        <blockquote className="blockquote">
          <footer className="blockquote-footer d-flex justify-content-end">
            Author:{" "}
            <cite
              onClick={() => history.push(`/${post.author}`)}
              style={{ cursor: "pointer" }}
            >
              {post.author}
            </cite>
          </footer>
        </blockquote>
        <h6 className="d-flex justify-content-end">
          last edited: {post.modified}
        </h6>
      </div>
      <h5>{post.content}</h5>
    </Container>
  );
}
