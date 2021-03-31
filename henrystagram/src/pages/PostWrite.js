import React from "react";
import { Text, Button, Image, Input } from "../elements";
import Upload from "../shared/Upload";
import styled from "styled-components";

import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";
import { actionCreators as imageActions } from "../redux/modules/image";

const PostWrite = (props) => {
  const dispatch = useDispatch();

  const post_list = useSelector((state) => state.post.list);

  const is_login = useSelector((state) => state.user.is_login);
  // 위에서 history 를 import 해주는 것이랑 어떤 차이가 있는가?
  const { history } = props;

  const preview = useSelector((state) => state.image.preview);

  const post_id = props.match.params.id;
  const is_edit = post_id ? true : false;
  let _post = is_edit ? post_list.find((p) => p.id === post_id) : null;

  // 수정 페이지 최초 진입 시에 기존에 있던 contents 가지고 오기
  const [contents, setContents] = React.useState(_post ? _post.contents : "");

  React.useEffect(() => {
    if (is_edit && !_post) {
      console.log("포스트 정보가 없어요!");
      history.goBack();
      return;
    }

    if (is_edit) {
      dispatch(imageActions.setPreview(_post.image_url));
    }
  }, []);

  const changeContents = (e) => {
    setContents(e.target.value);
  };

  const addPost = () => {
    dispatch(postActions.addPostFB(contents));
  };

  const editPost = () => {
    dispatch(postActions.editPostFB(post_id, { contents: contents }));
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
        {is_edit ? "게시글 수정" : "게시글 작성"}
      </Text>
      <Upload />
      <Text margin="0px" size="24px" bold>
        미리보기
      </Text>
      <Image
        shape="rectangle"
        src={preview ? preview : "http://via.placeholder.com/400x300"}
      />

      <Input
        _onChange={changeContents}
        label="게시글 내용"
        placeholder="게시글 작성"
        multiLine
        value={contents}
      />
      {is_edit ? (
        <Button _onClick={editPost} text="게시글 수정"></Button>
      ) : (
        <Button _onClick={addPost} text="게시글 작성"></Button>
      )}
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
