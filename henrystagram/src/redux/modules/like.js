import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import firebase from "firebase/app";
import { firestore } from "../../shared/firebase";
import { actionCreators as postActions } from "./post";

const ADD_LIKE = "ADD_LIKE";
const GET_LIKE = "GET_LIKE";

const addLike = createAction(ADD_LIKE, (post_id, user_id) => ({
  post_id,
  user_id,
}));

const getLike = createAction(GET_LIKE, (post_id, user_list) => ({
  post_id,
  user_list,
}));

const initialState = {
  post_id: null,
  user_id: null,
  user_list: {},
};

const addLikeFB = (post_id) => {
  return function (dispatch, getState, { history }) {
    if (!post_id) {
      return;
    }
    const user_info = getState().user.user;
    const likeDB = firestore.collection("like");
    //const likeInfo = getState().like.user_list[]
    let like_info = {
      post_id: post_id,
      user_id: user_info.uid,
    };

    likeDB.add(like_info).then((doc) => {
      const postDB = firestore.collection("post");
      const post = getState().post.list.find((l) => l.id === post_id);
      const increment = firebase.firestore.FieldValue.increment(1);

      like_info = { ...like_info, id: doc.id };

      postDB
        .doc(post_id)
        .update({ like_cnt: increment })
        .then((_post) => {
          dispatch(addLike(post_id, user_info.uid));

          if (post) {
            dispatch(postActions.editPost(post_id), {
              like_cnt: parseInt(post.like_cnt) + 1,
            });
          }
        });
    });
  };
};

const deleteLikeFB = (post_id, doc_id) => {
  return function (dispatch, getState, { history }) {
    const likeDB = firestore.collection("like");
    const postDB = firestore.collection("post");
    const post = getState().post.list.find((l) => l.id === post_id);

    likeDB
      .doc(doc_id)
      .delete()
      .then(() => {
        const increment = firebase.firestore.FieldValue.increment(-1);
        postDB.doc(post_id).update({ like_cnt: increment });

        if (post) {
          dispatch(postActions.editPost(post_id), {
            like_cnt: parseInt(post.like_cnt) - 1,
          });
        }
      });
  };
};

const getLikeFB = (post_id, user_id) => {
  return function (dispatch, getState, { history }) {
    console.log(post_id, user_id);
    const likeDB = firestore.collection("like");

    if (!post_id) {
      return;
    }

    likeDB
      .where("post_id", "==", post_id)
      .where("user_id", "==", user_id)
      .get()
      .then((docs) => {
        let list;

        docs.forEach((doc) => {
          list = { ...doc.data(), id: doc.id };
        });
        console.log(post_id, list);
        dispatch(getLike(post_id, list));
      })
      .catch((err) => {
        console.log("좋아요 정보를 확인할 수 없습니다!");
      });
  };
};

export default handleActions(
  {
    [ADD_LIKE]: (state, action) =>
      produce(state, (draft) => {
        if (!draft.user_list[action.payload.post_id]) {
          draft.user_list[action.payload.post_id] = [action.payload.user_id];
          return;
        }
        draft.user_list[action.payload.post_id].unshift(action.payload.user_id);
      }),
    [GET_LIKE]: (state, action) =>
      produce(state, (draft) => {
        // let data = {[post_id]: com_list, ...}
        draft.user_list[action.payload.post_id] = action.payload.user_list;
      }),
  },
  initialState
);

const actionCreators = {
  //clickLike,
  getLike,
  getLikeFB,
  addLikeFB,
  deleteLikeFB,
};

export { actionCreators };
