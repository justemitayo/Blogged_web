import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { INTF_BlogDraft } from '../../Interface/Blog_Draft';
import { no_double_clicks } from '../../utils/no_double_click/no_double_clicks';
import { load } from '../../config/domain/Storage';
import './CreateBlog.css'

const CreateBlog = () => {

  const navigate = useNavigate();

  const [render, setRender] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [canShowLFS, setCanShowLFS] = useState(false);
  const [blogDraft, setBlogDraft] = useState<INTF_BlogDraft>({
    blogTitle: '',
    blogTags: [],
    blogDP: '',
    blogMessage: '',
  });

  const nav_to_blog_title = no_double_clicks({
    execFunc: () =>{
      setShowSpinner(true);
      setTimeout(() => {
        navigate('/blog-title', { state: { b_edit: false } });
      }, 500)
    }
  });

  const nav_to_blog_title_from_draft = no_double_clicks({
    execFunc: () => {
      setShowSpinner(true);
      setTimeout(() => {
        navigate('/blog-title', {
          state: {
            b_edit: false,
            b_title: blogDraft?.blogTitle,
            b_tags: blogDraft?.blogTags,
            b_dp: blogDraft?.blogDP,
            b_mssg: blogDraft?.blogMessage,
          },
        });
      }, 500)
    }
  });

  useEffect(() => {
    const getDraft = async () => {
      setShowSpinner(true)
      try {
        const res = await load('blog_draft');
        if (res) {
          setBlogDraft(res.blog_draft);
          setCanShowLFS(true);
        } else {
          setCanShowLFS(false);
        }
      } catch (error) {
        setCanShowLFS(false);
      } finally {
        setShowSpinner(false);
        setRender(true);
      }
    };

    getDraft();
  }, []);

 


  if (!render) return null;

  return (
    <div className="cb-main">
      {showSpinner && (
        <div className="overlay-spinner">
          <div className="spinner" />
          <p>Loading...</p>
        </div>
      )}

      <h1 className="cb-m-wt">Create Blog Post?</h1>
      <p className="cb-m-wt2">
        {canShowLFS
          ? "Let's get started on creating your Blog Post. Select 'Load Draft' to load saved Blog Draft or 'New Blog Post' to create a new Blog Post."
          : "Let's get started on creating your Blog Post. Select 'New Blog Post' to create a new Blog Post."}
      </p>

      {canShowLFS && (
        <button className="cb-button" onClick={nav_to_blog_title_from_draft}>
          Load Draft
        </button>
      )}

      <button
        className="cb-button"
        style={{ marginTop: canShowLFS ? 10 : 'auto' }}
        onClick={nav_to_blog_title}
      >
        New Blog Post
      </button>
    </div>
  )
}

export default CreateBlog