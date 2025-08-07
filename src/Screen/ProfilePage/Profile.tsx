import React from 'react'
import './Profile.css'
import dpUser from '../../Assets/icon/default_user_dark.jpg'
import verify from '../../Assets/icon/Verified_Icon.png'
import back from '../../Assets/icon/Back_Arrow.png'
import { useNavigate } from 'react-router-dom'
import { useUserDataStore } from '../../store/User_Data.store'
import { useUserInfoStore } from '../../store/User_Info.store'
import { get_author_blogs } from '../../config/hook'
import { query_id } from '../../config/hook/Query_ID/Query_ID'
import { useInfiniteQuery } from '@tanstack/react-query'
import { global_variables } from '../../config/Global/Global_Variable'
import { http_link_fix } from '../../utils/HTTP_Link_Fix/HTTP_Link_Fix'
import { high_nums_converter } from '../../utils/High_Nums_Converter/High_Nums_Converter'
import { shorten_text } from '../../Shorten_Text/Shorten_Text'
import { getCustomTimeAgo } from '../../utils/Time_Converter/Time_Converter'
import { useAppTagStore } from '../../store/App_Tags'
import { INTF_BlogPost } from '../../Interface/Blog_Post'
import Box from '../../components/Box/Box'

const Profile = () => {
  const showSpinner = false
  const navigate = useNavigate();

  const user_data = useUserDataStore().user_data;
  const user_info =useUserInfoStore().user_info;
  const app_tags = useAppTagStore().app_tags

  const {
    data: authorsBlog,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    hasNextPage,
    isLoading: isAuthorsBlogLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: query_id({ id: user_info?.uid }).author_blogs_with_id,
    queryFn: ({ pageParam = 0 }) =>
        get_author_blogs({ 
            authorID: user_info?.uid!,
            user_token: user_info?.token!,
            paginationIndex: pageParam,
        }),
  
        initialPageParam: 0,
  
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.data.length === 0) {
                return undefined;
            }
            if (lastPage.data.length === global_variables.reloadInfiniteDataLimit) {
                return pages?.length + 1;
            }
            return undefined;
        },
        retry: 3,
        staleTime: 180000,
        enabled: Boolean(user_info?.uid!),
  });
  
  const edit_profile = () => {
    navigate('setting')
  }
  
  const open_followers = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user_info) {
      navigate(`/author/${user_info?.uid}/followers?is_following=false`);
    }
  };
  
  const open_following = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user_info) {
      navigate(`/author/${user_info?.uid}/followers?is_following=true`);
    }
  };

  const authorBlogsList = authorsBlog?.pages?.flatMap((p: any) => p.data) ?? [];

  return (
    <div className="ap_main">
      {(showSpinner || !user_data.uid ) && (
        <div className="overlay-spinner">
          <div className="spinner" />
          <p>Loading...</p>
        </div>
      )}
      <img alt='' src={back} className='back' onClick={() => navigate(-1)}/>

    {Boolean(user_data.uid ) && (
      <div className="ap_container">
        <div className="ap_profile">
          <div className="ap_dp_container">
            {user_data?.dp_link && user_data?.dp_link !== 'none' ? (
              <img
                className="ap_dp"
                src={http_link_fix({ http_link: user_data?.dp_link })}
                alt="dp"
              />
            ) : (
              <img
                className="ap_dp"
                src={dpUser}
                alt="default-dp"
              />
            )}
          </div>
          <div className="ap_stats">
            <div className="ap_stat_item" onClick={open_followers}>
              <div>
                <div className="ap_txt_val">
                  {high_nums_converter({ number: user_data?.followers_l ?? 0 })}
                </div>
                <div className="ap_txt_desc">
                  {user_data?.followers_l === 1 ? 'Follower' : 'Followers'}
                </div>
              </div>
            </div>
            <div className="ap_stat_item" onClick={open_following}>
              <div>
                <div className="ap_txt_val">
                  {high_nums_converter({ number: user_data?.following_l ?? 0 })}
                </div>
                <div className="ap_txt_desc">
                  {user_data?.following_l === 1 ? 'Following' : 'Followings'}
                </div>
              </div>
            </div>
            <div className="ap_stat_item">
              <div>
                <div className="ap_txt_val">
                  {high_nums_converter({ number: user_data?.blogs_l ?? 0 })}
                </div>
                <div className="ap_txt_desc">
                  {user_data.blogs_l === 1 ? 'Post' : 'Posts'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ap_username_row">
          <div className="ap_username_col">
            <div className="ap_username">
              <span className="ap_txt_val ap_username_txt">
                {shorten_text({ text: user_data?.username ?? '', limit: 25 })}
              </span>
              {user_data?.verified && (
                <img
                  src={verify}
                  alt="verified"
                  width={16}
                  height={16}
                  className="ap_verified_icon"
                />
              )}
            </div>
            <div className="ap_joined">
              <span className="ap_txt_label">Joined: </span>
              <span className="ap_txt_value">
                {getCustomTimeAgo({ date_string: user_data?.createdAt ?? '' })}
              </span>
            </div>
          </div>
          {user_data?.isowner && (
            <button onClick={edit_profile}>
              Edit Profile
            </button>
          )}
        </div>

        <div className="text-divider" />

        <h2 className="ap_blog_title">Your Posts</h2>

        {isAuthorsBlogLoading ? (
                  <div className="overlay-spinner">
                    <div className="spinner" />
                    <p>Loading...</p>
                  </div>
        ) : (
          <div className="ap_blog_list">
            {!isError && authorBlogsList.length > 0 && (
              <>
                {authorsBlog?.pages?.flatMap((p: any) => p.data).map((item: INTF_BlogPost, index: number) => (
                  <Box
                    key={item.bid}
                    blog_post={item}
                    index={index}
                    tags={app_tags}
                  />
                ))}
                {hasNextPage && (
                  <>
                  <p className="ap_more">{isFetchingNextPage ? 'Loading more...' : ''}</p>
                  <button onClick={() => fetchNextPage()}>
                  Load More
                </button>
                </>
                )}
              </>
            )}
            {!isError && authorBlogsList.length <= 0 && (
              <p className="ap_no_posts">No Posts Available</p>
            )}
            {isError && (
              <div className="ap_error">
                <p className="ap_error_text">An Error Occurred! Press the Button below to Refresh.</p>
                <p className="ap_error_msg">{(authorsBlog as any)?.message || 'An error occurred.'}</p>
                <button onClick={() => refetch()} className="ap_refresh_btn">
                  refresh
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    )}
  </div>
  )
}

export default Profile