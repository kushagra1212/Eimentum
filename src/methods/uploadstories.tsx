import axios from 'axios';
import {
  UPLOAD_STORIES,
  GET_STORIES,
  GET_STORIES_FROM_OTHERS,
} from '../reduces/actions/StoriesAction';
import { API_END_POINT } from '../utils/constants/env';
const URL = API_END_POINT;

export const uploadstories = (username, picture, profilepic, dispatch) => {
  return new Promise((resolve, reject) => {
    if (username) {
      axios
        .post(`${URL}/stories/uploadstories`, {
          username: username,
          picture: picture,
          profilepic: profilepic,
        })
        .then((res) => {
          if (res.data) {
            dispatch(UPLOAD_STORIES(res.data));

            resolve(res);
          } else {
            reject('err');
          }
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
};
export const getstories = async (username, dispatch) => {
  try {
    const res = await axios.get(`${URL}/stories/getstories?username=${username}`);
    if (res.data) {
      dispatch(GET_STORIES(res.data));
    }
  } catch (err) {
    console.log(err);
  }
};
export const getstoriesFromOthers = async (username, dispatch) => {
  try {
    const res = await axios.get(`${URL}/stories/getstories?username=${username}`);
    if (res.data) {
      if (res.data.length >= 1) await dispatch(GET_STORIES_FROM_OTHERS(username, res.data));
    }
  } catch (err) {
    console.log(err);
  }
};
