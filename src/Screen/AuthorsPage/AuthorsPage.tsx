// 

import React, { useEffect } from 'react'
import back from '../../Assets/icon/Back_Arrow.png'
import { http_link_fix } from '../../utils/HTTP_Link_Fix/HTTP_Link_Fix'
import { high_nums_converter } from '../../utils/High_Nums_Converter/High_Nums_Converter'
import { shorten_text } from '../../Shorten_Text/Shorten_Text'
import { getCustomTimeAgo } from '../../utils/Time_Converter/Time_Converter'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import dpUser from '../../Assets/icon/default_user_dark.jpg'
import { useInfiniteQuery, useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
import { query_id } from '../../config/hook/Query_ID/Query_ID'
import { follow_author, get_author_blogs, get_author_info, unfollow_author } from '../../config/hook'
import { global_variables } from '../../config/Global/Global_Variable'
import { INTF_UserData } from '../../Interface/User_Data'
import { useUserInfoStore } from '../../store/User_Info.store'
import { update_author_followers } from '../../utils/Update_Author_Followers/Update_Author_Followers'
import { INTF_AuthorDesc } from '../../Interface/Author_Desc'
import { no_double_clicks } from '../../utils/no_double_click/no_double_clicks'
import { INTF_BlogPost } from '../../Interface/Blog_Post'
import { useAppTagStore } from '../../store/App_Tags'
import Box from '../../components/Box/Box'
import './AuthorsPage.css'
import verify from '../../Assets/icon/Verified_Icon.png'

const AuthorsPage = () => {
  const { aid} = useParams();
const location = useLocation();
const blog_id = (location.state as any)?.blog_id;
const like_id = (location.state as any)?.like_id;

  const showSpinner = false;
  const navigate = useNavigate();
  const queryClient =useQueryClient()
  const user_info = useUserInfoStore().user_info
  const token = user_info?.token;
  const app_tags = useAppTagStore().app_tags

  const [{ data: authorsData }] = useQueries({
    queries: [
      {
        queryKey: query_id({ id: aid }).user_with_id,
        queryFn: () =>
          get_author_info({
            user_token: token!,
            authorID: aid!,
          }),
        enabled: !!token && !!aid,
        retry: 3,
      },
    ],
  });
const {
data: authorsBlog,
isFetchingNextPage,
refetch,
hasNextPage,
isLoading: isAuthorsBlogLoading,
isError,
} = useInfiniteQuery({
queryKey: query_id({ id: aid }).author_blogs_with_id,
queryFn: ({ pageParam = 0 }) =>
get_author_blogs({
  authorID: aid as string,
  user_token: token as string,
  paginationIndex: pageParam,
}),

initialPageParam: 0,

getNextPageParam: (lastPage, pages) => {
  if (lastPage.data.length === 0) return undefined;
  if (lastPage.data.length === global_variables.reloadInfiniteDataLimit) {
    return pages?.length + 1;
  }
  return undefined;
},
retry: 3,
enabled: !!token && !!aid,

});


const follow_author_mutate = useMutation({
mutationFn: follow_author,

onMutate: async() => {
 await queryClient.cancelQueries({ queryKey: query_id({ id: aid! }).user_with_id, });
 await queryClient.cancelQueries({  queryKey: query_id({ id:user_info?.uid }).user_with_id, });


// !The Person you are following

 const oldFollowedUser = queryClient.getQueryData<{ data: INTF_UserData }>(
  query_id({ id: aid!}).user_with_id);

 
if (oldFollowedUser) {
  const newFollowedUser = { 
    ...oldFollowedUser,
    data: {
      ...oldFollowedUser.data,
      followers_l: (oldFollowedUser.data.followers_l || 0) + 1,
      followed: true,
    },
  };
  queryClient.setQueryData(query_id({ id: aid!}).user_with_id, newFollowedUser);
}

// Update current user cache
const oldCurrentUser = queryClient.getQueryData<{ data: INTF_UserData }>(
  query_id({ id: user_info?.uid }).user_with_id
);
if (oldCurrentUser) {
  const newCurrentUser = {
    ...oldCurrentUser,
    data: {
      ...oldCurrentUser.data,
      following_l: (oldCurrentUser.data.following_l || 0) + 1,
    },
  };
  queryClient.setQueryData(query_id({ id: user_info?.uid }).user_with_id, newCurrentUser);
}

// Update blog likes list
if(blog_id) {
  await queryClient.cancelQueries({ queryKey: query_id({ id: blog_id }).blog_with_id_likes,})

  const oldLikesData = queryClient.getQueryData<{
    pageParams: any[];
    pages: { data: INTF_AuthorDesc[]; error: boolean }[];
  }>(query_id({ id: blog_id }).blog_with_id_likes);
  
  if (oldLikesData) {
    const newLikesData = update_author_followers({
      old_data: oldLikesData,
      increase: true,
      blog_id: like_id!,
    });
    queryClient.setQueryData(query_id({ id: blog_id }).blog_with_id_likes, newLikesData);
  }
}

//update followers/following

if (aid!) {
  await queryClient.cancelQueries({ queryKey:query_id({}).authors});

  const oldFollowData = queryClient.getQueryData<{
    pageParams: any[];
    pages: { data: INTF_AuthorDesc[]; error: boolean }[];
  }>(query_id({}).authors,);

  if (oldFollowData) {
    const newFollowData = update_author_followers({
      old_data: oldFollowData,
      increase: true,
      blog_id: like_id!,
    });
    queryClient.setQueryData(query_id({}).authors, newFollowData);
  }
}
},

onSuccess: () => {
queryClient.resumePausedMutations();
},

onError: async() => {
await queryClient.cancelQueries({ queryKey: query_id({ id: aid! }).user_with_id,})
await queryClient.cancelQueries({  queryKey:query_id({ id:user_info?.uid })
.user_with_id, });

//the person you are following

const oldFollowedUser = queryClient.getQueryData<{ data: INTF_UserData }>(
query_id({ id: aid!}).user_with_id);

if (oldFollowedUser) {
  const newFollowedUser = {
    ...oldFollowedUser,
    data: {
      ...oldFollowedUser.data,
      followers_l: (oldFollowedUser.data.followers_l || 0) - 1,
      followed: false,
    },
  };
  queryClient.setQueryData(query_id({ id: aid!}).user_with_id, newFollowedUser);
}

//your account cache update
const oldCurrentUser = queryClient.getQueryData<{ data: INTF_UserData }>(
  query_id({ id: user_info?.uid }).user_with_id
);
if (oldCurrentUser) {
  const newCurrentUser = {
    ...oldCurrentUser,
    data: {
      ...oldCurrentUser.data,
      following_l: (oldCurrentUser.data.following_l || 0) - 1,
    },
  };
  queryClient.setQueryData(query_id({ id: user_info?.uid }).user_with_id, newCurrentUser);
}

// Update blog likes list
if(blog_id) {
await queryClient.cancelQueries({ queryKey: query_id({ id: blog_id }).blog_with_id_likes,})

const oldLikesData = queryClient.getQueryData<{
  pageParams: any[];
  pages: { data: INTF_AuthorDesc[]; error: boolean }[];
}>(query_id({ id: blog_id }).blog_with_id_likes);

if (oldLikesData) {
  const newLikesData = update_author_followers({
    old_data: oldLikesData,
    increase: false,
    blog_id: like_id!,
  });
  queryClient.setQueryData(query_id({ id: blog_id }).blog_with_id_likes, newLikesData);
}
}

//update follower/following
if (aid) {
await queryClient.cancelQueries({ queryKey:query_id({}).authors});

const oldFollowData = queryClient.getQueryData<{
  pageParams: any[];
  pages: { data: INTF_AuthorDesc[]; error: boolean }[];
}>(query_id({}).authors);

if (oldFollowData) {
  const newFollowData = update_author_followers({
    old_data: oldFollowData,
    increase: false,
    blog_id: like_id!,
  });
  queryClient.setQueryData(query_id({}).authors, newFollowData);
}
} 
}
})


const unfollow_author_mutate = useMutation({
mutationFn: unfollow_author,

onMutate: async() => {
await queryClient.cancelQueries({ queryKey: query_id({ id: aid! }).user_with_id,})
await queryClient.cancelQueries({  queryKey:query_id({ id:user_info?.uid })
.user_with_id, });

//the person you are following

const oldFollowedUser = queryClient.getQueryData<{ data: INTF_UserData }>(
query_id({ id: aid!}).user_with_id);

if (oldFollowedUser) {
  const newFollowedUser = {
    ...oldFollowedUser,
    data: {
      ...oldFollowedUser.data,
      followers_l: (oldFollowedUser.data.followers_l || 0) - 1,
      followed: false,
    },
  };
  queryClient.setQueryData(query_id({ id: aid!}).user_with_id, newFollowedUser);
}

//your account cache update
const oldCurrentUser = queryClient.getQueryData<{ data: INTF_UserData }>(
  query_id({ id: user_info?.uid }).user_with_id
);
if (oldCurrentUser) {
  const newCurrentUser = {
    ...oldCurrentUser,
    data: {
      ...oldCurrentUser.data,
      following_l: (oldCurrentUser.data.following_l || 0) - 1,
    },
  };
  queryClient.setQueryData(query_id({ id: user_info?.uid }).user_with_id, newCurrentUser);
}

// Update blog likes list
if(blog_id) {
await queryClient.cancelQueries({ queryKey: query_id({ id: blog_id }).blog_with_id_likes,})

const oldLikesData = queryClient.getQueryData<{
  pageParams: any[];
  pages: { data: INTF_AuthorDesc[]; error: boolean }[];
}>(query_id({ id: blog_id }).blog_with_id_likes);

if (oldLikesData) {
  const newLikesData = update_author_followers({
    old_data: oldLikesData,
    increase: false,
    blog_id: like_id!,
  });
  queryClient.setQueryData(query_id({ id: blog_id }).blog_with_id_likes, newLikesData);
}
}

//update follower/following
if (aid) {
  await queryClient.cancelQueries({ queryKey:query_id({}).authors});

  const oldFollowData = queryClient.getQueryData<{
    pageParams: any[];
    pages: { data: INTF_AuthorDesc[]; error: boolean }[];
  }>(query_id({}).authors);

  if (oldFollowData) {
    const newFollowData = update_author_followers({
      old_data: oldFollowData,
      increase: false,
      blog_id: like_id!,
    });
    queryClient.setQueryData(query_id({}).authors, newFollowData);
  }
} 
}, 

onSuccess: () => {
queryClient.resumePausedMutations();
},

onError: async() => {
 await queryClient.cancelQueries({ queryKey: query_id({ id: aid! }).user_with_id, });
 await queryClient.cancelQueries({  queryKey: query_id({ id:user_info?.uid }).user_with_id, });


// !The Person you are following

 const oldFollowedUser = queryClient.getQueryData<{ data: INTF_UserData }>(
  query_id({ id: aid!}).user_with_id);

 
if (oldFollowedUser) {
  const newFollowedUser = { 
    ...oldFollowedUser,
    data: {
      ...oldFollowedUser.data,
      followers_l: (oldFollowedUser.data.followers_l || 0) + 1,
      followed: true,
    },
  };
  queryClient.setQueryData(query_id({ id: aid!}).user_with_id, newFollowedUser);
}

// Update current user cache
const oldCurrentUser = queryClient.getQueryData<{ data: INTF_UserData }>(
  query_id({ id: user_info?.uid }).user_with_id
);
if (oldCurrentUser) {
  const newCurrentUser = {
    ...oldCurrentUser,
    data: {
      ...oldCurrentUser.data,
      following_l: (oldCurrentUser.data.following_l || 0) + 1,
    },
  };
  queryClient.setQueryData(query_id({ id: user_info?.uid }).user_with_id, newCurrentUser);
}

// Update blog likes list
if(blog_id) {
  await queryClient.cancelQueries({ queryKey: query_id({ id: blog_id }).blog_with_id_likes,})

  const oldLikesData = queryClient.getQueryData<{
    pageParams: any[];
    pages: { data: INTF_AuthorDesc[]; error: boolean }[];
  }>(query_id({ id: blog_id }).blog_with_id_likes);
  
  if (oldLikesData) {
    const newLikesData = update_author_followers({
      old_data: oldLikesData,
      increase: true,
      blog_id: like_id!,
    });
    queryClient.setQueryData(query_id({ id: blog_id }).blog_with_id_likes, newLikesData);
  }
}

//update followers/following

if (aid!) {
  await queryClient.cancelQueries({ queryKey:query_id({}).authors});

  const oldFollowData = queryClient.getQueryData<{
    pageParams: any[];
    pages: { data: INTF_AuthorDesc[]; error: boolean }[];
  }>(query_id({}).authors,);

  if (oldFollowData) {
    const newFollowData = update_author_followers({
      old_data: oldFollowData,
      increase: true,
      blog_id: like_id!,
    });
    queryClient.setQueryData(query_id({}).authors, newFollowData);
  }
}
},
})

useEffect(() => {
  console.log("authorsBlog.pages", authorsBlog?.pages);
}, [authorsBlog]);


const follow_unfollow_author = no_double_clicks({
execFunc: () => {
  if (authorsData?.data?.followed) {
      unfollow_author_mutate.mutate({
          authorID: aid!,
          user_token: user_info?.token!,
      });
  } else {
      follow_author_mutate.mutate({
          authorID: aid!,
          user_token: user_info?.token!,
      });
  }
},
});


const open_followers = (e: React.MouseEvent) => {
  e.stopPropagation();
  if (authorsData) {
    navigate(`/author/${authorsData.data.uid}/followers?is_following=false`);
  }
};

const open_following = (e: React.MouseEvent) => {
  e.stopPropagation();
  if (authorsData) {
    navigate(`/author/${authorsData.data.uid}/followers?is_following=true`);
  }
};


const authorBlogsList = authorsBlog?.pages?.flatMap((p: any) => p.data) ?? [];



  return (
    <div className="ap_main">
      {(showSpinner || !authorsData?.data?.uid ) && (
        <div className="overlay-spinner">
          <div className="spinner" />
          <p>Loading...</p>
        </div>
      )}
      <img alt='' src={back} className='back' onClick={() => navigate(-1)}/>

    {Boolean(authorsData?.data?.uid) && (
      <div className="ap_container">
        <div className="ap_profile">
          <div className="ap_dp_container">
            {authorsData?.data?.dp_link && authorsData?.data?.dp_link !== 'none' ? (
              <img
                className="ap_dp"
                src={http_link_fix({ http_link: authorsData?.data?.dp_link })}
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
                  {high_nums_converter({ number: authorsData?.data?.followers_l })}
                </div>
                <div className="ap_txt_desc">
                  {authorsData?.data?.followers_l === 1 ? 'Follower' : 'Followers'}
                </div>
              </div>
            </div>
            <div className="ap_stat_item" onClick={open_following}>
              <div>
                <div className="ap_txt_val">
                  {high_nums_converter({ number: authorsData?.data?.following_l })}
                </div>
                <div className="ap_txt_desc">
                  {authorsData?.data?.following_l === 1 ? 'Following' : 'Followings'}
                </div>
              </div>
            </div>
            <div className="ap_stat_item">
              <div>
                <div className="ap_txt_val">
                  {high_nums_converter({ number: authorsData?.data?.blogs_l })}
                </div>
                <div className="ap_txt_desc">
                  {authorsData?.data?.blogs_l === 1 ? 'Post' : 'Posts'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ap_username_row">
          <div className="ap_username_col">
            <div className="ap_username">
              <span className="ap_txt_val ap_username_txt">
                {shorten_text({ text: authorsData?.data?.username, limit: 25 })}
              </span>
              {authorsData?.data?.verified && (
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
                {getCustomTimeAgo({ date_string: authorsData?.data?.createdAt })}
              </span>
            </div>
          </div>
          {!authorsData?.data?.isowner && (
            <button onClick={follow_unfollow_author}>
              {authorsData?.data?.followed ? 'following' : 'follow'}
            </button>
          )}
        </div>

        <div className="text-divider" />

        <h2 className="ap_blog_title">Blog Posts</h2>

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
                  <p className="ap_more">{isFetchingNextPage ? 'Loading more...' : ''}</p>
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

export default AuthorsPage