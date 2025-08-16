import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BlogTitle.css';
import back from '../../../Assets/icon/Back_Arrow.png'

const BlogTitle = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const {
    b_edit = false,
    b_title = '',
    b_tags = [],
    b_dp = '',
    b_mssg = '',
    b_id = '',
  } = location.state || {};

  const [blogTitle, setBlogTitle] = useState<string>('');


  const openBlogTags = () => {
    if (!blogTitle) {
      alert('Title field cannot be empty!');
      return;
    }

    navigate('/blog-tags', {
      state: {
        b_edit,
        b_id,
        b_title: blogTitle,
        b_tags,
        b_dp,
        b_mssg,
      },
    });
  };

  useEffect(() => {
    if (b_title) setBlogTitle(b_title);
  }, [b_title]);

  return (
    <div className="btp-main">
      <div className="btp-back-btn">
        <img alt='' src={back} className='back' onClick={() => navigate(-1)}/>
      </div>

      <h1 className="btp-title">What's your Blog Title?</h1>
      <p className="btp-subtitle">
        Let's get started by {b_edit ? 'editing' : 'inputting'} your Blog Title.
      </p>

      <input
        type="text"
        placeholder="Enter your Blog Title"
        value={blogTitle}
        onChange={(e) => setBlogTitle(e.target.value)}
        className="btp-input"
        autoFocus
      />

      <button onClick={openBlogTags} className="btp-button">
        Next
      </button>
    </div>
  )
}

export default BlogTitle