import axios from 'axios'
const URL=process.env.REACT_APP_URL;
export const getpostsforfeed=async(username,lastcount)=>{
 console.log(username,lastcount,"get feed post")
  try{
    const res=await axios.get(`${URL}/post/getposts?username=${username}&last=${lastcount}&limit=2`);
    if(res.data)
    {
       console.log(res.data)
        return res.data;
    }else{
        return {msg:"not found"}
    }
  }catch(err)
  {
      console.log(err);
      return err;
  }

}