import { useDispatch, useSelector } from "react-redux";
import FileBase64 from "react-file-base64";
import axios from "axios";
import { useAlert } from "react-alert";
import { useRef, useState } from "react";
import {useSpring,animated} from "react-spring";
import Styles from "./Editprofile.module.css";
import Cropper from "react-easy-crop";
const URL = process.env.REACT_APP_URL;
const Editprofile = ({ edit_it, setprofpichandle }) => {
  const Alert = useAlert();
  const Refinput=useRef();
  const dispatch = useDispatch();
  const { username, email, profilepic, _id, bio } = useSelector(
    (state) => state.user
  );

  const [newemail, setnewemail] = useState(email);
  const [newusername, setnewusername] = useState(username);
  const [loading, setloading] = useState(false);
  const [selectedFile,setSelectedFile]=useState(null);
  const [pic,setPic]=useState(profilepic);
  const [newbio, setnewbio] = useState(bio);
  const [image, setImage] = useState(null);
	const [croppedArea, setCroppedArea] = useState(null);
	const [crop, setCrop] =useState({ x: 0, y: 0 });

  const save_it = async (e) => {
    setloading(true);
    try {
      const data=new FormData(e.target);
      data.append('file',selectedFile);
      console.log(selectedFile);
    
      const res = await axios.patch(`${URL}/upload/updateuser`,data, 
    { params:{
        email: newemail,
        username: newusername,
        _id: _id,
        profilepic: pic,
        bio: newbio,
      }});
      if (res) {
  
        setprofpichandle(pic);
        setloading(false);

        dispatch({
          type: "UPDATE_USER",
          payload: {
            email: newemail,
            username: newusername,
            profilepic: pic,
            bio: newbio,
          },
        });

        edit_it();
      } else console.log("err");
    } catch (err) {
      console.log(err);

  
      Alert.show("Bio word limit 80 😀 ");
      setTimeout(() => {
        setloading(false);
        edit_it();
      }, 50);
    }
  }
  const selectedFileHandle=(e)=>{
  e.preventDefault();

    const reader=new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.addEventListener("load",()=>{
      setImage(reader.result);
   
    })
 
      console.log(e.target.files[0]);
    //   setSelectedFile(e.target.files[0]);
        // setPic(global.URL.createObjectURL(e.target.files[0]));

  }
 
const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
  setCroppedArea(croppedAreaPixels);

};
const createImage = (url) =>
	new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.addEventListener("error", (error) => reject(error));
		image.src = url;
	});

  //-----
  // I don't know properly how canvas works but I understood this code that's why i added it here
 const  getCroppedImg=async(imageSrc, pixelCrop)=> {
   
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
  
    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));
  
    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx.translate(safeArea / 2, safeArea / 2);
 
    ctx.translate(-safeArea / 2, -safeArea / 2);
 
    ctx.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5
    );
  
    const data = ctx.getImageData(0, 0, safeArea, safeArea);
  

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
  

    ctx.putImageData(
      data,
      0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
      0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
    );
  
  
    return canvas;
  }
  const generateDownload = async (imageSrc, crop) => {
    if (!crop || !imageSrc) {
      return;
    }
  
    const canvas = await getCroppedImg(imageSrc, crop);

    canvas.toBlob(
      (blob) => {
  

        const previewUrl = window.URL.createObjectURL(blob);
    
        const anchor = document.createElement("a");
        anchor.download = "image.png";
        anchor.href = window.URL.createObjectURL(blob);
    
        setPic(anchor.href);
  
        window.URL.revokeObjectURL(previewUrl);
        console.log(blob)
        setSelectedFile(blob);
        setImage(null);
      },
      "image/png",
      0.66
    );
  };

const openChoosefile=()=>{
    Refinput.current.click();
}

  const floatDown = useSpring({
    
    from: { y:"-100%"},
   y: "-50%",x:"-50%" ,
   
    config: { mass: 10, tension: 10, friction: 1,duration:200 },
  });

  if (loading) {
    return (
      <div>
        <div className={Styles.loader}></div>
      </div>
    );
  }else if(image){
 
    return (	<div className={Styles.cropdiv}>
      <div className={Styles.cropper}>
        <Cropper
          image={image}
          crop={crop}
     
          aspect={1}
          onCropChange={setCrop}
  
          onCropComplete={onCropComplete}
        />
  
  </div>

    <button className={Styles.cropbut} type="button" onClick={()=>generateDownload(image,croppedArea)}    > Crop</button>
    <button className={Styles.reselect} onClick={()=>setImage(null)} >Reselect</button>

    </div>)

    
  }
  else {
    return (
  <>
      <animated.form onSubmit={(e)=>save_it(e)} className={Styles.editprofile} style={floatDown}>
        <button className={Styles.backbut} type="button" onClick={edit_it}>
          BACK
        </button>
        {pic?<img className={Styles.editimg} src={pic?pic:process.env.PUBLIC_URL+'/userImage.png'} alt=""/>:null}
     
                          
         <input style={{display:"none"}}  type="file" ref={Refinput}  onChange={selectedFileHandle}/>

         <button className={Styles.choosebutton} type="button" onClick={openChoosefile} >choose file</button>
    
         <label className={Styles.editlabel} >Email</label>
        <input onChange={(e) => setnewemail(e.target.value)} value={newemail} />
       <label className={Styles.editlabel}  >User Name</label>
        <input
          onChange={(e) => setnewusername(e.target.value)}
          value={newusername}
        />
         <label className={Styles.editlabel} >Bio</label>
        <input onChange={(e) => setnewbio(e.target.value)} value={newbio} />
        <button type="submit" className={Styles.savebut} >
          save
        </button>
      </animated.form>
      </>
    );
  }
};
export default Editprofile;
