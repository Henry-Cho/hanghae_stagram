import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, storage } from "../../shared/firebase";
import "moment";
import moment from "moment";

//import { actionCreators as imageActions } from "redux-actions";

const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST";
const LOADING = "LOADING";
const DELETE_POST = "DELETE_POST";

const setPost = createAction(SET_POST, (post_list) => ({
  post_list,
}));
const addPost = createAction(ADD_POST, (post) => ({
  post,
}));
const editPost = createAction(EDIT_POST, (post_id, post) => ({
  post_id,
  post,
}));

//const deletePost = createAction()

const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

const initialState = {
  list: [],
  //   paging: {
  //     start: null,
  //     next: null,
  //     size: 3,
  //   },
  is_loading: false,
};

const initialPost = {
  user_info: {
    user_name: "henry",
    user_profile:
      "https://cloudfour.com/examples/img-currentsrc/images/kitten-small.png",
  },
  image_url:
    "https://cloudfour.com/examples/img-currentsrc/images/kitten-small.png",
  contents: "",
  insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
};

const getPostFB = (start = null, size = 3) => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");

    postDB.get().then((docs) => {
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
      console.log(post_list);
      dispatch(setPost(post_list));
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

// const editPostFB = (post_id = null, post = {}) => {
//   return function (dispatch, getState, { history }) {
//     if (!post_id) {
//       console.log("게시물 정보가 없어요!");
//       return;
//     }

//     const _image = getState().image.preview;
//     const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);

//     const _post = getState().post.list[_post_idx];

//     console.log(_post);

//     const postDB = firestore.collection("post");

//     if (_image === _post.image_url) {
//       postDB
//         .doc(post_id)
//         .update({ ...post })
//         .then((doc) => {
//           dispatch(editPost(post_id, { ...post }));
//           history.replace("/");
//         });
//       return;
//     } else {
//       const user_id = getState().user.user.uid;
//       const _upload = storage
//         .ref(`images/${user_id}_${new Date().getTime()}`)
//         .putString(_image, "data_url");

//       _upload
//         .then((snapshot) => {
//           snapshot.ref
//             .getDownloadURL()
//             .then((url) => {
//               // url을 확인해봐요!
//               console.log(url);
//               dispatch(imageActions.uploadImage(url));
//               return url;
//             })
//             .then((url) => {
//               // return으로 넘겨준 값이 잘 넘어왔나요? :)
//               // 다시 콘솔로 확인해주기!
//               console.log(url);
//               postDB
//                 .doc(post_id)
//                 .update({ ...post, image_url: url })
//                 .then((doc) => {
//                   dispatch(editPost(post_id, { ...post, image_url: url }));
//                   history.replace("/");
//                 });
//             });
//         })
//         .catch((err) => {
//           window.alert("앗! 이미지 업로드에 문제가 있어요!");
//           console.log(err);
//         });
//     }
//   };
// };

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

// const getOnePostFB = (id) => {
//   return function (dispatch, getState, { history }) {
//     const postDB = firestore.collection("post");
//     postDB
//       .doc(id)
//       .get()
//       .then((doc) => {
//         console.log(doc);
//         console.log(doc.data());
//         let _post = doc.data();

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
//         dispatch(setPost([post]));
//       });
//   };
// };

export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.push(...action.payload.post_list);

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
  },
  initialState
);

const actionCreators = {
  setPost,
  addPost,
  editPost,
  getPostFB,
  //   addPostFB,
  //   editPostFB,
  //   getOnePostFB,
};

export { actionCreators };
