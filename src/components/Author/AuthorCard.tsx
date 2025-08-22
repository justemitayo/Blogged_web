import React, { FunctionComponent } from 'react'
import { INTF_AuthorDesc } from '../../Interface/Author_Desc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useUserInfoStore } from '../../store/User_Info.store';
import { follow_author, unfollow_author } from '../../config/hook';
import { query_id } from '../../config/hook/Query_ID/Query_ID';
import { INTF_UserData } from '../../Interface/User_Data';
import { update_author_followers } from '../../utils/Update_Author_Followers/Update_Author_Followers';
import { no_double_clicks } from '../../utils/no_double_click/no_double_clicks';
import { http_link_fix } from '../../utils/HTTP_Link_Fix/HTTP_Link_Fix';
import { shorten_text } from '../../Shorten_Text/Shorten_Text';
import { high_nums_converter } from '../../utils/High_Nums_Converter/High_Nums_Converter';
import light from '../../Assets/icon/default_user_dp_light.jpg'
import verify from "../../Assets/icon/Verified_Icon.png"

interface AuthorCardProps {
  author_fol: INTF_AuthorDesc;

}

const AuthorCard: FunctionComponent<AuthorCardProps> = ({ author_fol}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate()

  const user_info = useUserInfoStore().user_info

  const follow_author_mutate = useMutation({
    mutationFn: follow_author,
  
    onMutate: async() => {
       await queryClient.cancelQueries({ queryKey: query_id({ id: author_fol?.uid ?? '' }).user_with_id, });
       await queryClient.cancelQueries({  queryKey: query_id({ id:user_info?.uid }).user_with_id, });
       await queryClient.cancelQueries({  queryKey: query_id({}).authors });
  
       // The Person you are following
       const oldFollowedUser = queryClient.getQueryData<{ data: INTF_UserData }>(
        query_id({ id: author_fol?.uid! }).user_with_id
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
        queryClient.setQueryData(query_id({ id: author_fol?.uid!}).user_with_id, newFollowedUser);
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
  

  
      //update followers/following
        const oldFollowData = queryClient.getQueryData<{
          pageParams: any[];
          pages: { data: INTF_AuthorDesc[]; error: boolean }[];
        }>(query_id({}).authors,);
  
        if (oldFollowData) {
          const newFollowData = update_author_followers({
            old_data: oldFollowData,
            increase: true,
            blog_id: author_fol?.uid!,
          });
          queryClient.setQueryData(query_id({}).authors, newFollowData);
        }
    }, 

    onSuccess: () => {
      queryClient.resumePausedMutations();
    },
  
    onError: async() => {
      await queryClient.cancelQueries({ queryKey: query_id({ id: author_fol?.uid! }).user_with_id,})
      await queryClient.cancelQueries({  queryKey:query_id({ id:user_info?.uid })
      .user_with_id, });
      await queryClient.cancelQueries({  queryKey: query_id({}).authors });
  
      //the person you are following

      const oldFollowedUser = queryClient.getQueryData<{ data: INTF_UserData }>(
        query_id({ id: author_fol?.uid as string }).user_with_id
      );
      if (oldFollowedUser) {
        const newFollowedUser = {
          ...oldFollowedUser,
          data: {
            ...oldFollowedUser.data,
            followers_l: (oldFollowedUser.data.followers_l || 0) - 1,
            followed: false,
          },
        };
        queryClient.setQueryData(query_id({ id: author_fol?.uid!}).user_with_id, newFollowedUser);
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
  

  
      const oldFollowData = queryClient.getQueryData<{
        pageParams: any[];
        pages: { data: INTF_AuthorDesc[]; error: boolean }[];
      }>(query_id({}).authors,);
  
      if (oldFollowData) {
        const newFollowData = update_author_followers({
          old_data: oldFollowData,
          increase: false,
          blog_id: author_fol?.uid!,
        });
        queryClient.setQueryData(query_id({}).authors, newFollowData);
      }
    }
  })
  
  const unfollow_author_mutate = useMutation({
    mutationFn: unfollow_author,
  
    onMutate: async() => {
      await queryClient.cancelQueries({ queryKey: query_id({ id: author_fol?.uid! }).user_with_id,})
      await queryClient.cancelQueries({  queryKey:query_id({ id:user_info?.uid })
      .user_with_id, });
      await queryClient.cancelQueries({  queryKey: query_id({}).authors });

      //the person you are following
      const oldFollowedUser = queryClient.getQueryData<{ data: INTF_UserData }>(
        query_id({ id: author_fol?.uid as string }).user_with_id
      );
      if (oldFollowedUser) {
        const newFollowedUser = {
          ...oldFollowedUser,
          data: {
            ...oldFollowedUser.data,
            followers_l: (oldFollowedUser.data.followers_l || 0) - 1,
            followed: false,
          },
        };
        queryClient.setQueryData(query_id({ id: author_fol?.uid!}).user_with_id, newFollowedUser);
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

  
      const oldFollowData = queryClient.getQueryData<{
        pageParams: any[];
        pages: { data: INTF_AuthorDesc[]; error: boolean }[];
      }>(query_id({}).authors,);
  
      if (oldFollowData) {
        const newFollowData = update_author_followers({
          old_data: oldFollowData,
          increase: false,
          blog_id: author_fol?.uid!,
        });
        queryClient.setQueryData(query_id({ }).authors, newFollowData);
      }
    },
  
    onSuccess: () => {
      queryClient.resumePausedMutations();
    },
  
    onError: async() => {
      await queryClient.cancelQueries({ queryKey: query_id({ id: author_fol?.uid ?? '' }).user_with_id, });
      await queryClient.cancelQueries({  queryKey: query_id({ id:user_info?.uid }).user_with_id, });
      await queryClient.cancelQueries({  queryKey: query_id({}).authors });
  
      const oldFollowedUser = queryClient.getQueryData<{ data: INTF_UserData }>(
       query_id({ id: author_fol?.uid as string }).user_with_id
     );
  
      // !The Person you are following
     if (oldFollowedUser) {
       const newFollowedUser = {
         ...oldFollowedUser,
         data: {
           ...oldFollowedUser.data,
           followers_l: (oldFollowedUser.data.followers_l || 0) + 1,
           followed: true,
         },
       };
       queryClient.setQueryData(query_id({ id: author_fol?.uid as string}).user_with_id, newFollowedUser);
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
  
       const oldFollowData = queryClient.getQueryData<{
         pageParams: any[];
         pages: { data: INTF_AuthorDesc[]; error: boolean }[];
       }>(query_id({}).authors,);
  
       if (oldFollowData) {
         const newFollowData = update_author_followers({
           old_data: oldFollowData,
           increase: true,
           blog_id: author_fol?.uid!,
         });
         queryClient.setQueryData(query_id({}).authors, newFollowData);
       }
   }
  })
  
  
  
  const follow_unfollow_author = no_double_clicks({
    execFunc: () => {
        if (author_fol?.followed) {
            unfollow_author_mutate.mutate({
                authorID: author_fol?.uid!,
                user_token: user_info?.token!,
            });
        } else {
            follow_author_mutate.mutate({
                authorID: author_fol?.uid!,
                user_token: user_info?.token!,
            });
        }
    },
  });
  
    const nav_to_authors_page = no_double_clicks({
      execFunc: () => {
        if (author_fol?.username !== 'Not Found') {
          navigate(`/author/${author_fol.uid}?f_aid=${author_fol.uid}&like_id=${author_fol.uid}`);
        }
      },
    });
  
    const open_followers = (e: React.MouseEvent) =>{
        e.stopPropagation()
     navigate(`/author/${author_fol.uid}/followers?is_following=false`);
    }
      //open following list
    //  navigate(`/author/${author_fol.uid}/followers?is_following=true`);
  
  
  return (
    <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 10, alignItems: 'center', padding:'1rem'}}>
      <div
        onClick={nav_to_authors_page}
        style={{
          border: '2px solid gray',
          marginRight: 8,
          borderRadius: '60px',
          padding: 2,
          cursor: 'pointer',
        }}
      >
        <img
          src={
            author_fol?.dp_link === 'none' || !author_fol?.dp_link
              ? light 
              : http_link_fix({ http_link: author_fol?.dp_link })
          }
          alt="author-dp"
          style={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
      </div>

      <div>
        <div
          onClick={nav_to_authors_page}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
            cursor: 'pointer',
          }}
        >
          <span
            style={{
              color: 'black',
              fontFamily: 'Urbanist, sans-serif',
              fontWeight: 500,
              fontSize: 14,
            }}
          >
            {shorten_text({ text: author_fol?.username ?? '', limit: 23 })}
          </span>
          {author_fol?.verified && (
            <img
              src={verify}
              alt="verified"
              style={{
                width: 16,
                height: 16,
                marginLeft: 2,
              }}
            />
          )}
        </div>

        <div
          onClick={open_followers}
          style={{ marginTop: 3, cursor: 'pointer' }}
        >
          <span
            style={{
              fontFamily: 'Urbanist, sans-serif',
              fontWeight: 500,
              color: 'gray',
            }}
          >
            {`${high_nums_converter({ number: author_fol?.followers ?? 0 })} ${
              author_fol?.followers === 1 ? 'Follower' : 'Followers'
            }`}
          </span>
        </div>
      </div>

      {!author_fol.isowner && (
        <div style={{ marginLeft: 'auto' }}>
          <button onClick={follow_unfollow_author} className='refresh-btn'>{author_fol?.followed ? 'following' : 'follow'}</button>
        </div>
      )}
    </div>
  )
}

export default AuthorCard