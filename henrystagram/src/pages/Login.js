import React from "react";
import { Button, Grid, Input, Text } from "../elements";
import { setCookie, getCookie } from "../shared/Cookie";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";

const Login = (props) => {
  const dispatch = useDispatch();
  const [id, setId] = React.useState("");
  const [pwd, setPwd] = React.useState("");

  const changeId = (e) => {
    console.log(e.target.value);
    setId(e.target.value);
  };

  const changePwd = (e) => {
    console.log(e.target.value);
    setPwd(e.target.value);
  };

  const login = () => {
    if (id === "" || pwd === "") {
      window.alert("아이디 또는 비밀번호가 공란입니다.");
      return;
    }
    dispatch(userActions.loginFB(id, pwd));
    console.log("로그인 했어!");
  };
  return (
    <LoginFrame>
      <Text type="heading">로그인 페이지</Text>
      <Input
        label="아이디"
        value={id}
        _onChange={changeId}
        placeholder="아이디를 입력하세요."
      />
      <Input
        label="비밀번호"
        value={pwd}
        _onChange={changePwd}
        type="password"
        placeholder="비밀번호를 입력하세요."
      />
      <Button
        _onClick={() => {
          login();
        }}
      >
        로그인
      </Button>
    </LoginFrame>
  );
};

const LoginFrame = styled.div`
  margin-top: 20px;
  width: 80vw;
  height: 80vh;
  display: flex;
  flex-direction: column;
  padding: 12px 12px;
  background: white;
`;
export default Login;
