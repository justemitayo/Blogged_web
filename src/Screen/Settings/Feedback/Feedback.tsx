import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query';
import { post_feedback } from '../../../config/hook/Feedback/Feedback';
import { error_handler } from '../../../utils/Error_Handler/Error_Handler';
import { useNavigate  } from 'react-router-dom';
import { info_handler } from '../../../utils/Info_Handler/Info_Handler';
import { no_double_clicks } from '../../../utils/no_double_click/no_double_clicks';
import back from '../../../Assets/icon/Back_Arrow.png'
import './setting.css'
const Feedback = () => {

  const [feedback, setFeedback] = useState<string>('');
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const navigate = useNavigate()
  
  
  const post_feedback_mutate  = useMutation({
    mutationFn: post_feedback,
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
              error_mssg: data?.data,
          });
      } else {
        setFeedback('');
          info_handler({
              navigate,
              proceed_type: 3,
              hide_back_btn: true,
              hide_header: false,
              success_mssg: 'Review uploaded Successfully!',
          });
      }
  },
  });

  const post_feedback_func = no_double_clicks({
    execFunc: () => {
        if (feedback) {
            post_feedback_mutate.mutate({
                feedback: feedback,
            });
        } else {
            error_handler({
                navigate,
                error_mssg: 'Feedback field cannot be empty!',
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
    <h1 className="fp-title">Send a Feedback?</h1>
    <p className="fp-subtitle">
      Please enter your feedback or review below and click "Send Review" to
      upload your review.
    </p>

    {/* Textarea for feedback */}
    <textarea
      className="fp-input"
      placeholder="Enter your review here..."
      value={feedback}
      onChange={(e) => setFeedback(e.target.value)}
      autoFocus
    />

    {/* Button at bottom */}
    <div className="fp-button-wrapper">
      <button
        className="fp-button"
        onClick={post_feedback_func}
        disabled={disableButton}
      >
        {disableButton ? "Sending..." : "Send Review"}
      </button>
    </div>
  </div>
  )
}

export default Feedback