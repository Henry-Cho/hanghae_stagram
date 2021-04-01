import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import firebase from "firebase/app";
import { firestore } from "../../shared/firebase";
import { actionCreators as postActions } from "./post";

const ADD_LIKE = "ADD_LIKE";
const GET_LIKE = "GET_LIKE";
const DELETE_LIKE = "DELETE_LIKE";

const addLike = createAction(ADD_LIKE, (post_id, like_info) => ({
  post_id,
  like_info,
}));

const getLike = createAction(GET_LIKE, (post_id, user_list) => ({
  post_id,
  user_list,
}));

const deleteLike = createAction(DELETE_LIKE, (doc_id) => ({
  doc_id,
}));

const initialState = {
  post_id: null,
  user_id: null,
  user_list: [],
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
          dispatch(addLike(post_id, like_info));

          if (post) {
            dispatch(
              postActions.editPost(post_id, {
                like_cnt: parseInt(post.like_cnt) + 1,
                is_like: true,
              })
            );
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
    console.log(doc_id);
    likeDB
      .doc(doc_id)
      .delete()
      .then((doc) => {
        const increment = firebase.firestore.FieldValue.increment(-1);
        postDB.doc(post_id).update({ like_cnt: increment });

        dispatch(deleteLike(doc_id));

        if (post) {
          dispatch(
            postActions.editPost(post_id, {
              like_cnt: parseInt(post.like_cnt) - 1,
              is_like: false,
            })
          );
        }
      });
  };
};

const getLikeFB = (post_id, user_id) => {
  return function (dispatch, getState, { history }) {
    const likeDB = firestore.collection("like");

    if (!post_id) {
      return;
    }
    let post_list = getState().post.list;
    let post_ids = getState().post.list.map((l) => {
      return l.id;
    });

    likeDB
      .where("post_id", "in", post_ids)
      .get()
      .then((docs) => {
        let like_list = [];

        docs.forEach((doc) => {
          like_list.push({ ...doc.data(), id: doc.id });
        });

        const user_id = getState().user.user.uid;

        const new_post_list = post_list.map((l) => {
          let is_like = like_list.filter((m) => {
            return m.user_id === user_id && l.id === m.post_id;
          });
          console.log(is_like);
          //if (user_id === )
          return { ...l, is_like: is_like.length > 0 ? true : false };
        });
        dispatch(postActions.setPost(new_post_list));
        dispatch(getLike(post_id, like_list));
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
        if (!draft.user_list) {
          draft.user_list = [action.payload.user_list];
        }
        draft.user_list.unshift(action.payload.like_info);
      }),
    [GET_LIKE]: (state, action) =>
      produce(state, (draft) => {
        // let data = {[post_id]: com_list, ...}
        draft.user_list = action.payload.user_list;
        console.log(action.payload.user_list);
      }),
    [DELETE_LIKE]: (state, action) =>
      produce(state, (draft) => {
        const index = draft.user_list.findIndex((l) => {
          return l.id === action.payload.doc_id;
        });
        console.log(index);
        draft.user_list.splice(index, 1);
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
  deleteLike,
};

export { actionCreators };
