import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BlogTag.css';
import { useAppTagStore } from '../../../store/App_Tags';
import back from '../../../Assets/icon/Back_Arrow.png'
import { no_double_clicks } from '../../../utils/no_double_click/no_double_clicks';
import { INTF_Tag } from '../../../Interface/Tags';
import TagButton from '../../../components/Tag/TagButton';

const BlogTagPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  const is_edit_blog = state.b_edit || false;
  const blog_title = state.b_title;
  const blog_tags = useMemo(() => state.b_tags || [], [state.b_tags]);
  const blog_dp = state.b_dp;
  const blog_mssg = state.b_mssg;
  const blog_id = state.b_id || '';


  const app_tags = useAppTagStore().app_tags
  const [showSpinner, setShowSpinner] = useState<boolean>(false);

  const open_blog_dp = no_double_clicks({
    execFunc: () => {
      setShowSpinner(true);
      setTimeout(() => {
        navigate('/blogdp', {
          state: {
            b_edit: is_edit_blog,
            b_id: blog_id,
            b_title: blog_title,
            b_tags: blogTags,
            b_dp: blog_dp,
            b_mssg: blog_mssg,
          },
        });
      }, 500)
    },
  });

  const [blogTags, setBlogTags] = useState<number[]>([]);

  const clear_blog_tags = no_double_clicks({
    execFunc: () => {
      setBlogTags([]);
    },
  });

  useEffect(() => {
    if (blog_tags) {
      setBlogTags(blog_tags);
    }
  }, [blog_tags]);

  return (
    <div className="btp-main">
      {showSpinner && (
        <div className="overlay-spinner">
          <div className="spinner" />
          <p>Loading...</p>
        </div>
      )}

      <div className="btp-header">
        <img alt='' src={back} className='back' onClick={() => navigate(-1)}/>
      </div>

      <div className="btp-scroll">
        <h1 className="btp-title">Select your Blog Tags?</h1>
        <p className="btp-subtitle">Select the tags that best describe your Blog Post.</p>

        {app_tags?.length > 0 && (
          <div className="btp-tags-section">
            <h2 className="btp-section-title">Select your Tags:</h2>
            <div className="btp-tags-wrap">
              {app_tags !== undefined &&
                (app_tags || [])?.map(
                  (tag: INTF_Tag, index: number) => (
                    <TagButton tag={tag} key={index} />
                  ),
                )}
            </div>

            <h2 className="btp-section-title mt-20">Clear all Tags:</h2>
            <button onClick={clear_blog_tags} className="btp-button" >Clear Tags</button>
          </div>
        )}
      </div>

      <div className="btp-footer">
      <button onClick={open_blog_dp} className="btp-button">Next</button>
      </div>
    </div>
  );
};

export default BlogTagPage;
