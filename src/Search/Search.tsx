import { useEffect, useState } from 'react';
import User from './Searchuser/User';
import { useDispatch, useSelector } from 'react-redux';
import Profile from '../Profile/Profile';
import Styles from './Search.module.css';
import verifiesusers from '../methods/verifiesusers';
import SuggestionList from '../components/suggestionlist/SuggestionList';
import getpartialusers from '../methods/getpartialusers';
import getuser from '../methods/getuser';
import axiosInstance from '../Errors/httpInterceptor';
import { PUBLIC_URL, API_END_POINT } from '../utils/constants/env';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserAstronaut } from '@fortawesome/free-solid-svg-icons';
const URL = API_END_POINT;
let count = 0;
const Search = ({ showprofilefromshowbar, usernameformshowbar, view, preview }) => {
  const [searchuser, setsearchuser] = useState('');
  const [user, setuser] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setloading] = useState(false);
  const [found, setfound] = useState({ found: false, text: '' });

  const [showprofile, setshowprofile] = useState(false);
  const { username } = useSelector((state) => state.user);
  const [postcount, setpostcount] = useState(null);
  const [followerscount, setfollowerscount] = useState(null);
  const [followingcount, setfollowingcount] = useState(null);
  const [following, setfollowing] = useState(null);
  const [showfollowers, setshowfollowers] = useState(false);
  const [showfollowing, setshowfollowing] = useState(false);
  const [showlist, setshowlist] = useState(true);
  const [isUnmounted, setUnmounted] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const dispatch = useDispatch();
  const setfollowingfunc = (value) => {
    setfollowing(value);
  };

  const getcounts = async (u) => {
    try {
      await axiosInstance.patch(`${URL}/count/updatefollowerscount`, {
        username: u.username,
      });
      const res2 = await axiosInstance.patch(`${URL}/count/updatefollowingcount`, {
        username: u.username,
      });
      if (res2.data) {
        setpostcount(res2.data.postcount);
        setfollowerscount(res2.data.followerscount);
        setfollowingcount(res2.data.followingcount);
        setshowprofile(true);
        setshowlist(false);

        setloading(false);
        setLoading2(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const showuserprofilehandle = (u) => {
    setloading(true);
    setuser(u);
    getcounts(u);
  };
  const searchuserhandle = (username) => {
    if (username === '' || username.length > 10) {
      setloading(false);
      setUsers([]);
      return;
    }

    setloading(true);
    getpartialusers(username)
      .then((us) => {
        setUsers(us);

        setfound({ found: true, text: '' });
        setloading(false);
      })
      .catch((err) => {
        setfound({ found: false, text: 'user not found' });
        setloading(false);
      });

    // setfound({ found: false, text: "user not found" });
  };
  useEffect(() => {
    if (showprofilefromshowbar) {
      setshowlist(false);
      setloading(true);

      setsearchuser(usernameformshowbar);

      getuser(usernameformshowbar).then((u) => {
        showuserprofilehandle(u);
      });
      count++;
    }
  }, [showprofilefromshowbar]);

  const setshowfollowershandle = (val) => {
    setshowfollowers(val);
  };
  const setshowfollowinghandle = (value) => {
    setshowfollowing(value);
  };
  const setShowProfileHandler = (val) => {};
  const setUserSearchHandler = (val) => {
    setsearchuser(val);
    searchuserhandle(val);
  };
  useEffect(() => {
    dispatch({ type: 'SHOWSEARCH', payload: true });
    if (!isUnmounted) {
      let usernameofsender = searchuser;

      verifiesusers(setfollowingfunc, username, usernameofsender);
    }
    return () => setUnmounted(true);
  }, [searchuser, isUnmounted, username]);
  if (loading2) {
    return <div className={Styles.loader}></div>;
  }
  if (showprofilefromshowbar && !loading) {
    if (username === searchuser) {
      if (count >= 30) {
        count = 0;
        window.location.reload();
        return null;
      }
      count++;

      return (
        <div style={{ width: '100%', height: '100%', zIndex: 100 }}>
          <Profile preview={preview} />
        </div>
      );
    }
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <User
          profpic={user.profilepic}
          name={user.name}
          bio={user.bio}
          postsnumber={postcount}
          followerscount={followerscount}
          followingcount={followingcount}
          username={user.username}
          getcounts={getcounts}
          setshowfollowershandle={setshowfollowershandle}
          setshowfollowinghandle={setshowfollowinghandle}
          showfollowers={showfollowers}
          showfollowing={showfollowing}
        />
      </div>
    );
  } else if (showprofilefromshowbar && loading) {
    return <div className={Styles.loader}></div>;
  } else if (showlist === true) {
    return (
      <>
        <div className={Styles.maindiv2}>
          <div className={Styles.topsearchbar}>
            {view ? (
              <div className={Styles.searchbar}>
                <input
                  ref={(input) => input && input.focus()}
                  placeholder="Search Users Here..."
                  type="text"
                  value={searchuser}
                  onChange={(e) => {
                    setsearchuser(e.target.value.toLowerCase());
                    searchuserhandle(e.target.value.toLowerCase());
                  }}
                  required
                />

                <FontAwesomeIcon
                  icon={faSearch}
                  className={Styles.searchbtn}
                  size="2x"
                  onClick={() => (searchuser.length > 0 ? setshowprofile(true) : null)}
                />
              </div>
            ) : null}
          </div>
          <div className={Styles.userwrap}>
            {users?.map((u) => (
              <div
                key={u._id}
                className={Styles.userprofile}
                onClick={() => {
                  setLoading2(true);
                  showuserprofilehandle(u);
                }}
              >
                {u.profilepic ? (
                  <img alt="" src={u.profilepic} />
                ) : (
                  <FontAwesomeIcon icon={faUserAstronaut} size="2x" />
                )}
                <div>
                  <h6>@{u.username}</h6>
                  <h4>{u.name}</h4>
                </div>
                <button>Go to profile</button>
              </div>
            ))}
            {searchuser === '' && window.screen.width < 768 ? (
              <SuggestionList
                setShowProfileHandler={setShowProfileHandler}
                setUserSearchHandler={setUserSearchHandler}
              />
            ) : null}
            {loading ? (
              <div className={Styles.loader}></div>
            ) : searchuser !== '' && users.length === 0 ? (
              <div className={Styles.notfound}>
                <h2>No User Found</h2>
              </div>
            ) : null}
          </div>
        </div>
        {window.screen.width >= 768 ? (
          <div className={Styles.suggestionListWrap}>
            <SuggestionList
              setShowProfileHandler={setShowProfileHandler}
              setUserSearchHandler={setUserSearchHandler}
            />
          </div>
        ) : null}
      </>
    );
  } else if (showprofile) {
    if (
      username === user.username &&
      (showprofilefromshowbar === false || showprofilefromshowbar === undefined)
    ) {
      if (count >= 30) {
        window.location.reload();
        count = 0;
        return null;
      }
      count++;

      return (
        <div style={{ width: '100%', height: '100%' }}>
          <Profile preview={preview} />
        </div>
      );
    }

    return (
      <div style={{ width: '100%', height: '100%', zIndex: 100 }}>
        <User
          profpic={user.profilepic}
          name={user.name}
          bio={user.bio}
          postsnumber={postcount}
          followerscount={followerscount}
          followingcount={followingcount}
          username={user.username}
          getcounts={getcounts}
          setshowfollowershandle={setshowfollowershandle}
          setshowfollowinghandle={setshowfollowinghandle}
          showfollowers={showfollowers}
          showfollowing={showfollowing}
        />
      </div>
    );
  }
};

export default Search;
