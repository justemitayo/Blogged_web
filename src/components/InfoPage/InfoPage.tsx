import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { delete_account, delete_blog } from '../../config/hook';
import { useUserInfoStore } from '../../store/User_Info.store';
import { useCurrentCommentsStore } from '../../store/Current_Comments';
import { error_handler } from '../../utils/Error_Handler/Error_Handler';
import { info_handler } from '../../utils/Info_Handler/Info_Handler';
import { no_double_clicks } from '../../utils/no_double_click/no_double_clicks';
import Lottie from 'lottie-react';
import successAnim from '../../Animations/On_Success.json';
import './InfoPage.css';

export default function InfoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const user_info = useUserInfoStore().user_info ;
  const  clear_user_info = useUserInfoStore().clear_user_info
  const  current_blog_id  = useCurrentCommentsStore().current_blog_id;

  const [disableButton, setDisableButton] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const proceed_type = location.state?.proceed_type || 1;
  const success_mssg = location.state?.success_mssg || '';
  const svr_success_mssg = location.state?.svr_success_mssg || '';
  const hide_back_btn = location.state?.hide_back_btn || false;
  const hide_header = location.state?.hide_header || false;

  const resetAll = () => {
    clear_user_info();
    queryClient.clear();
    navigate('/auth', { replace: true });
  };

  const { mutate: delete_account_mutate } = useMutation({
    mutationFn: delete_account,
    onMutate: () => {
      setDisableButton(true);
      setShowSpinner(true);
    },
    onSettled: (data) => {
      setDisableButton(false);
      setShowSpinner(false);
      if (data?.error) {
        error_handler({ navigate, error_mssg: data.data });
      } else {
        resetAll();
      }
    },
  });

  const { mutate: delete_blog_mutate } = useMutation({
    mutationFn: delete_blog,
    onMutate: () => {
      setDisableButton(true);
      setShowSpinner(true);
    },
    onSettled: (data) => {
      setDisableButton(false);
      setShowSpinner(false);
      if (data?.error) {
        error_handler({ navigate, error_mssg: data.data });
      } else {
        info_handler({
          navigate,
          hide_back_btn: true,
          success_mssg: 'Blog Post deleted Successfully!',
          proceed_type: 3,
          hide_header: false,
        });
      }
    },
  });

  const proceed = no_double_clicks({
    execFunc: () => {
      switch (proceed_type) {
        case 1:
          navigate('/auth', { replace: true });
          break;
        case 2:
          resetAll();
          break;
        case 3:
          navigate('/', { replace: true });
          break;
        case 4:
          delete_account_mutate({ user_token: user_info.token || ''});
          break;
        case 5:
          delete_blog_mutate({ user_token: user_info.token || '', blogID: current_blog_id  || ''});
          break;
        default:
          navigate('/auth', { replace: true });
          break;
      }
    },
  });

  return (
    <div className="info-page-container">
      {showSpinner && <p>loading...</p>}

      {!hide_back_btn && (
        <button className="back-button" onClick={() => navigate(-1)}>
          &larr; 
        </button>
      )}

      <div className="animation-container">
        <Lottie animationData={successAnim} loop autoplay />
      </div>

      {!hide_header && <h2 className="header-text">Successful!</h2>}

      <p className="message-text">{success_mssg}</p>

      {svr_success_mssg && <p className="server-message">{svr_success_mssg}</p>}

      <div className="button-wrapper">
        <button className='button' onClick={proceed} disabled={disableButton}>Proceed</button>

      
      </div>
    </div>
  );
}
