import React, { useState } from "react";
import styled from "styled-components";
import { Grid, Image, Text, Button } from "../elements/index";
import { history } from "../redux/configStore";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";
import like, { actionCreators as likeActions } from "../redux/modules/like";

const Post = (props) => {
  console.log(props);

  const dispatch = useDispatch();
  const [is_like, setLike] = useState(false);
  const user_info = useSelector((state) => state.user.user);
  const user_list = useSelector((state) => state.like.user_list);

  //const idx = user_list[props.id]

  const add_like = () => {
    dispatch(likeActions.addLikeFB(props.id));
    setLike(true);
  };

  const delete_like = () => {
    dispatch(likeActions.deleteLikeFB(props.id, user_list[props.id].id));
    setLike(false);
  };

  React.useEffect(() => {
    if (Object.keys(user_list).length === 0) {
      dispatch(likeActions.getLikeFB(props.id, props.user_info.user_id));
    }

    if (!user_list[props.id]) {
      return;
    }
    console.log(user_list[props.id], props.user_info.user_id);
    if (user_list[props.id].user_id === props.user_info.user_id) {
      setLike(true);
    }
  }, [user_list]);

  console.log(user_list);

  return (
    // 일단 로그인 & 로그인 안 할 때 두가지 경우의 기본값을 설정해주자고!
    <PostFrame>
      <PostInnerFrame
        onClick={() => {
          history.push(`/post/${props.id}`);
        }}
      >
        <PostTitle>
          <Text bold>{props.user_info.user_name}</Text>
          <Text bold>{props.insert_dt}</Text>
        </PostTitle>
        {props.layoutOption === "a" ? (
          <Layout1>
            <PostContents>
              <Text>{props.contents}</Text>
            </PostContents>
            <PostImage>
              <Image shape="rectangle" src={props.image_url} />
            </PostImage>
          </Layout1>
        ) : props.layoutOption === "b" ? (
          <Layout2>
            <PostContents>
              <Text>{props.contents}</Text>
            </PostContents>
            <PostImage>
              <Image shape="rectangle" src={props.image_url} />
            </PostImage>
          </Layout2>
        ) : (
          <Layout3>
            <PostContents>
              <Text>{props.contents}</Text>
            </PostContents>
            <PostImage>
              <Image shape="rectangle" src={props.image_url} />
            </PostImage>
          </Layout3>
        )}
      </PostInnerFrame>
      <PostInfo>
        {is_like ? (
          <LikeButton onClick={delete_like}>💗</LikeButton>
        ) : (
          <LikeButton onClick={add_like}>🖤</LikeButton>
        )}
        <Text margin="0" bold>
          {props.like_cnt}개
        </Text>
      </PostInfo>
    </PostFrame>
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

const PostInnerFrame = styled.div``;

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

const Layout1 = styled.div``;

const Layout2 = styled.div`
  display: flex;
`;

const Layout3 = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

export default Post;
