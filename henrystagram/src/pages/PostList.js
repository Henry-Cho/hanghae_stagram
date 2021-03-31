import React from "react";
import Post from "../components/Post";
import styled from "styled-components";
import { Grid } from "../elements";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";

const PostList = (props) => {
  const dispatch = useDispatch();
  const post_list = useSelector((state) => state.post.list);

  console.log(post_list);

  React.useEffect(() => {
    dispatch(postActions.getPostFB());
  }, []);

  return (
    <PostListFrame>
      {post_list.map((p, idx) => {
        return <Post key={p.id} {...p} />;
      })}
    </PostListFrame>
  );
};

const PostListFrame = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 0;
`;

export default PostList;
