import React from "react";
import Post from "../components/Post";
import styled from "styled-components";
import { Button } from "../elements";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";
import { actionCreators as userActions } from "../redux/modules/user";

const PostDetail = (props) => {
  const { history } = props;

  console.log(props.match.params);
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
      {post && post.user_info.user_id === user_info?.uid ? (
        <React.Fragment>
          <Button
            _onClick={() => {
              history.push(`/write/${id}`);
            }}
          >
            수정
          </Button>{" "}
          <Button>삭제</Button>
        </React.Fragment>
      ) : (
        ""
      )}
      {post && <Post {...post} />}
    </PostDetailFrame>
  );
};

const PostDetailFrame = styled.div`
  margin-top: 20px;
`;

export default PostDetail;
