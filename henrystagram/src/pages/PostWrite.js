import React from "react";
import { Text, Button, Image, Input } from "../elements";
import Upload from "../shared/Upload";
import styled from "styled-components";

import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";

const PostWrite = (props) => {
  const dispatch = useDispatch();
  const is_login = useSelector((state) => state.user.is_login);
  // 위에서 history 를 import 해주는 것이랑 어떤 차이가 있는가?
  const { history } = props;
  const [contents, setContents] = React.useState("");

  const changeContents = (e) => {
    setContents(e.target.value);
  };

  const addPost = () => {
    dispatch(postActions.addPostFB(contents));
  };

  if (!is_login) {
    return (
      <React.Fragment>
        <Text>앗! 잠깐!</Text>
        <Text>로그인 후에만 글을 쓸 수 있어요!</Text>
        <Button
          _onClick={() => {
            history.replace("/login");
          }}
        >
          로그인 하러가기
        </Button>
      </React.Fragment>
    );
  }

  return (
    <PostWriteFrame>
      <Text margin="0px" size="36px" bold>
        게시글 작성
      </Text>
      <Upload />
      <Text margin="0px" size="24px" bold>
        미리보기
      </Text>
      <Image shape="rectangle" />

      <Input
        _onChange={changeContents}
        label="게시글 내용"
        placeholder="게시글 작성"
        multiLine
        value={contents}
      />

      <Button _onClick={addPost} text="게시글 작성"></Button>
    </PostWriteFrame>
  );
};

const PostWriteFrame = styled.div`
  width: 90%;
  margin: 20px 0 0 0;
  background: white;
  padding: 12px;
`;

export default PostWrite;
