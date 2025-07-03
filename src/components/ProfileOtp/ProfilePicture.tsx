import React,{useState , useRef} from 'react'
import './ProfilePicture.css'
import back from '../../Assets/icon/Back_Arrow.png'
import image from '../../Assets/svg/image.svg'
import picture from '../../Assets/icon/default_user_dp_light.jpg'


interface props{
  setCurrState:React.Dispatch<React.SetStateAction<"Login" | "signup" | "pass">>;
}

const ProfilePicture = ({setCurrState}:props) => {

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

    // Reference to the hidden file input
    const fileInputRef = useRef<HTMLInputElement | null>(null);


  const profileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChooseClick = () => {
    fileInputRef.current?.click(); // Trigger the file dialog
  };

  const handleRemove = () => {
    setProfilePicture(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear file input
    }
  };

  return (
    <div className='profile-picture'>
      <div className='backspace'>
        <img alt='' src={back} onClick={() => setCurrState('signup')} style={{width:'1.25rem', height:'1.25rem'}}/>
      </div>
      <div className='profile-picture-component'>
        <h4>Select a Display Picture to Proceed</h4>
        <span>Select an Image for your Display Picture. Press 'x' to clear your Display Picture</span>
        <div className='register-picture'>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={profileChange} style={{display:'none'}}/>
          <img src={preview ? preview : picture} alt="Preview"  />
        </div>
        <div className='profile-picture-footer'>
          <div style={{width:'50px', height:'50px', borderRadius:'50%', border:'2px solid black', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}>
            <img alt='' onClick={handleChooseClick} src={image} />
          </div>
          <div style={{width:'50px', height:'50px', borderRadius:'50%', border:'2px solid black', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}>
            <button onClick={handleRemove} disabled={!preview} style={{background:'none', border:'none', fontSize:'2rem', color:'black'}}>x</button>
          </div>
        </div>
        <button className='profile-button'>Register</button>

      </div>
    </div>
  )
}

export default ProfilePicture