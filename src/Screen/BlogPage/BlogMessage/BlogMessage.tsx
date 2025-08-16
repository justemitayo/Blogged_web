import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { create_blog, edit_blog } from '../../../config/hook';
import { remove, save } from '../../../config/domain/Storage';
import { info_handler } from '../../../utils/Info_Handler/Info_Handler';
import { error_handler } from '../../../utils/Error_Handler/Error_Handler';
import { query_id } from '../../../config/hook/Query_ID/Query_ID';
import { update_blog_posts } from '../../../utils/Update_Blog_Posts/Update_Blog_Posts';
import { no_double_clicks } from '../../../utils/no_double_click/no_double_clicks';
import { useUserInfoStore } from '../../../store/User_Info.store';
import { INTF_BlogDraft } from '../../../Interface/Blog_Draft';
import { INTF_BlogPost } from '../../../Interface/Blog_Post';
import back from '../../../Assets/icon/Back_Arrow.png'
import './BlogMesage.css'


type BlogInfiniteData = {
  pageParams: any[];
  pages: { data: INTF_BlogPost[]; error: boolean }[];
};

const BlogMessage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const user_info = useUserInfoStore().user_info

  const state = location.state || {};
  const is_edit_blog = state?.b_edit || false;
  const blog_title = state?.b_title;
  const blog_tags = state?.b_tags;
  const blog_dp = state?.b_dp;
  const blog_mssg = state?.b_mssg;
  const blog_id = state?.b_id || "";

  const [blogMessage, setBlogMessage] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [oldBlogData, setOldBlogData] = useState({
    blog_title: blog_title,
    blog_tags: blog_tags,
  });

  const  create_blog_mutate = useMutation({
    mutationFn:  create_blog,
    onMutate: () => {
      setDisableButton(true);
      setShowSpinner(true);
    },
    onSuccess: async (data) => {
      setShowSpinner(false);
      setDisableButton(false);
        await remove("blog_draft");
        info_handler({
          navigate,
          proceed_type: 3,
          success_mssg: "Your Blog Post has been uploaded Successfully!",
        });
    },
    onError: (err) => {
        error_handler({
          navigate,
          error_mssg: err?.message,
        });
    }
  });

  const  edit_blog_mutate  = useMutation({
    mutationFn: edit_blog,

    onMutate: () => {
      setDisableButton(true);
      setShowSpinner(true);
      setOldBlogData({ blog_title, blog_tags });

      // Optimistic Updates for all blog queries

      type QueryKeys = keyof ReturnType<typeof query_id>;

      const queries: QueryKeys[] = ["blogs", "trendingblogs", "foryoublogs"];
      queries.forEach((q) => {
        const oldData = queryClient.getQueryData<BlogInfiniteData>(query_id({})[q]);
        if (!oldData) return; 
        const newData = update_blog_posts({
          old_data: oldData,
          blog_id,
          blog_title,
          blog_tags,
        });
        queryClient.setQueryData(query_id({})[q], newData);
      });
    },
    onSuccess: (data) => {
      setShowSpinner(false);
      setDisableButton(false);
        info_handler({
          navigate,
          proceed_type: 3,
          success_mssg: "Your Blog Post has been edited Successfully!",
        });
      queryClient.resumePausedMutations();
    },
    onError: (err) => {
        // Rollback changes
        type QueryKeys = keyof ReturnType<typeof query_id>;
        const queries: QueryKeys[] = ["blogs", "trendingblogs", "foryoublogs"];
        queries.forEach((q) => {
          const oldData = queryClient.getQueryData<BlogInfiniteData>(query_id({})[q]);
          if (!oldData) return; 

          const newData = update_blog_posts({
            old_data: oldData,
            blog_id,
            blog_title: oldBlogData.blog_title,
            blog_tags: oldBlogData.blog_tags,
          });
          queryClient.setQueryData(query_id({})[q], newData);
        });

        error_handler({
          navigate,
          error_mssg: err?.message,
        });
      } 
  });

  const upload_blog = no_double_clicks({
    execFunc: () => {
      if (blogMessage) {
        const payload = {
          user_token: user_info?.token!, 
          title: blog_title,
          tags: blog_tags,
          message: blogMessage,
          displayPicture: blog_dp,
        };
        is_edit_blog
          ? edit_blog_mutate.mutate({ blogID: blog_id, ...payload })
          : create_blog_mutate.mutate(payload);
      } else {
        error_handler({
          navigate,
          error_mssg: "The Body of the Blog Post cannot be empty!",
        });
      }
    },
  });

  const save_draft = no_double_clicks({
    execFunc: async() => {
      if (blogMessage) {
        setShowSpinner(true);
        const blogDraft: INTF_BlogDraft = {
          blogTitle: blog_title,
          blogTags: blog_tags,
          blogDP: blog_dp,
          blogMessage: blogMessage,
        };
        await save("blog_draft", blogDraft);
        setShowSpinner(false);
        info_handler({
          navigate,
          proceed_type: 3,
          success_mssg: "Your Blog Post has been saved Offline Successfully!",
        });
      } else {
        error_handler({
          navigate,
          error_mssg: "The Body of the Blog Post cannot be empty!",
        });
      }
    },
  });

  useEffect(() => {
    if (blog_mssg) {
      setBlogMessage(blog_mssg);
    }
  }, [blog_mssg]);
  return (
    <div className="blogdp-container">

      {showSpinner &&         
        <div className="overlay-spinner">
          <div className="spinner" />
          <p>loading...</p>
        </div>
      }
      <div className="blogdp-topbar">
        <img alt='' src={back} onClick={() => navigate(-1)} style={{width:'1.25rem', height:'1.25rem'}}/>
        
        {!is_edit_blog && (
          <button
            className="draft-btn"
            onClick={save_draft}
            disabled={disableButton}
          >
            Save as Draft
          </button>
        )}
      </div>

      <div className="blogdp-header">
        <h1>{is_edit_blog ? 'Edit Post' : 'Create Post'}</h1>
        <p>
        {is_edit_blog
          ? "Edit your Blog Post and click 'Upload' to make changes Online."
          : "Type in your Blog Post below and click 'Save as Draft' to save the Post Offline or 'Upload' to upload your Post Online."}
        </p>
      </div>

      <div className="blogdp-editor">
        <textarea
          placeholder="Enter the body of your Post here..."
          value={blogMessage}
          onChange={(e) => setBlogMessage(e.target.value)}
        />
      </div>

        <button
          className="upload-btn full"
          onClick={upload_blog}
          disabled={disableButton}
        >
          Upload
        </button>
    </div>
  )
}

export default BlogMessage