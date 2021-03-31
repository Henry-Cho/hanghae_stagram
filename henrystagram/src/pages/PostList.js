import React from "react";
import Post from "../components/Post";
import styled from "styled-components";
import { Grid } from "../elements";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";
import InfinityScroll from "../shared/InfinityScroll";

const PostList = (props) => {
  const dispatch = useDispatch();
  const post_list = useSelector((state) => state.post.list);
  const is_loading = useSelector((state) => state.post.is_loading);
  const paging = useSelector((state) => state.post.paging);

  React.useEffect(() => {
    if (post_list.length === 0) {
      dispatch(postActions.getPostFB());
    }
  }, []);

  console.log(post_list);

  return (
    <PostListFrame>
      <InfinityScroll
        callNext={() => {
          console.log("next!!");
          console.log(paging);
          dispatch(postActions.getPostFB(true));
        }}
        is_next={paging.next ? true : false}
        is_loading={is_loading}
      >
        {post_list.map((p, idx) => {
          return <Post key={p.id} {...p} />;
        })}
      </InfinityScroll>
    </PostListFrame>
  );
};

const PostListFrame = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 0;
`;

export default PostList;
