import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { query_id } from '../../config/hook/Query_ID/Query_ID';
import { get_author_followers, get_author_following } from '../../config/hook';
import { useUserInfoStore } from '../../store/User_Info.store';
import { global_variables } from '../../config/Global/Global_Variable';
import { INTF_AuthorDesc } from '../../Interface/Author_Desc';
import AuthorFol from '../../components/Author/AuthorFol';
import back from '../../Assets/icon/Back_Arrow.png'
import './FollowerPage.css'

const FollowerPage = () => {
  const { aid } = useParams<{ aid: string }>();
  const location = useLocation();
  const is_following = (location.state as any)?.is_following ?? false;
  const navigate = useNavigate()

  const showSpinner = false;
  const [folData, setFolData] = useState<INTF_AuthorDesc[]>([]);

  const user_info = useUserInfoStore().user_info

  const {
    error,
    data,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: is_following ? query_id({ id: aid }).author_followings_with_id : query_id({ id: aid }).author_followers_with_id,
  
    queryFn: ({ pageParam = 0 }) =>
      is_following
        ? get_author_following({
            authorID: aid!,
            user_token: user_info?.token,
            paginationIndex: pageParam,
          })
        : get_author_followers({
            authorID: aid!,
            user_token: user_info?.token,
            paginationIndex: pageParam,
          }),
    
          initialPageParam: 0,
  
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.data.length === 0) return undefined;
      if (
        lastPage.data.length === global_variables.reloadInfiniteDataLimit
      ) {
        return pages.length + 1;
      }
      return undefined;
    },
  
    retry: 3,
    enabled: Boolean(aid),
  });
  


  useEffect(() => {
    if (!isError) {
      if (data?.pages) {
        const newFolData = data.pages.flatMap((page) => page.data);
        setFolData(newFolData);
      } else {
        setFolData([]);
      }
    }
  }, [data, isError]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      fetchNextPage();
    }
  };
  return (
    <div className="follower-page">
      <img alt='' src={back} className='back' onClick={() => navigate(-1)}/>
      {/* Header */}
      <div className="header">
        <h2>{is_following ? 'Followings' : 'Followers'}</h2>
      </div>

      {/* Spinner */}
      {(showSpinner || !aid || isLoading) && (
        <div className="overlay-spinner">
          <div className="spinner" />
          <p>Loading...</p>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="error-box">
          <p className="error-msg">An error occurred. Try again.</p>
          <p className="error-detail">{(error as any)?.message || 'Unknown error'}</p>
          <button onClick={() => refetch()} className="refresh-btn">Refresh</button>
        </div>
      )}

      {/* Empty */}
      {!isError && !isLoading && folData.length === 0 && (
        <p className="empty-text">{is_following ? 'No Followings!' : 'No Followers!'}</p>
      )}

      {/* List */}
      {!isError && folData.length > 0 && (
        <div className="followers-list" onScroll={handleScroll}>
          {folData.map((item, index) => (
            <AuthorFol
              key={`${item.uid}-${index}`}
              author_fol={item}
              author_id={aid!}
              is_following={is_following}
            />
          ))}
          {hasNextPage && (
            <p className="footer-loading">
              {isFetchingNextPage ? 'Loading more...' : ''}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default FollowerPage