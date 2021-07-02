import React from "react";
import { useHistory } from "react-router-dom";
import { Button, Nav, Navbar, NavDropdown } from "react-bootstrap";

import { useAuth, useUpdateAuth } from "../contexts/AuthContext";

export default function NavBar() {
  const history = useHistory();

  // Context
  const isAuth = useAuth();
  const setAuth = useUpdateAuth();

  // Logging out (clear data in local storage and update context)
  const logout = () => {
    const localStorageData = ["torch_at", "torch_rt", "torch_user_data"];

    localStorageData.map((data) => localStorage.removeItem(data));
    setAuth(false);
    history.push("/");
  };

  const navDropdownItems = [
    {
      name: "Change Password",
      href: "/change-password",
    },
    {
      name: "Delete Account",
      href: "/confirm-delete",
    },
  ];

  return (
    <Navbar variant="dark" bg="dark">
      <Navbar.Brand
        className="p-3 m-3"
        style={{ border: "2px solid cyan", borderRadius: "50px 20px" }}
      >
        <h2>DR Blog</h2>
      </Navbar.Brand>

      <Nav
        style={{ width: "65%" }}
        className="d-flex justify-content-center p-2"
      >
        <Nav.Item>
          <Nav.Link href="/">Home</Nav.Link>
        </Nav.Item>

        {!isAuth && (
          <Nav.Item>
            <Nav.Link href="/signup">Signup</Nav.Link>
          </Nav.Item>
        )}
        {!isAuth && (
          <Nav.Item>
            <Nav.Link href="/login">Login</Nav.Link>
          </Nav.Item>
        )}

        {isAuth && (
          <Nav.Item>
            <Nav.Link
              href={`/${
                JSON.parse(localStorage.getItem("torch_user_data"))["username"]
              }`}
            >
              My Posts
            </Nav.Link>
          </Nav.Item>
        )}

        {isAuth && (
          <NavDropdown title="Account">
            {navDropdownItems.map((item) => (
              <NavDropdown.Item
                href={`/${
                  JSON.parse(localStorage.getItem("torch_user_data"))[
                    "username"
                  ]
                }${item.href}`}
              >
                {item.name}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
        )}
      </Nav>

      {isAuth && (
        <Nav className="d-flex justify-content-end">
          <Navbar.Brand className="m-2" style={{ color: "cyan" }}>
            Hello{" "}
            {JSON.parse(localStorage.getItem("torch_user_data"))["username"]}!
          </Navbar.Brand>

          <Button href="/p/create" variant="outline-info" className="m-2">
            Create New Post
          </Button>

          <Button onClick={logout} variant="outline-info" className="m-2">
            Logout
          </Button>
        </Nav>
      )}
    </Navbar>
  );
}
