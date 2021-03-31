import React from "react";
import styled from "styled-components";
import { Grid, Image, Text, Button } from "../elements/index";
import { history } from "../redux/configStore";

const Post = (props) => {
  console.log(props);
  return (
    // 일단 로그인 & 로그인 안 할 때 두가지 경우의 기본값을 설정해주자고!
    <React.Fragment>
      <PostFrame
        onClick={() => {
          history.push(`/post/${props.id}`);
        }}
      >
        <PostTitle>
          <Text bold>{props.user_info.user_name}</Text>
          <Text bold>{props.insert_dt}</Text>
        </PostTitle>
        <PostContents>
          <Text>{props.contents}</Text>
        </PostContents>
        <PostImage>
          <Image shape="rectangle" src={props.image_url} />
        </PostImage>
        <PostInfo>
          <LikeButton>❤</LikeButton>
          <Text margin="0" bold>
            {props.comment_cnt}개
          </Text>
        </PostInfo>
      </PostFrame>
    </React.Fragment>
  );
};

Post.defaultProps = {};

const PostFrame = styled.div`
  width: 50vw;
  height: 100%;
  background: white;
  padding: 12px 12px 20px 12px;
  margin-bottom: 20px;
  border: 1px solid #dbdbdb;
  overflow: hidden;
`;

const PostTitle = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #dbdbdb;
`;

const PostContents = styled.div`
  width: 100%;
`;

const PostImage = styled.div`
  width: 100%;
`;

const PostInfo = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px 0;
`;

const LikeButton = styled.button`
  width: 10%;
  font-size: 20px;
  border: none;
  background: none;
  :focus {
    outline: none;
  }
`;

export default Post;
