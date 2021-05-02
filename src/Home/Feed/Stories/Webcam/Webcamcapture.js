import Webcam from 'react-webcam';
import {useRef,useCallback,useState} from 'react';
import {useDispatch} from 'react-redux';
import {show_user_stories_handle, show_webcam_handle} from '../../../../reduces/actions/StoriesAction';
import Styles from './Webcamcapture.module.css';
import {uploadstories} from '../../../../methods/uploadstories';
const Webcamcapture=()=>{
    const [imagecaptured,setimagecaptured]=useState(null);
    const dispatch=useDispatch();
 const webcamRef=useRef(null);
const videoContraints={

    facingMode:"user"
};

const save_button_handle=()=>{
    dispatch(show_webcam_handle(false));   
     dispatch(show_user_stories_handle(false));
}

const capture=useCallback(()=>{
   const image=webcamRef.current.getScreenshot();
   setimagecaptured(image);
},[webcamRef])

return (
    <div className={Styles.maindiv} >
  
    {imagecaptured==null?<div className={Styles.webcamdiv} ><Webcam 
    audio={false}
    height="100%"
    ref={webcamRef}
    screenshotFormat="image/jpeg"
    width="100%"
    videoConstraints={videoContraints}
   
    />
    <button onClick={capture} className={Styles.capturebut} >Take Photo</button></div>:<div  className={Styles.webcamdiv} >
    <img className={Styles.imagecaptured}  src={imagecaptured} alt="NAN"  />
    <button onClick={()=>setimagecaptured(null)} className={Styles.capturebut} >Retake</button>
    <button onClick={save_button_handle}  >Save</button>
    </div>}
    </div>
)


}
export default Webcamcapture;