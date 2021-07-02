import React, { useEffect, useState } from "react";
import { Alert, Jumbotron, Spinner } from "react-bootstrap";

import PostCard from "./post/PostCard";

export default function Home() {
  const axios = require("axios");

  // State
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetching all blog posts
  useEffect(() => {
    axios
      .get("/api/p")
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [posts]);

  if (loading) {
    return <Spinner animation="border" variant="primary" className="m-5" />;
  } else {
    if (posts.length === 0) {
      return (
        <Alert variant="danger" className="m-4 text-center">
          <Alert.Heading>Nothing blogs to show!</Alert.Heading>
        </Alert>
      );
    } else {
      return (
        <Jumbotron className="justify-content-center">
          {posts.map((post) => (
            <PostCard post={post} isAuthor={false} />
          ))}
        </Jumbotron>
      );
    }
  }
}
