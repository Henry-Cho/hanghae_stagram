import React from "react";
import { Text, Button, Image, Input } from "../elements";
import Upload from "../shared/Upload";
import styled from "styled-components";
import Radio from "@material-ui/core/Radio";

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
    dispatch(postActions.addPostFB(contents, selectedValue));
  };

  const editPost = () => {
    dispatch(
      postActions.editPostFB(post_id, {
        contents: contents,
        layoutOption: selectedValue,
      })
    );
  };

  const [selectedValue, setSelectedValue] = React.useState("a");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
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
      {selectedValue === "a" ? (
        <Layout1>
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
        </Layout1>
      ) : selectedValue === "b" ? (
        <Layout2>
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
        </Layout2>
      ) : (
        <Layout3>
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
        </Layout3>
      )}

      <RadioBox>
        <div>
          <Radio
            checked={selectedValue === "a"}
            onChange={handleChange}
            value="a"
            name="radio-button-demo"
            inputProps={{ "aria-label": "A" }}
          />
          <Radio
            checked={selectedValue === "b"}
            onChange={handleChange}
            value="b"
            name="radio-button-demo"
            inputProps={{ "aria-label": "B" }}
          />
          <Radio
            checked={selectedValue === "c"}
            onChange={handleChange}
            value="c"
            name="radio-button-demo"
            inputProps={{ "aria-label": "C" }}
          />
        </div>
      </RadioBox>
      {is_edit ? (
        <Button _onClick={editPost} text="게시글 수정"></Button>
      ) : (
        <Button _onClick={addPost} text="게시글 작성"></Button>
      )}
    </PostWriteFrame>
  );
};

const PostWriteFrame = styled.div`
  width: 50vw;
  margin: 20px 0 0 0;
  background: white;
  padding: 12px;
`;

const RadioBox = styled.div`
  width: 100%;
  text-align: center;
`;

const Layout1 = styled.div``;

const Layout2 = styled.div`
  display: flex;
`;

const Layout3 = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;
export default PostWrite;
