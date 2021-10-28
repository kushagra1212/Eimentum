import Styles from "./Box.module.css";
import getuser from "../../methods/getuser";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import VerticalLoader from "../../Animation/Loader/loader/VerticalLoader";
import {
  setconversationID,
  setUserPicture,
} from "../../reduces/actions/MessageReducerAction";

const List = ({ chatuser, conversationID }) => {
  const [user, setuser] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      const User = await getuser(chatuser);

      setuser(User);
    };
    getUser(chatuser);
  }, [chatuser]);
  if (user === null) {
    return (
      <div styles={{ height: "10px" }} className={Styles.listitem}>
        <VerticalLoader />
      </div>
    );
  }
  const showmessages = () => {
    dispatch({ type: "SETUSERCONVERSATION", payload: user });
    dispatch(setconversationID(conversationID));
    let userPicture= user.profilepic
    ? user.profilepic
    : `${process.env.PUBLIC_URL}/userImage.png`;
    dispatch(setUserPicture(userPicture));
    if (window.screen.width < 768)
      dispatch({ type: "SHOWBOX", payload: false });
  };
  return (
    <div className={Styles.listitem} onClick={showmessages}>
      <div className={Styles.userimg}>
        <img
          src={
            user.profilepic
              ? user.profilepic
              : `${process.env.PUBLIC_URL}/userImage.png`
          }
          alt=""
        />
      </div>
      <div className={Styles.usernamediv}>
        <label style={{ fontWeight: "600" }}>{chatuser} </label>
        <label style={{ fontSize: "0.7em" }}>{user?.bio}</label>
      </div>
    </div>
  );
};

const Box = ({ conversations, username }) => {
  if (conversations != null && conversations.length === 0) {
    return (
      <div
        className={Styles.maindiv}
        style={{
          color: "black",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2em",
        }}
      >
        You have no conversation
        <h6>Please Follow your friends</h6>
      </div>
    );
  }
  return (
    <div className={Styles.maindiv}>
      <div className={Styles.list}>
        <h2 style={{ marginLeft: "10%", opacity: "0.6" }}>Messages</h2>
        {conversations?.map((element, id) => {
          return (
            <List
              key={element._id}
              conversationID={element._id}
              chatuser={
                element.members[0] === username
                  ? element.members[1]
                  : element.members[0]
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export default Box;
