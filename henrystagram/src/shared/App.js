import "./App.css";
import React from "react";
import Header from "../components/Header";
import styled from "styled-components";
import { Button } from "../elements";
import { BrowserRouter, Route } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { history } from "../redux/configStore";

import PostList from "../pages/PostList";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Permit from "./Permit";
import PostWrite from "../pages/PostWrite";
import PostDetail from "../pages/PostDetail";

import { actionCreators as userActions } from "../redux/modules/user";
import { useDispatch } from "react-redux";
import { apiKey } from "./firebase";

function App() {
  const dispatch = useDispatch();
  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const is_session = sessionStorage.getItem(_session_key) ? true : false;

  React.useEffect(() => {
    if (is_session) {
      dispatch(userActions.loginCheckFB());
    }
  }, []);

  return (
    <AppFrame>
      <Header></Header>
      <ConnectedRouter history={history}>
        <Route exact path="/" component={PostList} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/write" component={PostWrite} />
        <Route exact path="/post/:id" component={PostDetail} />
      </ConnectedRouter>
      <Permit>
        <Button
          text="+"
          is_float
          _onClick={() => {
            history.push("/write");
          }}
        />
      </Permit>
    </AppFrame>
  );
}

const AppFrame = styled.div`
  width: 100vw;
  height: 100vh;
  background: beige;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
`;

export default App;
