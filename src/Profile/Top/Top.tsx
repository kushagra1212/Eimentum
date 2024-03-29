import { useDispatch, useSelector } from 'react-redux';
import Addpost from './post/Addpost';
import { useEffect, useState } from 'react';

import Editprofile from './Editprofile';
import Topprofile from './Topprofile';
import axiosInstance from '../../Errors/httpInterceptor';
import { API_END_POINT } from '../../utils/constants/env';
const URL = API_END_POINT;
const Top = ({ setposthand, setshowfollowershandle, setshowfollowinghandle, preview }) => {
  let {
    username,
    name,
    profilepic,

    bio,
  } = useSelector((state) => {
    return state.user;
  });
  const { postcount } = useSelector((state) => state.count);

  const [img, setimg] = useState(null);
  const [edit, setedit] = useState(false);
  const [post, setpost] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);
  const [pic, setprofpic] = useState(profilepic);
  const dispatch = useDispatch();
  const { followerscount, followingcount } = useSelector((state) => state.count);

  const edit_it = () => {
    setedit(!edit);
  };
  useEffect(() => {
    if (!isUnmounted) {
    }
    return () => {
      setIsUnmounted(true);
    };
  }, [edit, isUnmounted]);
  const logouthandle = () => {
    axiosInstance
      .post(`${URL}/auth/logout`, {}, { withCredentials: true })
      .then((res) => {
        // console.log(res);

        dispatch({ type: 'access', payload: false });
        sessionStorage.clear();
        window.location.href = '/';
      })
      .catch((err) => console.log(err));
  };
  const setprofpichandle = (pic) => {
    setprofpic(pic);
  };
  const setposthandle = () => {
    setpost(!post);
    setposthand(true);
  };

  return (
    <>
      {!post ? (
        edit ? (
          <Editprofile setprofpichandle={setprofpichandle} edit_it={edit_it} />
        ) : (
          <Topprofile
            name={name}
            edit_it={edit_it}
            logouthandle={logouthandle}
            img={img}
            username={username}
            bio={bio}
            postsnumber={postcount}
            setposthandle={setposthandle}
            setshowfollowershandle={setshowfollowershandle}
            setshowfollowinghandle={setshowfollowinghandle}
          />
        )
      ) : (
        <Addpost setposthandle={setposthandle} />
      )}
    </>
  );
};

export default Top;
