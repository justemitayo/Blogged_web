import React, { useState } from 'react'
import { useUserInfoStore } from '../../../store/User_Info.store';
import { useMutation } from '@tanstack/react-query';
import { change_password } from '../../../config/hook';
import { error_handler } from '../../../utils/Error_Handler/Error_Handler';
import { info_handler } from '../../../utils/Info_Handler/Info_Handler';
import { no_double_clicks } from '../../../utils/no_double_click/no_double_clicks';
import { useNavigate } from 'react-router-dom';
import back from '../../../Assets/icon/Back_Arrow.png'

const Password = () => {

  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newCPassword, setNewCPassword] = useState<string>('');
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [disableButton, setDisableButton] = useState<boolean>(false);

  const user_info = useUserInfoStore().user_info;
  const navigate = useNavigate()

  const  change_password_mutate = useMutation({

    mutationFn: change_password,

    onMutate: () => {
        setDisableButton(true);
        setShowSpinner(true);
    },
    onSettled: async data => {
        setDisableButton(false);
        setShowSpinner(false);
        if (data?.error) {
            error_handler({
                navigate,
                error_mssg: data?.data,
            });
        } else {
            setOldPassword('');
            setNewPassword('');
            setNewCPassword('');
            info_handler({
                navigate,
                proceed_type: 3,
                hide_back_btn: true,
                hide_header: false,
                success_mssg: 'Password changed Successfully!',
            });
        }
    },
});

const change_password_func = no_double_clicks({
  execFunc: async () => {
      if (oldPassword && newPassword && newCPassword) {
          if (newPassword?.length >= 6) {
              if (newPassword === newCPassword) {
                  change_password_mutate.mutate({
                      oldPassword: oldPassword,
                      newPassword: newPassword,
                      user_token: user_info?.token!,
                  });
              } else {
                  error_handler({
                      navigate,
                      error_mssg: 'Passwords do not match!',
                  });
              }
          } else {
              error_handler({
                  navigate,
                  error_mssg: 'Password cannot be less than six!',
              });
          }
      } else {
          error_handler({
              navigate,
              error_mssg: 'Fields cannot be empty!',
          });
      }
  },
});

  return (
    <div className="fp-main">


    <div className="fp-back">
      <div className='backspace'>
        <img alt='' src={back} onClick={() => navigate(-1)} style={{width:'1.5rem', height:'1.5rem'}}/>
      </div>
    </div>
    {showSpinner &&
                  <div className="overlay-spinner">
                  <div className="spinner" />
                  <p>Loading...</p>
                </div>}
    <h1 className="fp-title">Create New Password</h1>
    <p className="fp-subtitle">
    Your new password must be unique from those previously used.
    </p>

    {/* Textarea for feedback */}
    <input
      className="fp-input"
      type='password'
      placeholder="Enter your old password..."
      value={oldPassword}
      onChange={(e) => setOldPassword(e.target.value)}
      autoFocus
    />
    <input
      className="fp-input"
      type='password'
      placeholder="Enter a new password..."
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
    />
    <input
      className="fp-input"
      type='password'
      placeholder="Confirm your new password..."
      value={newCPassword}
      onChange={(e) => setNewCPassword(e.target.value)}
     
    />


    {/* Button at bottom */}
    <div className="fp-button-wrapper">
      <button
        className="fp-button"
        onClick={change_password_func}
        disabled={disableButton}
      >
        {disableButton ? "Updating..." : "Reset Password"}
      </button>
    </div>
  </div>
  )
}

export default Password