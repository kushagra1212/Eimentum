import Styles from "./Content.module.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { getpostsforfeed } from "../../../methods/getpostsforfeed";
import { Suspense, useEffect, useState } from "react";
import getuser from "../../../methods/getuser";
import { useDispatch, useSelector } from "react-redux";
import getitem from "../../../methods/getitem";
import updatelikes from "../../../methods/updatelikes";
import deletelike from "../../../methods/deletelike";
import Feedposts from "../../../posts/Feedposts";
import Comments from "./comments/Comments";
import { getstoriesFromOthers } from "../../../methods/uploadstories";
import { updatepost } from "../../../reduces/actions/userAction";
import { FluidLoaderFive } from "../../../Animation/Loader/loader/FluidLoader";
import { enableBodyScroll, disableBodyScroll } from "body-scroll-lock";
import { SuspenseImg } from "./SuspenceImage/SuspenceImg";
import { getstories } from "../../../methods/uploadstories";
import ContentMainAnimate from "./ContentMainAnimate/ContentMainAnimate";
import Addcomment from "./comments/Addcomment";
import addcomment from "../../../methods/addcomments";
import {
  updateLikesArray,
  updateUnlikesArray,
} from "../../../reduces/actions/userAction";
import Search from "../../../Search/Search";
import { useAlert } from "react-alert";
const CURURL = process.env.REACT_APP_CURURL;
let likeCountArray = [];
let element = null;
const Contentmain = () => {
  const dispatch = useDispatch();
  const Alert = useAlert();
  const { profilepic, username } = useSelector((state) => {
    return state.user;
  });
  const { likesArray } = useSelector((state) => {
    return state.feedposts;
  });
  const [hasMore, sethasmore] = useState(true);
  const [isUnmounted, setIsUnmounted] = useState(false);
  let tempUserLikes = [];
  const [showAlert, setShowAlert] = useState(false);
  const [showcomments, setshowcomments] = useState(false);
  const [likeLoading, setlikeLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [userSearch,setUserSearch]=useState("");
  const [sharePostURL, setSharePostURL] = useState("");
  const unique = (array) => {
    let isvisited = {};
    let newarray = [];

    array.forEach((ele) => {
      if (!isvisited[ele.picture]) {
        newarray.push(ele);
        isvisited[ele.picture] = true;
      }
    });
    return newarray;
  };
  const state = useSelector((state) => state);
  const [array, setarray] = useState([]);

  const [loading, setloading] = useState(false);

  const likefunction = (post, key) => {
    if (!likeLoading) {
      setlikeLoading(true);

      tempUserLikes.push({ username: username, postID: key });
      dispatch(updateLikesArray(username, key));
      let indexOflkesArray = likeCountArray.findIndex(
        (ele) => ele.username === username && ele.postID === post._id
      );
      if (indexOflkesArray < 0) {
        likeCountArray.push({ username: username, postID: post._id });
      } else {
        likeCountArray.splice(indexOflkesArray, 1);
      }

      //  let index=array.findIndex(ele=>ele.key==key);

      updatelikes({ username: username, id: post._id });
      setTimeout(() => {
        setlikeLoading(false);
      }, 400);
    }
  };
  const unlikefunction = (post, key) => {
    if (!likeLoading) {
      setlikeLoading(true);
      let indexTemp = tempUserLikes.findIndex(
        (ele) => ele.username === username && ele.postID === key
      );
      if (indexTemp >= 0) {
        tempUserLikes.splice(indexTemp, 1);
      }

      let indexOflkesArray = likeCountArray.findIndex(
        (ele) => ele.username === username && ele.postID === post._id
      );
      if (indexOflkesArray < 0) {
        likeCountArray.push({ username: username, postID: post._id });
      } else {
        likeCountArray.splice(indexOflkesArray, 1);
      }

      let likesArrayTemp = likesArray;
      let ind = likesArrayTemp.findIndex(
        (ele) => ele.username === username && ele.postID === key
      );
      if (ind >= 0) {
        likesArrayTemp.splice(ind, 1);
        dispatch(updateUnlikesArray(likesArrayTemp));
      }
      // let index=array.findIndex(ele=>ele.key==key);

      deletelike({ username: username, id: post._id });
      setTimeout(() => {
        setlikeLoading(false);
      }, 400);
    }
    //temp section
  };
  const PostsWraper = (post1, post2, otheruser="none") => {
    let newArray = [];

    let newpost = [...post1, ...post2];

    newpost = unique(newpost);

    let feedpos = state.feedposts.posts;

    feedpos = unique(feedpos);

    if (newpost.length === 0) sethasmore(false);
    newpost.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    newpost.forEach((ele) => {
      newArray.push({
        liked: ele.likes.find((elee) => elee.username === username),
        length: ele.likes.length,
      });
    });
    newpost = [...feedpos, ...newpost];

    let array1 = [...array, ...newArray];

    newpost = unique(newpost);
    newpost.forEach((ele) => {
      ele.likes.forEach((ele2) => {
        dispatch(updateLikesArray(ele2.username, ele._id));
      });
    });

    Feedposts(newpost, array1, otheruser, username, dispatch);
    console.log("this", newpost, array1, otheruser, username);
    setarray([...array, ...newArray]);

    setloading(false);
  };
  const getothers = (post1) => {
    let post2 = [];

    if (username) {
      getitem(username)
        .then((item) => {
          if (item.followers.length === 0 && item.following.length === 0) {
            PostsWraper(post1, []);
            return;
          }
          item?.following.map((ele) => {
            return getstoriesFromOthers(ele.username, dispatch);
          });
          getstories(username, dispatch);
          let otheruser = "";
          item?.following?.map((dat) => {
            let otherUsersLastcount = state.feedposts.otherUsersLastcount;

            getpostsforfeed(dat.username, otherUsersLastcount[dat.username], 3)
              .then((post) => {
                post2 = post;
                console.log(post2);
                getuser(dat.username).then((ele) =>{
                  post2.map((elee) => {
                    return (elee["pic"] = ele.profilepic);
                  })
                  otheruser = dat.username;
                  PostsWraper(post1, post2, otheruser);
                }
                );
                
              })
              .catch((err) => {
                console.log(err);
                setloading(false);
              });
            return 0;
          });
         
        })
        .catch((err) => console.log(err));
    } else {
     
      setloading(false);
    }
   
  };
  let post1 = [];

  const call_func = () => {
    if (username) {
      let otherUsersLastcount = state.feedposts.otherUsersLastcount;

      getpostsforfeed(username, otherUsersLastcount[username], 3).then(
        (res) => {
          post1 = res;

          getothers(post1);

          post1.map((ele) => {
            return (ele["pic"] = profilepic);
          });
        }
      );
    }
  };
  const addCommentFuncforContent = async (comment, post) => {
    let id = post._id;
    let profilePicture = post.pic;

    let com = await addcomment(id, username, comment, profilePicture);

    com.comments.sort((a, b) => new Date(b.date) - new Date(a.date));

    dispatch(updatepost(com));
  };
  const setcommentsfunc = ({ val, post }) => {
    element = document.querySelector("#infiniteScroll");
    setshowcomments({ val: val, post: post });
  };
  const copyToClipboardHandler = () => {
    if(!showAlert){
      navigator.clipboard.writeText(sharePostURL);
      Alert.success("Link Copyied", {
        onOpen: () => {
          setShowAlert(false);
        },
        onClose: () => {
          setShowAlert(true);
        },
      });
    }
  };

  useEffect(() => {
    if (!isUnmounted) {
      if (state.feedposts.posts.length === 0) {
        setloading(true);

        call_func();
      }

      setarray(state.feedposts.array);
    }

    return () => setIsUnmounted(true);
  }, [
    username,
    isUnmounted,
    state.feedposts.array,
    state.feedposts.posts.length,
  ]);
  if (showcomments.val) disableBodyScroll(element);
  else if (element != null) enableBodyScroll(element);
  if (showProfile) {
    return (
      <div className={Styles.userprofilemain}>
        <span style={{ fontSize: "40px", color: "red" }}>
          <i
            onClick={() => setShowProfile(false)}
            styles={{ color: "Dodgerblue", cursor: "pointer" }}
            className="fa fa-times-circle"
          ></i>
        </span>

        <div className={Styles.userProfile}>
          <Search
            showprofilefromshowbar={showProfile}
            view={false}
            usernameformshowbar={userSearch}
          />
        </div>
      </div>
    );
  }
  if (loading === true) {
    return <ContentMainAnimate />;
  } else if (state.feedposts.posts.length === 0) {
    return (
      <div className={Styles.maincontentstart}>
        Seems like you are not following any one , please follow others to see
        their posts
      </div>
    );
  } else {
    return (
      <>
        {showShare ? (
          <div className={Styles.topshare}>
            <span style={{ color: "red" }}>
              <i
                onClick={() => setShowShare(false)}
                styles={{
                  color: "Dodgerblue",
                  cursor: "pointer",
                  boxShadow: "8px 9px 15px 10px #5050504d",
                }}
                className="fa fa-times-circle"
              ></i>
            </span>
            <div className={Styles.showshare}>
              <input disabled value={sharePostURL} />
              <button onClick={copyToClipboardHandler}>Copy link</button>
            </div>
          </div>
        ) : null}
 
     <div className={Styles.maincontent} id="infiniteScroll">
          {showcomments.val ? (
            <div className={Styles.commenttopdiv}>
            <Comments
              username={username}
              showcomments={showcomments}
              setcommentsfunc={setcommentsfunc}
            />
            </div>
          ) : null}
 
          <InfiniteScroll
            className={Styles.infi}
            dataLength={state.feedposts.posts.length}
            next={call_func}
            hasMore={hasMore}
            loader={<div className={Styles.loader}></div>}
            endMessage={
              <p className={Styles.infiP}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            {state?.feedposts.posts.map((post, key) => (
              <div key={post._id} className={Styles.singlecontainer}>
                <div
                  className={Styles.topdiv}
                  style={{ cursor: "pointer" }}
                  onClick={() =>{setUserSearch(post.username); setShowProfile(true);}}
                >
                  <Suspense fallback={<FluidLoaderFive />}>
                    <img
                      src={
                        post.pic
                          ? post.pic
                          : process.env.PUBLIC_URL + "/userImage.png"
                      }
                      alt=""
                    />
                  </Suspense>
                  <h5 className={Styles.usernamediv}>{post.username}</h5>
                </div>
                <button className={Styles.imgdiv}>
                  <Suspense fallback={<FluidLoaderFive />}>
                    <SuspenseImg alt="" src={post.picture} />
                  </Suspense>
                </button>
                <div className={Styles.bottomdiv}>
                  {likesArray.findIndex(
                    (ele) =>
                      ele.username === username && ele.postID === post._id
                  ) >= 0 ? (
                    <div>
                            <span
                        style={{
                          color:"red",
                       
                          cursor: "pointer",
                        }}
                      >
                        <i
                          onClick={() => unlikefunction(post, post._id)}
                          styles={{
                            color: "Dodgerblue",
                            cursor: "pointer",
                            boxShadow: "8px 9px 15px 10px #5050504d",
                          }}
                          className="fa fa-heart"
                          aria-hidden="true"
                        ></i>
                      </span>
                 {" "}
                      {likeCountArray.findIndex(
                        (ele) =>
                          ele.username === username && ele.postID === post._id
                      ) >= 0
                        ? post.likes.length + 1
                        : post.likes.length}
                    </div>
                  ) : (
                    <div>
                      <span
                        style={{
                          color:"grey",
                        
                          cursor: "pointer",
                        }}
                      >
                        <i
                          onClick={() => likefunction(post, post._id)}
                          styles={{
                            color: "Dodgerblue",
                            cursor: "pointer",
                            boxShadow: "8px 9px 15px 10px #5050504d",
                          }}
                          className="fa fa-heart"
                          aria-hidden="true"
                        ></i>
                      </span>{" "}
                      {likeCountArray.findIndex(
                        (ele) =>
                          ele.username === username && ele.postID === post._id
                      ) >= 0
                        ? post.likes.length - 1
                        : post.likes.length}
                    </div>
                  )}
                  <div>
                    <span
                      style={{
                        color: "black",
                       
                        cursor: "pointer",
                      }}
                    >
                      <i
                        onClick={() =>
                          setcommentsfunc({ val: true, post: post })
                        }
                        styles={{
                          color: "Dodgerblue",
                          cursor: "pointer",
                          boxShadow: "8px 9px 15px 10px #5050504d",
                        }}
                        className="far fa-comment-alt"
                        aria-hidden="true"
                      ></i>
                    </span>
                    {post?.comments?.length}
                  </div>
                  <span
                    style={{
                      color: "lightgreen",
                  
                      cursor: "pointer",
                    }}
                  >
                    <i
                      onClick={() => {
                        setSharePostURL(`${CURURL}/post/${post._id}`);
                        setShowShare(true);
                      }}
                      styles={{
                        color: "Dodgerblue",
                        cursor: "pointer",
                        boxShadow: "8px 9px 15px 10px #5050504d",
                      }}
                      className="fa fa-share-alt"
                      aria-hidden="true"
                    ></i>
                  </span>
                </div>
                <div
                  style={post.desc !== "" ? { padding: "3%" } : {}}
                  className={Styles.caption}
                >
                  {post.desc}
                </div>
                <Addcomment
                  addCommentFunc={(comment) =>
                    addCommentFuncforContent(comment, post)
                  }
                />
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </>
    );
  }
};
export default Contentmain;
