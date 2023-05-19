import axiosInstance from '../Errors/httpInterceptor';

const URL = process.env.REACT_APP_URL;
export const getpostsforfeed = (username, lastcount, limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axiosInstance.get(
        `${URL}/post/getposts?username=${username}&last=${lastcount}&limit=${limit}`
      );
      // console.log(res.data);
      if (res.data) {
        resolve(res.data);
      } else {
        resolve([]);
      }
    } catch (err) {
      reject(err);
    }
  });
};
