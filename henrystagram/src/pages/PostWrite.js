import React from "react";
import { Text, Button, Image, Input } from "../elements";
import Upload from "../shared/Upload";
import styled from "styled-components";

const PostWrite = (props) => {
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

      <Input label="게시글 내용" placeholder="게시글 작성" multiLine />

      <Button text="게시글 작성"></Button>
    </PostWriteFrame>
  );
};

const PostWriteFrame = styled.div`
  margin-top: 20px;
  width: 80vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 12px 12px;
  background: white;
`;

export default PostWrite;
