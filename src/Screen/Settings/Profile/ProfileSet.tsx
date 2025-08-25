import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useUserInfoStore } from '../../../store/User_Info.store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { update_display_picture } from '../../../config/hook';
import { error_handler } from '../../../utils/Error_Handler/Error_Handler';
import { query_id } from '../../../config/hook/Query_ID/Query_ID';
import { info_handler } from '../../../utils/Info_Handler/Info_Handler';
import { no_double_clicks } from '../../../utils/no_double_click/no_double_clicks';
import image from '../../../Assets/svg/image.svg'
import back from '../../../Assets/icon/Back_Arrow.png'
import picture from '../../../Assets/icon/default_user_dp_light.jpg'

const ProfileSet = () => {
  const [disableButton, setDisableButton] = useState<boolean>(false);
const [preview, setPreview] = useState<string | null>(null);
const [showSpinner, setShowSpinner] = useState(false);
const navigate = useNavigate();

const user_info = useUserInfoStore().user_info;
const queryClient = useQueryClient();

    const update_dp_mutate  = useMutation({
      mutationFn: update_display_picture,
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
            error_mssg: data?.data });
        } else {
          if (!user_info) return;
          queryClient.invalidateQueries({
            queryKey: query_id({ id: user_info.uid }).user_with_id,
          });
          info_handler({
            navigate,
            proceed_type: 3,
            hide_back_btn: true,
            hide_header: false,
            success_mssg: 'Display Picture Updated!',
        });
        }
      }
    });

  // Reference to the hidden file input
const fileInputRef = useRef<HTMLInputElement | null>(null);

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => {
      const err = new Error("File reading failed");
      reject(err);
      error_handler({
        navigate,
        error_mssg: err.message,
      });
    };
  });
}


const profileChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const base64 = await fileToBase64(file); // Convert to Base64
    setPreview(base64); // Store Base64 for preview
  }
};

const handleChooseClick = no_double_clicks({
  execFunc: () => {
    fileInputRef.current?.click(); // Trigger the file dialog
  }
})


const handleRemove = no_double_clicks({
  execFunc: () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear file input
    }
  }
});

const upload_data = no_double_clicks({
  execFunc: () => {
      update_dp_mutate.mutate({
          displayPicture: preview ?? '' ,
          user_token: user_info?.token!,
      });
  },
});

  return (
    <div className='profile-picture'>
    {showSpinner &&         <div className="overlay-spinner">
     <div className="spinner" />
     <p>Uploading...</p>
   </div>}
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
   <button className='profile-button' onClick={upload_data} disabled={disableButton}>Upload</button>

 </div>
</div>
  )
}

export default ProfileSet