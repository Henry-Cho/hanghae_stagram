import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, storage } from "../../shared/firebase";
import "moment";
import moment from "moment";

import { actionCreators as imageActions } from "./image";

const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST";
const LOADING = "LOADING";
const DELETE_POST = "DELETE_POST";

const setPost = createAction(SET_POST, (post_list, paging) => ({
  post_list,
  paging,
}));
const addPost = createAction(ADD_POST, (post) => ({
  post,
}));
const editPost = createAction(EDIT_POST, (post_id, post) => ({
  post_id,
  post,
}));

const deletePost = createAction(DELETE_POST, (post_id, post_list) => ({
  post_id,
  post_list,
}));

const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

const initialState = {
  list: [],
  paging: {
    start: null,
    next: null,
    size: 3,
  },
  is_loading: false,
};

const initialPost = {
  image_url:
    "https://cloudfour.com/examples/img-currentsrc/images/kitten-small.png",
  contents: "",
  insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
  layoutOption: "a",
  like_cnt: 0,
};

const getPostFB = (is_more = false, size = 3) => {
  return function (dispatch, getState, { history }) {
    let is_loading = getState().post.is_loading;

    if (is_loading) {
      return;
    }
    let _paging = getState().post.paging;

    if (_paging.start && !_paging.next) {
      return;
    }

    dispatch(loading(true));

    const postDB = firestore.collection("post");

    let query = postDB.orderBy("insert_dt", "desc");

    if (is_more) {
      query = query.startAt(_paging.next);
    }

    query
      .limit(size + 1)
      .get()
      .then((docs) => {
        console.log(docs.docs.length);
        let paging = {
          start: docs.docs[0],
          next:
            docs.docs.length === size + 1
              ? docs.docs[docs.docs.length - 1]
              : null,
          size: size,
        };

        let post_list = [];
        docs.forEach((doc) => {
          let _post = doc.data();

          let post = Object.keys(_post).reduce(
            (acc, cur) => {
              if (cur.indexOf("user_") !== -1) {
                return {
                  ...acc,
                  user_info: { ...acc.user_info, [cur]: _post[cur] },
                };
              }
              return { ...acc, [cur]: _post[cur] };
            },
            { id: doc.id, user_info: {} }
          );
          post_list.push(post);
        });

        if (paging.next !== null) {
          post_list.pop();
        }
        console.log(paging);
        dispatch(setPost(post_list, paging));
      });
  };
};

const deletePostFB = (post_id = null) => {
  return function (dispatch, getState, { history }) {
    if (!post_id) {
      console.log("????????? ????????? ?????????!");
      return;
    }

    const postDB = firestore.collection("post");
    const before_deleted_post_list = getState().post.list;
    postDB
      .doc(post_id)
      .delete()
      .then(() => {
        dispatch(deletePost(post_id, before_deleted_post_list));
        window.alert("??????????????? ?????????????????????.");
        history.replace("/");
        console.log("Document successfully deleted!");
      })
      .catch((err) => {
        console.log("????????? ????????? ?????? ???????????????", err);
      });
  };
};

// let _post = {
//   id: doc.id,
//   ...doc.data(),
// };

// let post = {
//   id: doc.id,
//   user_info: {
//     user_name: _post.user_name,
//     user_profile: _post.user_profile,
//     user_id: _post.user_id,
//   },
//   image_url: _post.image_url,
//   contents: _post.contents,
//   comment: _post.comment_cnt,
//   insert_dt: _post.insert_dt,
// };
// post_list.push(post);

const addPostFB = (contents = "", layoutOption) => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");

    const _user = getState().user.user;

    const user_info = {
      user_name: _user.user_name,
      user_id: _user.uid,
      user_profile: _user.user_profile,
    };
    const _post = {
      ...initialPost,
      contents: contents,
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
      layoutOption: layoutOption,
    };

    const _image = getState().image.preview;

    console.log(_image);

    const _upload = storage
      .ref(`images/${user_info.user_id}_${new Date().getTime()}`)
      .putString(_image, "data_url");

    _upload.then((snapshot) => {
      snapshot.ref
        .getDownloadURL()
        .then((url) => {
          console.log(url);
          return url;
        })
        .then((url) => {
          postDB
            .add({ ...user_info, ..._post, image_url: url })
            .then((doc) => {
              let post = { user_info, ..._post, id: doc.id, image_url: url };

              dispatch(addPost(post));
              history.replace("/");

              dispatch(imageActions.setPreview(null));
            })
            .catch((err) => {
              window.alert("post ????????? ??????????????????.", err);
              console.log("post ????????? ??????????????????.", err);
            });
        })
        .catch((err) => {
          window.alert("????????? ???????????? ????????? ?????????!", err);
          console.log("????????? ???????????? ????????? ?????????!", err);
        });
    });
  };
};

const editPostFB = (post_id = null, post = {}) => {
  return function (dispatch, getState, { history }) {
    if (!post_id) {
      console.log("????????? ????????? ?????????!");
      return;
    }

    const _image = getState().image.preview;
    const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);

    const _post = getState().post.list[_post_idx];

    console.log(_post);

    const postDB = firestore.collection("post");

    if (_image === _post.image_url) {
      postDB
        .doc(post_id)
        .update({ ...post })
        .then((doc) => {
          dispatch(editPost(post_id, { ...post }));
          history.replace("/");
        });
      return;
    } else {
      const user_id = getState().user.user.uid;
      const _upload = storage
        .ref(`images/${user_id}_${new Date().getTime()}`)
        .putString(_image, "data_url");

      _upload
        .then((snapshot) => {
          snapshot.ref
            .getDownloadURL()
            .then((url) => {
              // url??? ???????????????!
              console.log(url);
              dispatch(imageActions.uploadImage(url));
              return url;
            })
            .then((url) => {
              // return?????? ????????? ?????? ??? ???????????????? :)
              // ?????? ????????? ???????????????!
              console.log(url);
              postDB
                .doc(post_id)
                .update({ ...post, image_url: url })
                .then((doc) => {
                  dispatch(editPost(post_id, { ...post, image_url: url }));
                  history.replace("/");
                });
            });
        })
        .catch((err) => {
          window.alert("???! ????????? ???????????? ????????? ?????????!");
          console.log(err);
        });
    }
  };
};

// const getPostFB = (start = null, size = 3) => {
//   return function (dispatch, getState, { history }) {
//     let _paging = getState().post.paging;

//     if (_paging.start && !_paging.next) {
//       return;
//     }

//     dispatch(loading(true));

//     const postDB = firestore.collection("post");

//     let query = postDB.orderBy("insert_dt", "desc");

//     if (start) {
//       query = query.startAt(start);
//     }

//     query
//       .limit(size + 1)
//       .get()
//       .then((docs) => {
//         let post_list = [];

//         let paging = {
//           start: docs.docs[0],
//           next:
//             docs.docs.length === size + 1
//               ? docs.docs[docs.docs.length - 1]
//               : null,
//           size: size,
//         };
//         docs.forEach((doc) => {
//           let _post = doc.data();

//           // ['comment_cnt', 'user_id'...]
//           let post = Object.keys(_post).reduce(
//             (acc, cur) => {
//               if (cur.indexOf("user_") !== -1) {
//                 return {
//                   ...acc,
//                   user_info: { ...acc.user_info, [cur]: _post[cur] },
//                 };
//               }
//               return { ...acc, [cur]: _post[cur] };
//             },
//             { id: doc.id, user_info: {} }
//           );
//           post_list.push(post);
//         });
//         post_list.pop();

//         dispatch(setPost(post_list, paging));
//       });
//     return;
//     postDB.get().then((docs) => {
//       let post_list = [];
//       docs.forEach((doc) => {
//         let _post = doc.data();

//         // ['comment_cnt', 'user_id'...]
//         let post = Object.keys(_post).reduce(
//           (acc, cur) => {
//             if (cur.indexOf("user_") !== -1) {
//               return {
//                 ...acc,
//                 user_info: { ...acc.user_info, [cur]: _post[cur] },
//               };
//             }
//             return { ...acc, [cur]: _post[cur] };
//           },
//           { id: doc.id, user_info: {} }
//         );

//         // let _post = {
//         //   id: doc.id,
//         //   ...doc.data(),
//         // };

//         // let post = {
//         //   id: doc.id,
//         //   user_info: {
//         //     user_name: _post.user_name,
//         //     user_profile: _post.user_profile,
//         //     user_id: _post.user_id,
//         //   },
//         //   image_url: _post.image_url,
//         //   contents: _post.contents,
//         //   comment_cnt: _post.comment_cnt,
//         //   insert_dt: _post.insert_dt,
//         // };
//         post_list.push(post);
//       });
//       dispatch(setPost(post_list));
//     });
//   };
// };

const getOnePostFB = (id) => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");
    postDB
      .doc(id)
      .get()
      .then((doc) => {
        console.log(doc);
        console.log(doc.data());
        let _post = doc.data();

        let post = Object.keys(_post).reduce(
          (acc, cur) => {
            if (cur.indexOf("user_") !== -1) {
              return {
                ...acc,
                user_info: { ...acc.user_info, [cur]: _post[cur] },
              };
            }
            return { ...acc, [cur]: _post[cur] };
          },
          { id: doc.id, user_info: {} }
        );
        dispatch(setPost([post]));
      });
  };
};

export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.push(...action.payload.post_list);
        if (action.payload.paging) {
          draft.paging = action.payload.paging;
        }
        draft.is_loading = false;

        draft.list = draft.list.reduce((acc, cur) => {
          if (acc.findIndex((a) => a.id === cur.id) === -1) {
            return [...acc, cur];
          } else {
            acc[acc.findIndex((a) => a.id === cur.id)] = cur;
            return acc;
          }
        }, []);

        // if (action.payload.paging) {
        //   draft.paging = action.payload.paging;
        // }
        // draft.is_loading = false;
      }),

    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.unshift(action.payload.post);
      }),
    [EDIT_POST]: (state, action) =>
      produce(state, (draft) => {
        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);

        draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
      }),
    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading;
      }),
    [DELETE_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list = action.payload.post_list.filter((l, idx) => {
          if (l.id !== action.payload.post_id) {
            return [...draft.list, l];
          }
        });
      }),
  },
  initialState
);

const actionCreators = {
  setPost,
  addPost,
  editPost,
  getPostFB,
  addPostFB,
  getOnePostFB,
  editPostFB,
  deletePost,
  deletePostFB,
};

export { actionCreators };
