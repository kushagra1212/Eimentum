import Styles from "./Box.module.css";
import getuser from "../../methods/getuser";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import VerticalLoader from "../../Animation/Loader/loader/VerticalLoader";
import { setconversationID } from "../../reduces/actions/MessageReducerAction";
const List = ({ chatuser,conversationID }) => {
  const [user, setuser] = useState(null);
  const dispatch=useDispatch();
  const getUser = async () => {
    const User = await getuser(chatuser);

    setuser(User);
  };
  useEffect(() => {
    getUser(chatuser);
  }, [chatuser]);
  if (user === null) {
    return (
      <div styles={{ height: "10px" }} className={Styles.listitem}>
        <VerticalLoader />
      </div>
    );
  }
  const showmessages=()=>{
  
    
     dispatch(setconversationID(conversationID));
     dispatch({type:"SHOWBOX",payload:false});
  }
  return (
    <div className={Styles.listitem} onClick={showmessages}>
      <div className={Styles.userimg}>
        <img
          src={
            user.profilepic
              ? user.profilepic
              : process.env.PUBLIC_URL + "/messageicon.png"
          }
          alt=""
        />
      </div>
      <div className={Styles.usernamediv}>
        <label>{chatuser} </label>
      </div>
    </div>
  );
};

const Box = ({ conversations, username }) => {
  return (
    <div className={Styles.maindiv}>
      <div className={Styles.list}>
        {conversations?.map((element, id) => {
          return (
            <List
              
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