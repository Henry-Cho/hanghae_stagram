import React from "react";
import { Grid, Text, Button } from "../elements/index";
import styled from "styled-components";
import logoBg from "../HenryStagam.png";
import { getCookie, deleteCookie } from "../shared/Cookie";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";
import { history } from "../redux/configStore";
import { apiKey } from "../shared/firebase";

const Header = (props) => {
  const dispatch = useDispatch();
  const is_login = useSelector((state) => state.user.is_login);
  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;

  const is_session = sessionStorage.getItem(_session_key) ? true : false;

  if (is_login && is_session) {
    return (
      <React.Fragment>
        <Grid height="14vh" bg="white" padding="14px" is_flex>
          <Logo />
          <Grid width="40%" is_flex>
            <Button
              _onClick={() => {
                dispatch(userActions.logOutFB());
              }}
            >
              로그아웃
            </Button>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <Grid height="14vh" bg="white" padding="14px" is_flex>
        <Logo />
        <Grid width="40%" is_flex>
          <Button
            _onClick={() => {
              history.push("/login");
            }}
          >
            로그인
          </Button>
          <Button
            _onClick={() => {
              history.push("/signup");
            }}
          >
            회원가입
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const Logo = styled.div`
  background-image: url("${logoBg}");
  width: 15vw;
  height: 100%;
  background-size: cover;
  background-position: center;
`;

export default Header;
