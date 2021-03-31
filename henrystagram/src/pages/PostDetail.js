import React from "react";
import Post from "../components/Post";
import styled from "styled-components";
import { Button } from "../elements";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";
import user from "../redux/modules/user";

const PostDetail = (props) => {
  const dispatch = useDispatch();
  const id = props.match.params.id;
  const user_info = useSelector((state) => state.user.user);
  const post_list = useSelector((state) => state.post.list);

  const post_idx = post_list.findIndex((p) => p.id === id);

  const post = post_list[post_idx];

  React.useEffect(() => {
    if (post) {
      return;
    }

    dispatch(postActions.getOnePostFB(id));
  }, []);

  return (
    <PostDetailFrame>
      {post && (
        <Post {...post} is_me={post.user_info.user_id === user_info?.uid} />
      )}
    </PostDetailFrame>
  );
};

const PostDetailFrame = styled.div`
  margin-top: 20px;
`;

export default PostDetail;
