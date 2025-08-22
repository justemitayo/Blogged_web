import React,{FunctionComponent} from 'react'
import { INTF_AuthorDesc } from '../../Interface/Author_Desc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { follow_author, unfollow_author } from '../../config/hook';
import { useUserInfoStore } from '../../store/User_Info.store';
import { query_id } from '../../config/hook/Query_ID/Query_ID';
import { INTF_UserData } from '../../Interface/User_Data';
import { update_author_followers } from '../../utils/Update_Author_Followers/Update_Author_Followers';
import { no_double_clicks } from '../../utils/no_double_click/no_double_clicks';
import { http_link_fix } from '../../utils/HTTP_Link_Fix/HTTP_Link_Fix';
import './BlogLikes.css'
import  UserDp from '../../Assets/icon/default_user_dp_light.jpg'
import verified from '../../Assets/icon/Verified_Icon.png'
import { shorten_text } from '../../Shorten_Text/Shorten_Text';
import { high_nums_converter } from '../../utils/High_Nums_Converter/High_Nums_Converter';


interface BlogLikesProps {
  blog_like: INTF_AuthorDesc;
  blog_id: string;
}
const BlogLikes: FunctionComponent<BlogLikesProps>  = ({blog_like, blog_id}) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const user_info = useUserInfoStore().user_info

  const follow_author_mutate = useMutation({
    mutationFn: follow_author,

    onMutate: async() => {
       await queryClient.cancelQueries({ queryKey: query_id({ id: blog_like?.uid ?? '' }).user_with_id, });
       await queryClient.cancelQueries({  queryKey: query_id({ id: user_info?.uid }).user_with_id, });
       await queryClient.cancelQueries({ queryKey: query_id({ id: blog_id }).blog_with_id_likes, });

       // Update the followed user cache
      const oldFollowedUser = queryClient.getQueryData<{ data: INTF_UserData }>(
        query_id({ id: blog_like?.uid }).user_with_id
      );

      if (oldFollowedUser) {
        const newFollowedUser = {
          ...oldFollowedUser,
          data: {
            ...oldFollowedUser.data,
            followers_l: (oldFollowedUser.data.followers_l || 0) + 1,
            followed: true,
          },
        };
        queryClient.setQueryData(query_id({ id: blog_like?.uid }).user_with_id, newFollowedUser);
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
      const oldLikesData = queryClient.getQueryData<{
        pageParams: any[];
        pages: { data: INTF_AuthorDesc[]; error: boolean }[];
      }>(query_id({ id: blog_id }).blog_with_id_likes);

      if (oldLikesData) {
        const newLikesData = update_author_followers({
          old_data: oldLikesData,
          increase: true,
          blog_id: blog_like?.uid!,
        });
        queryClient.setQueryData(query_id({ id: blog_id }).blog_with_id_likes, newLikesData);
      }
    },

    onSuccess: () => {
      queryClient.resumePausedMutations();
    },

    onError: async() => {
        // Revert all optimistic updates
        await queryClient.cancelQueries({ queryKey: query_id({ id: blog_like?.uid ?? '' }).user_with_id, });
        await queryClient.cancelQueries({  queryKey: query_id({ id: user_info?.uid }).user_with_id, });
        await queryClient.cancelQueries({ queryKey: query_id({ id: blog_id }).blog_with_id_likes, });

        const oldFollowedUser = queryClient.getQueryData<{ data: INTF_UserData }>(
          query_id({ id: blog_like?.uid }).user_with_id
        );
        if (oldFollowedUser) {
          const newFollowedUser = {
            ...oldFollowedUser,
            data: {
              ...oldFollowedUser.data,
              followers_l: Math.max((oldFollowedUser.data.followers_l || 1) - 1, 0),
              followed: false,
            },
          };
          queryClient.setQueryData(query_id({ id: blog_like?.uid }).user_with_id, newFollowedUser);
        }

        const oldCurrentUser = queryClient.getQueryData<{ data: INTF_UserData }>(
          query_id({ id: user_info?.uid }).user_with_id
        );
        if (oldCurrentUser) {
          const newCurrentUser = {
            ...oldCurrentUser,
            data: {
              ...oldCurrentUser.data,
              following_l: Math.max((oldCurrentUser.data.following_l || 1) - 1, 0),
            },
          };
          queryClient.setQueryData(query_id({ id: user_info?.uid }).user_with_id, newCurrentUser);
        }

        const oldLikesData = queryClient.getQueryData<{
          pageParams: any[];
          pages: { data: INTF_AuthorDesc[]; error: boolean }[];
        }>(query_id({ id: blog_id }).blog_with_id_likes);

        if (oldLikesData) {
          const newLikesData = update_author_followers({
            old_data: oldLikesData,
            increase: false,
            blog_id: blog_like?.uid!,
          });
          queryClient.setQueryData(query_id({ id: blog_id }).blog_with_id_likes, newLikesData);
        }
    }
  })

  const unfollow_author_mutate = useMutation({
    mutationFn: unfollow_author,
    onMutate: async () => {
      // Cancel related queries
      await queryClient.cancelQueries({queryKey: query_id({ id: blog_like?.uid }).user_with_id,})
     await queryClient.cancelQueries({queryKey: query_id({ id: user_info?.uid }).user_with_id,})
      await queryClient.cancelQueries({queryKey: query_id({ id: blog_id }).blog_with_id_likes,})


      // Update followed user cache
      const oldUser = queryClient.getQueryData<{ data: INTF_UserData }>(
        query_id({ id: blog_like?.uid }).user_with_id
      );
      if (oldUser) {
        const newUser = {
            ...oldUser,
            data: {
              ...oldUser.data,
              followers_l: Math.max((oldUser.data.followers_l ?? 1) - 1, 0),
              followed: false,
            },
          }
          queryClient.setQueryData(query_id({ id: blog_like?.uid }).user_with_id, newUser);
      };

      // Update current user cache
      const oldCurrentUser = queryClient.getQueryData<{ data: INTF_UserData }>(
        query_id({ id: user_info?.uid }).user_with_id
      );

      if (oldCurrentUser) {
          const newCurrentUser = {
            ...oldCurrentUser,
            data: {
              ...oldCurrentUser.data,
              following_l: Math.max((oldCurrentUser.data.following_l ?? 1) - 1, 0),
            },
          }
          queryClient.setQueryData(query_id({ id: user_info?.uid }).user_with_id, newCurrentUser);
      }

      // Update likes list
      const oldLikes = queryClient.getQueryData<{
        pageParams: any[];
        pages: { data: INTF_AuthorDesc[]; error: boolean }[];
      }>(query_id({ id: blog_id }).blog_with_id_likes);

      if (oldLikes) {
        const updated = update_author_followers({
          old_data: oldLikes,
          increase: false,
          blog_id: blog_like?.uid!,
        });
        queryClient.setQueryData(query_id({ id: blog_id }).blog_with_id_likes, updated);
      }
    },

    onSettled: () => {
      queryClient.resumePausedMutations();
    },

    onError: async () => {


      await queryClient.cancelQueries({ queryKey: query_id({ id: blog_like?.uid ?? '' }).user_with_id, });
      await queryClient.cancelQueries({  queryKey: query_id({ id: user_info?.uid }).user_with_id, });
      await queryClient.cancelQueries({ queryKey: query_id({ id: blog_id }).blog_with_id_likes, });

        // Rollback all changes

          const cached = queryClient.getQueryData<{ data: INTF_UserData }>(
            query_id({ id: blog_like?.uid }).user_with_id
          );
          if (cached) {
            const newCached ={
                ...cached,
                data: {
                  ...cached.data,
                  followers_l: (cached.data.followers_l ?? 0) + 1,
                  followed: true,
                },
              }
              queryClient.setQueryData(query_id({ id: blog_like?.uid }).user_with_id, newCached);
          }

      // Re-add follower

        const current = queryClient.getQueryData<{ data: INTF_UserData }>(
          query_id({ id: user_info?.uid }).user_with_id
        );
        if (current) {
            const newCurrent={
              ...current,
              data: {
                ...current.data,
                following_l: (current.data.following_l ?? 0) + 1,
              },
            }
            queryClient.setQueryData(query_id({ id: user_info?.uid }).user_with_id, newCurrent);
        }

        const oldLikes = queryClient.getQueryData<{
          pageParams: any[];
          pages: { data: INTF_AuthorDesc[]; error: boolean }[];
        }>(query_id({ id: blog_id }).blog_with_id_likes);

        if (oldLikes) {
          const rollbackLikes = update_author_followers({
            old_data: oldLikes,
            increase: true,
            blog_id: blog_like?.uid!,
          });
          queryClient.setQueryData(query_id({ id: blog_id }).blog_with_id_likes, rollbackLikes);
        }
     
    },
  });

  const follow_unfollow_author = no_double_clicks({
    execFunc: () => {
        if (blog_like?.followed) {
            unfollow_author_mutate.mutate({
                authorID: blog_like?.uid!,
                user_token: user_info?.token!,
            });
        } else {
            follow_author_mutate.mutate({
                authorID: blog_like?.uid!,
                user_token: user_info?.token!,
            });
        }
    },
});
const navToAuthorsPage = no_double_clicks({
  execFunc: () => {
  if (blog_like?.username !== 'Not Found') {
    navigate(`/author/${blog_like?.uid}`, {
      state: { blog_id, like_id: blog_like?.uid },
    });
  }
}});

const openFollowers = no_double_clicks ({
  execFunc: () => {
  navigate(`/author/${blog_like?.uid}/followers`, {
    state: { is_following: false, blog_id },
  });
}});

const dpSrc =blog_like?.dp_link === 'none' || !blog_like?.dp_link ? UserDp : http_link_fix({ http_link: blog_like?.dp_link });

  return (
    <div className="blog-like-item">
      <div className="profile-pic" onClick={navToAuthorsPage}>
        <img src={dpSrc} alt="user" />
      </div>

      <div className="blog-like-details">
        <div className="username-row" onClick={navToAuthorsPage}>
          <span className="username">
            {shorten_text({ text: blog_like?.username || '', limit: 23 })}
          </span>
          {blog_like?.verified && (
            <img src={verified} alt="verified" className="verified-icon" />
          )}
        </div>
        <div className="followers" onClick={openFollowers}>
          {`${high_nums_converter({ number: blog_like.followers || 0 })} ${
            blog_like?.followers === 1 ? 'Follower' : 'Followers'
          }`}
        </div>
      </div>
     
      {!blog_like.isowner && (
        <button
          className={`follow-btn ${blog_like?.followed ? 'following' : ''}`}
          onClick={follow_unfollow_author}
        >
          {blog_like?.followed ? 'Following' : 'Follow'}
        </button>
      )}
       </div>
  )
}

export default BlogLikes