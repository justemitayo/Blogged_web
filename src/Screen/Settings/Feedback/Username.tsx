import React, { useState } from 'react'
import { update_username } from '../../../config/hook';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserInfoStore } from '../../../store/User_Info.store';
import { useUserDataStore } from '../../../store/User_Data.store';
import { useNavigate } from 'react-router-dom';
import { error_handler } from '../../../utils/Error_Handler/Error_Handler';
import { query_id } from '../../../config/hook/Query_ID/Query_ID';
import { INTF_UserData } from '../../../Interface/User_Data';
import { info_handler } from '../../../utils/Info_Handler/Info_Handler';
import { no_double_clicks } from '../../../utils/no_double_click/no_double_clicks';
import back from '../../../Assets/icon/Back_Arrow.png'

const Username = () => {

const queryClient = useQueryClient();
const navigate = useNavigate();
const update_user_name = useUserDataStore().update_user_name;
const user_info = useUserInfoStore().user_info

const [username, setUsername] = useState<string>('');
const [showSpinner, setShowSpinner] = useState<boolean>(false);
const [disableButton, setDisableButton] = useState<boolean>(false);

const  update_username_mutate= useMutation({
  mutationFn: update_username,
  onMutate: () => {
    setDisableButton(true);
    setShowSpinner(true);
  }, 
  onSuccess: async(data) => {
    setDisableButton(false);
    setShowSpinner(false);
    if (data?.error) {
      queryClient.resumePausedMutations();
      error_handler({
          navigate,
          error_mssg: data?.data,
      });
    } else {
      update_user_name(username);
      await queryClient.cancelQueries({  queryKey: query_id({ id:user_info?.uid }).user_with_id, });

      const old_data = queryClient.getQueryData<{data: INTF_UserData, error: boolean}>(query_id({ id: user_info?.uid }).user_with_id);

      if (old_data) {
        const new_data = {
          ...old_data,
          data: {
            ...old_data.data,
            username:username
          },
        };
        queryClient.setQueryData(query_id({ id: user_info?.uid }).user_with_id, {
          error: false,
          data: new_data,
        });
      }
      queryClient.resumePausedMutations();
      setUsername('');
      info_handler({
          navigate,
          proceed_type: 3,
          hide_back_btn: true,
          hide_header: false,
          success_mssg: 'Username changed Successfully!',
      });
    }
  }
})


const update_username_func = no_double_clicks({
  execFunc: () => {
    if (!user_info) return; 
      if (username) {
          update_username_mutate.mutate({
              user_token:user_info.token!,
              username: username,
          });
      } else {
          error_handler({
              navigate,
              error_mssg: 'Username field cannot be empty!',
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
                  <p>Updating...</p>
                </div>}
    <h1 className="fp-title">Update your Username</h1>
    <p className="fp-subtitle">
    Please enter a new Username below and click 'Update Username' to apply the change.
    </p>

    {/* Textarea for feedback */}
    <textarea
      className="fp-input"
      placeholder="Enter a new Username..."
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      autoFocus
    />

    {/* Button at bottom */}
    <div className="fp-button-wrapper">
      <button
        className="fp-button"
        onClick={update_username_func}
        disabled={disableButton}
      >
        {disableButton ? "Updating..." : "Update Username"}
      </button>
    </div>
  </div>
  )
}

export default Username