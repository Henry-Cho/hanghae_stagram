import React from "react";
import Post from "../components/Post";
import styled from "styled-components";

const PostDetail = (props) => {
  return (
    <PostDetailFrame>
      <Post />
    </PostDetailFrame>
  );
};

const PostDetailFrame = styled.div`
  margin-top: 20px;
`;

export default PostDetail;
