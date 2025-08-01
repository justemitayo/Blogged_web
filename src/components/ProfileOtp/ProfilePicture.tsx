import React,{useState , useRef} from 'react'
import './ProfilePicture.css'
import { no_double_clicks } from '../../utils/no_double_click/no_double_clicks';
import back from '../../Assets/icon/Back_Arrow.png'
import image from '../../Assets/svg/image.svg'
import picture from '../../Assets/icon/default_user_dp_light.jpg'
import { useUserInfoStore } from '../../store/User_Info.store';
import { useMutation } from '@tanstack/react-query';
import { sign_up } from '../../config/hook/user/User';
import { error_handler } from '../../utils/Error_Handler/Error_Handler';
import { useNavigate } from 'react-router-dom';
import { saveString } from '../../config/domain/Storage';
import { strings } from '../../config/domain/Strings';
import { query_id } from '../../config/hook/Query_ID/Query_ID';



interface props{
  setStep: React.Dispatch<React.SetStateAction<"signup" | "pic" | "otp">>
  email: string;
  password:string;
  username: string
}

const ProfilePicture = ({ setStep, email, password, username}:props) => {

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [disableButton, setDisableButton] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const navigate = useNavigate();
    // Reference to the hidden file input
    const fileInputRef = useRef<HTMLInputElement | null>(null);

  const setUserInfo = useUserInfoStore().set_user_info

    // const { mutate: update_dp_mutate } = useMutation({
    //   mutationFn: update_display_picture,
    //   onMutate: () => {
    //     setDisableButton(true);
    //     setShowSpinner(true);
    //   },
    //   onSettled: async (data) => {
    //     setDisableButton(false);
    //     setShowSpinner(false);
    //     if (data?.error) {
    //       error_handler({ 
    //         navigate,
    //         error_mssg: data?.data });
    //     } else {
    //       queryClient.invalidateQueries({
    //         queryKey: query_id({ id: user_info.uid }).user_with_id,
    //       });
    //       setStep('otp')
    //     }
    //   }
    // });
    const { mutate: sign_up_mutate } = useMutation({
      mutationFn: sign_up,
      onMutate: () => {
        setDisableButton(true);
        setShowSpinner(true);
      },
      onSettled: async (data) => {
        setDisableButton(false);
        setShowSpinner(false);
    
        if (data?.error) {
          error_handler({
            navigate,
            error_mssg: data.data,
          });
        } else {
          const { token, uid, email_v } = data?.data;
    
          // Save to localStorage
          await saveString(strings.userToken, token);
    
          // Update global store
          setUserInfo({ token, uid, email_v });
    
          // Proceed to OTP step
          navigate('/otp')
        }
      },
    });
    


  const profileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChooseClick = no_double_clicks({
    execFunc: () => {
      fileInputRef.current?.click(); // Trigger the file dialog
    }
  })


  const handleRemove = no_double_clicks({
    execFunc: () => {
      setProfilePicture(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear file input
      }
    }
  });

  // const handleUpload = no_double_clicks({
  //   execFunc: () => {
  //     if (!profilePicture) return;
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       update_dp_mutate({
  //         displayPicture: reader.result as string,
  //         user_token: user_info.token || '',
  //       });
  //     };
  //     reader.readAsDataURL(profilePicture);
  //   }
  // });

  const submitSignUp = no_double_clicks({
    execFunc: () => {
      if (!profilePicture) return;
  
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        sign_up_mutate({
          email,
          username,
          password,
          displayPicture: base64String, // now a string
        });
      };
  
      reader.readAsDataURL(profilePicture); // Convert image to base64
    },
  });
  

  return (
    <div className='profile-picture'>
         {showSpinner && <p className="spinner">Uploading...</p>}
      <div className='backspace'>
        <img alt='' src={back} onClick={() => navigate(-1)} style={{width:'1.25rem', height:'1.25rem'}}/>
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
        <button className='profile-button' onClick={submitSignUp} disabled={disableButton || !profilePicture}>Register</button>

      </div>
    </div>
  )
}

export default ProfilePicture