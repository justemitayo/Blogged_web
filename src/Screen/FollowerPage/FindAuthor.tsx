import React, { useEffect, useState } from 'react'
import AuthorCard from '../../components/Author/AuthorCard';
import { useNavigate } from 'react-router-dom';
import { INTF_AuthorDesc } from '../../Interface/Author_Desc';
import { useInfiniteQuery } from '@tanstack/react-query';
import { query_id } from '../../config/hook/Query_ID/Query_ID';
import { get_authors } from '../../config/hook';
import { useUserInfoStore } from '../../store/User_Info.store';
import { global_variables } from '../../config/Global/Global_Variable';
import back from '../../Assets/icon/Back_Arrow.png'
import './FollowerPage.css'

const FindAuthor = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState<string>('');
  const [folData, setFolData] = useState<INTF_AuthorDesc[]>([]);

  const user_info = useUserInfoStore().user_info

  const {
    error,
    data,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    refetch,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: query_id({}).authors,
  
    queryFn: ({ pageParam = 0 }) =>
     get_authors({
      search: search,
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
  });
  
  const showSpinner = isLoading && !data;


  useEffect(() => {
    refetch();
}, [search, refetch]);



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
        <h2>Find Authors</h2>
      </div>

      {/* Spinner */}
      {(showSpinner || isLoading) && (
        <div className="overlay-spinner">
          <div className="spinner" />
          <p>Loading...</p>
        </div>
      )}



      <div className='home-headers'>
        <input 
          placeholder='Search for Authors...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={isFetching} 
        />
      </div>


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
        <p className="empty-text">No Authors Found!</p>
      )}

      {/* List */}
      {!isError && folData.length > 0 && (
        <div className="followers-list" onScroll={handleScroll}>
          {folData.map((item) => (
            <AuthorCard
              author_fol={item}
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

export default FindAuthor