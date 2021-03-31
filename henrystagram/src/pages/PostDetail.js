import React from "react";
import Post from "../components/Post";
import styled from "styled-components";
import { Button } from "../elements";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";
import { actionCreators as userActions } from "../redux/modules/user";

const PostDetail = (props) => {
  const { history } = props;

  const dispatch = useDispatch();
  const id = props.match.params.id;
  const user_info = useSelector((state) => state.user.user);
  const post_list = useSelector((state) => state.post.list);

  console.log(post_list);

  const post_idx = post_list.findIndex((p) => p.id === id);

  const post = post_list[post_idx];

  console.log(id);

  const deletePost = () => {
    dispatch(postActions.deletePostFB(id));
  };

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
          <PostDetailBtn>
            <Button
              _onClick={() => {
                history.push(`/write/${id}`);
              }}
            >
              수정
            </Button>
            <Button _onClick={deletePost}>삭제</Button>
          </PostDetailBtn>
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

const PostDetailBtn = styled.div`
  display: flex;
  width: 100%;
`;

export default PostDetail;
