import React, { useEffect, useState } from 'react';
import back from '../../Assets/icon/Back_Arrow.png'
import noImage from '../../Assets/Images/No_Blog_Image.png'
import message from '../../Assets/svg/message.svg'
import notLiked from '../../Assets/svg/notLiked.svg'
import use from '../../Assets/icon/default_user_dark.jpg'
import comment from '../../Assets/svg/comment.svg'
import edit from '../../Assets/svg/edit.svg';
import deletes from '../../Assets/svg/delete.svg'
import liking from '../../Assets/svg/liked.svg'
import './Blog.css'
import { useNavigate, useParams } from 'react-router-dom';
import { no_double_clicks } from '../../utils/no_double_click/no_double_clicks';
import { useCurrentCommentsStore } from '../../store/Current_Comments';
import { INTF_BlogDetails } from '../../Interface/Blog_Details';
import { info_handler } from '../../utils/Info_Handler/Info_Handler';
import { http_link_fix } from '../../utils/HTTP_Link_Fix/HTTP_Link_Fix';
import { getBase64FromURL } from '../../utils/Get_Base/Get_Base';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { create_comment, dislike_blog, get_blog_info, like_blog } from '../../config/hook';
import { useUserInfoStore } from '../../store/User_Info.store';
import { query_id } from '../../config/hook/Query_ID/Query_ID';
import { INTF_BlogPost } from '../../Interface/Blog_Post';
import { update_blog_likes } from '../../utils/Update_Blog_Likes/Update_Blog_Likes';
import { mongo_date_converter_3 } from '../../utils/Mongo_Date_Converter/Mongo_Date_Converter';
import { high_nums_converter } from '../../utils/High_Nums_Converter/High_Nums_Converter';
import { INTF_Comments } from '../../Interface/Comments';
import { useUserDataStore } from '../../store/User_Data.store';
import { shorten_text } from '../../Shorten_Text/Shorten_Text';
import CommentCard from '../../components/Box/CommentCard';
import { useAppTagStore } from '../../store/App_Tags';

const Blog = () => {
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showModal, setShowModal] = useState<'comment' | 'message' | null>(null);
  const [blogInfo, setBlogInfo] = useState<INTF_BlogDetails>({});
  const [reply, setReply] = useState<string>('');


  const navigate = useNavigate();
  const { bid } = useParams<{ bid: string }>();
  const current_comments= useCurrentCommentsStore().current_comments;
  const current_blog_id = useCurrentCommentsStore().current_blog_id
  const set_comments = useCurrentCommentsStore().set_comments
  const set_current_blog_id = useCurrentCommentsStore().set_current_blog_id
  const user_info = useUserInfoStore().user_info
  const user_data = useUserDataStore().user_data
  const app_tags = useAppTagStore().app_tags


  const openModal = (type: 'comment' | 'message' ) => setShowModal(type);
  const closeModal = () => setShowModal(null);

  const {
    data: blogData,
    refetch: refetchBlog,
    isLoading,
  } = useQuery({
    queryKey: query_id({ id: bid }).blog_with_id,
    queryFn: () => get_blog_info({ user_token: user_info?.token, blogID: bid || '' }),
    refetchInterval: 5 * 60 * 1000,
    retry: 5,
    refetchIntervalInBackground: true,
  });

  const like_blog_mutate = useMutation({
    mutationFn: like_blog,
    onMutate: async () => {
      setLiked(true);
      setLikes(likes <= 0 ? 1 : likes + 1);
    },
    onSuccess: async(data) => {
      if (data?.error) {
        setLiked(false);
        setLikes(likes <= 0 ? 0 : likes - 1);
      } else {
        setLiked(true);

        await queryClient.cancelQueries({ queryKey: query_id({ id: bid }).blog_with_id });
        await queryClient.cancelQueries({ queryKey: query_id({}).blogs });
        await queryClient.cancelQueries({ queryKey: query_id({}).trendingblogs });
        await queryClient.cancelQueries({ queryKey: query_id({}).foryoublogs });

        // Update BlogDetails Page
        const oldBlog = queryClient.getQueryData<{ data: INTF_BlogDetails; error: boolean }>(
          query_id({ id: bid! }).blog_with_id
        );

        if (oldBlog) {
          queryClient.setQueryData(query_id({ id: bid! }).blog_with_id, {
            ...oldBlog,
            data: {
              ...oldBlog.data,
              likes_l: (oldBlog.data.likes_l || 0) + 1,
              liked: true,
            },
            error: false,
          });
        }

        // Update all blogs (paginated)
        const validKeys = ['blogs', 'trendingblogs', 'foryoublogs'] as const;
        type QueryKeyName = typeof validKeys[number]; 
        validKeys.forEach((key: QueryKeyName) => {
          const oldList = queryClient.getQueryData<{
            pageParams: any[];
            pages: { data: INTF_BlogPost[]; error: boolean }[];
          }>(query_id({})[key]);

          if (oldList) {
            const newList = update_blog_likes({
              old_data: oldList,
              blog_id: bid!,
              increase: true,
            });

            queryClient.setQueryData(query_id({})[key], newList);
          }
        });
      }

      queryClient.resumePausedMutations();
    },
  });

  const dislike_blog_mutate = useMutation({
    mutationFn: dislike_blog,
    onMutate: async () => {
      setLiked(true);
      setLikes(likes <= 0 ? 1 : likes - 1);
    },
    onSuccess: async(data) => {
      if (data?.error) {
        setLiked(false);
        setLikes(likes <= 0 ? 0 : likes + 1);
      } else {
        setLiked(false);

        await queryClient.cancelQueries({ queryKey: query_id({ id: bid }).blog_with_id });
        await queryClient.cancelQueries({ queryKey: query_id({}).blogs });
        await queryClient.cancelQueries({ queryKey: query_id({}).trendingblogs });
        await queryClient.cancelQueries({ queryKey: query_id({}).foryoublogs });

        // Update BlogDetails Page
        const oldBlog = queryClient.getQueryData<{ data: INTF_BlogDetails; error: boolean }>(
          query_id({ id: bid! }).blog_with_id
        );

        if (oldBlog) {
          queryClient.setQueryData(query_id({ id: bid! }).blog_with_id, {
            ...oldBlog,
            data: {
              ...oldBlog.data,
              likes_l: Math.max((oldBlog.data.likes_l || 1) - 1, 0),
              liked: false,
            },
            error: false,
          });
        }

        // Update all blogs (paginated)
        const validKeys = ['blogs', 'trendingblogs', 'foryoublogs'] as const;
        type QueryKeyName = typeof validKeys[number]; 
        validKeys.forEach((key: QueryKeyName) => {
          const oldList = queryClient.getQueryData<{
            pageParams: any[];
            pages: { data: INTF_BlogPost[]; error: boolean }[];
          }>(query_id({})[key]);

          if (oldList) {
            const newList = update_blog_likes({
              old_data: oldList,
              blog_id: bid!,
              increase: false,
            });

            queryClient.setQueryData(query_id({})[key], newList);
          }
        });
      }

      queryClient.resumePausedMutations();
    },
  });

  const create_comment_mutate = useMutation({
    mutationFn: create_comment,
    onMutate: () => {
      setReply('');
    },
    onSuccess: async(data) => {
      if (!data?.error) {
        await queryClient.cancelQueries({ queryKey: query_id({ id: current_blog_id }).blog_with_id });
      }
      const oldData = queryClient.getQueryData<{ data: INTF_BlogDetails; error: boolean }>(
        query_id({ id: current_blog_id! }).blog_with_id
      );
  
      if (oldData) {
        queryClient.setQueryData(query_id({ id: current_blog_id! }).blog_with_id, {
          ...oldData,
          data: {
            ...oldData.data,
            comments_l: (oldData.data.comments_l || 0) + 1,
            comments: data?.data,
          },
          error: false,
        });
      }
      queryClient.resumePausedMutations();
    }
  })



  const send_reply = no_double_clicks({
    execFunc: () => {
        if (reply) {
            create_comment_mutate.mutate({
                blogID: current_blog_id,
                comment: reply,
                user_token: user_info?.token as string,
            });
        }
    },
});

  const like_func = no_double_clicks({
    execFunc: () => {
      if (liked) {
        dislike_blog_mutate.mutate({
          blogID: blogInfo?.bid as string,
          user_token: user_info?.token as string,
        });
      } else {
        like_blog_mutate.mutate({
          blogID: blogInfo?.bid as string,
          user_token: user_info?.token as string,
        });
      }
    },
  });

  const control_comment = no_double_clicks({
    execFunc: () => {
      if (current_comments?.length > 0) {
        openModal('message')
      } else {
        closeModal()
      }
    },
  })

  const edit_blog_func = no_double_clicks({
    execFunc: async () => {
      if (blogInfo?.b_dp_link?.startsWith('http')) {
        setShowSpinner(true);
        try {
          const res = await getBase64FromURL(http_link_fix({ http_link: blogInfo?.b_dp_link }));
          setShowSpinner(false);
          navigate('/blog-title', {
            state: {
              b_edit: true,
              b_dp: res ? `data:image/jpeg;base64,${res}` : 'none',
              b_id: blogInfo?.bid,
              b_title: blogInfo?.title,
              b_tags: blogInfo?.tags,
              b_mssg: blogInfo?.message,
            },
          });
        } catch {
          setShowSpinner(false);
          navigate('/blog-title', {
            state: {
              b_edit: true,
              b_dp: 'none',
              b_id: blogInfo?.bid,
              b_title: blogInfo?.title,
              b_tags: blogInfo?.tags,
              b_mssg: blogInfo?.message,
            },
          });
        }
      }
    },
  });
  
    const nav_to_likes_page= (e: React.MouseEvent) => {
      e.stopPropagation()
      navigate(`/likes/${blogInfo?.bid}`, { state: { bid: blogInfo?.bid } });
    }

  const nav_to_authors_page = no_double_clicks({
    execFunc: () => {
      if (blogInfo?.author !== 'Not Found') {
        navigate(`/author/${blogInfo?.a_id}`, { state: { aid: blogInfo?.a_id } });
      }
    },
  });
  const delete_blog_func = no_double_clicks({
    execFunc: () => {
      info_handler({
        navigate,
        hide_back_btn: false,
        success_mssg: "Are you sure you want to 'Delete' this Blog Post?",
        proceed_type: 5,
        hide_header: true,
      });
    },
  });

  useEffect(() => {
    if (blogData?.data && !blogData?.error) {
      const p_blogData = blogData.data;
      setBlogInfo(p_blogData);
      setLiked(p_blogData?.liked);
      setLikes(p_blogData?.likes_l);
      set_comments(p_blogData?.comments || []);
    }
  }, [blogData, set_comments]);

  useEffect(() => {
    set_current_blog_id(bid || '');
  }, [bid, set_current_blog_id]);


  return (
    <div className='blog'>
      {showSpinner &&  <div className="overlay-spinner">
          <div className="spinner" />
          <p>Loading...</p>
        </div>}
      <img src={back} alt='' className='back' onClick={()=> navigate(-1)} />
      {!isLoading && !blogData?.error && !showSpinner && (
        <>
        <div className='blog-component'>
        <div className='blog-head'>
          <img src={blogInfo?.b_dp_link === 'none' || blogInfo?.b_dp_link === undefined
            ? noImage :  http_link_fix({http_link: blogInfo?.b_dp_link as string,})} alt="" />
          
        </div>
        <div className='blog-header'>
          <p> {app_tags?.[blogInfo?.tags?.[0] ?? -1]?.tag_name ?? 'Loading...'}</p>
          <div className='blogs'>
            <span style={{color:'rgb(170, 162, 162)'}}> 
              {blogInfo?.createdAt ? mongo_date_converter_3({
                input_mongo_date: blogInfo?.createdAt as string, }) : ''}
            </span>
            <span style={{color:'rgb(170, 162, 162)'}} onClick={nav_to_likes_page}>
              {(blogInfo?.likes_l as number) === 1 ? '1 like': `${high_nums_converter({number: likes,})} likes`}
            </span>
          </div>
        </div>
        <h3 className='blog-title'>{blogInfo?.title}</h3>
        <div className='blog-owner' onClick={nav_to_authors_page}>
          <img 
          src={blogInfo?.a_dp_link === 'none' || blogInfo?.a_dp_link === undefined
            ? use :  http_link_fix({http_link: blogInfo?.a_dp_link as string,})} alt="" />
          <p>{`By: ${blogInfo?.author}`}</p>
        </div>
        <p>
            {blogInfo?.message}
        </p>
      </div>
      <div className='blog-footer'>
        <div className='blog-mini'>
          <div>
            <img alt='' src={liked ? liking :  notLiked} onClick={like_func}/>
            <span> {high_nums_converter({number: blogInfo?.likes_l as number})}</span>
          </div>
          <div>
          <img alt='' src={message} onClick={control_comment} />
            <span>{high_nums_converter({ number:current_comments?.length})}</span>
          </div>
        </div>
        <div className='blog-mini'>
        {blogInfo?.isowner && (
          <>
            <img alt='' src={edit} onClick={edit_blog_func}/>
            <img alt='' src={deletes} onClick={delete_blog_func}/>
        </>
        )}
        <img alt='' src={comment} onClick={() => openModal('comment')} />
          
        </div>
      </div>
      {showModal && (
        <div className="side-modal">
          <div className="modal-content">
            <img src={back} alt='' className='back' onClick={closeModal} />
            {showModal === 'comment' ? (
              <div>
                <div className='blog-owner'>
                  <img src={blogInfo?.a_dp_link === 'none' || user_data?.dp_link === undefined
                    ? use :  http_link_fix({http_link: user_data?.dp_link as string,})} alt="" />
                  <p>{shorten_text({text: user_data?.username as string, limit: 25,})}</p>
                </div>
                <textarea value = {reply} onChange={(e) => setReply(e.target.value) }  placeholder="Write your comment..." />
                <button onClick={send_reply}>Send Reply</button>
              </div>
            ) : (
                <div>
                  {current_comments?.length > 0 &&
                    current_comments.map(
                        (item: INTF_Comments) => (
                            <CommentCard
                                key={item?._id}
                                comment={item}
                            />
                        ),
                  )}
                </div>
            )}
          </div>
        </div>
      )}
      </>
      )}
      {!isLoading && blogData?.error && !showSpinner && (
        <div style={{ flex: 1, marginInline: 22 }}>
          <p
            style={{
              textAlign: 'center',
              marginTop: 300,
            }}
          >
            An error occurred. Please check your Internet connectivity and try again!
          </p>

          <button
            style={{
              marginTop: 50,
              padding: '10px 20px',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
            onClick={no_double_clicks({
              execFunc: () => {
                refetchBlog();
              },
            })}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}

export default Blog