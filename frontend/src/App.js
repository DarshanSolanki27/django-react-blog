import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

// Components
import Signup from "./components/account/Signup";
import Login from "./components/account/Login";
import ConfirmAccountDelete from "./components/account/ConfirmAccountDelete";
import PasswordChange from "./components/account/PasswordChange";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import UserPosts from "./components/post/UserPosts";
import PostDetailed from "./components/post/PostDetailed";
import CreatePost from "./components/post/CreatePost";
import EditDeletePost from "./components/post/EditDeletePost";

// Context
import AuthProvider from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/:username" component={UserPosts} />
          <Route exact path="/p/create" component={CreatePost} />
          <Route
            exact
            path="/:username/confirm-delete"
            component={ConfirmAccountDelete}
          />
          <Route exact path="/p/:slug" component={PostDetailed} />
          <Route exact path="/p/:slug/edit" component={EditDeletePost} />
          <Route
            exact
            path="/:username/change-password"
            component={PasswordChange}
          />
          <Route path="*">{<h1>404 Not found</h1>}</Route>
        </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
