import React from "react";
import { useHistory } from "react-router-dom";
import { Button, Card } from "react-bootstrap";

export default function PostCard({ post, isAuthor }) {
  const history = useHistory();

  const handleButtonClick = (url) => {
    history.push({
      pathname: url,
      state: { post },
    });
  };

  return (
    <Card className="m-3" style={{ backgroundColor:"lightsteelblue", border:"3px solid darkblue" }}>
      <Card.Header>
        <h1>{post.title}</h1>
        {isAuthor === true && (
          <span>
            <Button
              id="edit"
              onClick={() => handleButtonClick(`/p/${post.slug}/edit`)}
            >
              Edit
            </Button>
          </span>
        )}
        <div className="">last edited: {post.modified}</div>
        <Card.Subtitle className="text-muted">
          <footer
            id="author"
            className="blockquote-footer d-flex justify-content-end"
          >
            <cite
              onClick={() => history.push(`/${post.author}`)}
              style={{ cursor: "pointer" }}
            >
              Author: {post.author}
            </cite>
          </footer>
        </Card.Subtitle>
      </Card.Header>

      <Card.Body
        onClick={() => handleButtonClick(`/p/${post.slug}`)}
        style={{ width: "98%", cursor: "pointer" }}
      >
        <blockquote className="blockquote">
          {post.content.length > 50
            ? post.content.substr(0, 50) + "..."
            : post.content}
        </blockquote>
      </Card.Body>
    </Card>
  );
}
