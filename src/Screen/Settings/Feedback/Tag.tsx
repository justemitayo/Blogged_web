import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'
import { suggest_tag } from '../../../config/hook/Suggest_Tag/Suggest_Tag';
import { error_handler } from '../../../utils/Error_Handler/Error_Handler';
import { info_handler } from '../../../utils/Info_Handler/Info_Handler';
import { useNavigate } from 'react-router-dom';
import { no_double_clicks } from '../../../utils/no_double_click/no_double_clicks';
import back from '../../../Assets/icon/Back_Arrow.png'

const Tag = () => {
  const [tagName, setTagName] = useState<string>('');
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [disableButton, setDisableButton] = useState<boolean>(false);

  const navigate = useNavigate();

  const suggest_tag_mutate = useMutation({
    mutationFn: suggest_tag,
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
          setTagName('');
          info_handler({
              navigate,
              proceed_type: 3,
              hide_back_btn: true,
              hide_header: false,
              success_mssg: 'Tag Name uploaded Successfully!',
          });
      }
  },
  });

  const suggest_tag_func = no_double_clicks({
    execFunc: () => {
        if (tagName) {
            suggest_tag_mutate.mutate({
                tagName: tagName,
            });
        } else {
            error_handler({
                navigate,
                error_mssg: 'Tag field cannot be empty!',
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
    <h1 className="fp-title">Suggest a Tag Name?</h1>
    <p className="fp-subtitle">
    Please enter your 'Tag Name' below and click 'Send Tag' to upload your Tag Name.
    </p>

    {/* Textarea for feedback */}
    <textarea
      className="fp-input"
      placeholder="Enter your Tag Name here..."
      value={tagName}
      onChange={(e) => setTagName(e.target.value)}
      autoFocus
    />

    {/* Button at bottom */}
    <div className="fp-button-wrapper">
      <button
        className="fp-button"
        onClick={suggest_tag_func}
        disabled={disableButton}
      >
        {disableButton ? "Sending..." : "Send Tag"}
      </button>
    </div>
  </div>
  )
}

export default Tag