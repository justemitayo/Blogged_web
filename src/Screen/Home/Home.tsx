import React, { useState, useEffect } from 'react'
import './Home.css';
import { useInfiniteQuery } from '@tanstack/react-query';
import filter from '../../Assets/svg/filter.svg'
import Box from '../../components/Box/Box';
import {get_foryou_blogs, get_trending_blogs, get_blogs} from '../../config/hook/Blogs/Blogs'
import { useUserInfoStore } from '../../store/User_Info.store';
import { useSearchTagsStore } from '../../store/Search_Tags';
import { useAppTagStore } from '../../store/App_Tags';
import { query_id } from '../../config/hook/Query_ID/Query_ID';
import { global_variables } from '../../config/hook/Global/Global_Variable';
import {INTF_BlogPost } from '../../Interface/Blog_Post'

const Home = () => {
  const [search, setSearch] = useState<string>('');

  const [allBlogs, setAllBlogs] = useState<INTF_BlogPost[]>([]);
  const [forYouBlogs, setForYouBlogs] = useState<INTF_BlogPost[]>([]);
  const [trendingBlogs, setTrendingBlogs] = useState<INTF_BlogPost[]>([]);

  const user_Info = useUserInfoStore().user_info;
  const search_tags = useSearchTagsStore().search_tags;
  const app_tags = useAppTagStore().app_tags;

  const {
    data: allBlogsData,
    error: allBlogsError,
    fetchNextPage: fetchNextAllBlogs,
    hasNextPage: hasNextPageAllBlogs,
    isFetching: isFetchingAllBlogs,
    isFetchingNextPage: isFetchingNextAllBlogs,
    refetch: refetchAllBlogs,
    isLoading: isLoadingAllBlogs,
    isError: isErrorAllBlogs,
  } = useInfiniteQuery({
    queryKey: query_id({}).blogs,
    queryFn: ({ pageParam = 0 }) =>
      get_blogs({
        search: search.length <= 1 ? '' : search,
        user_token: user_Info?.token,
        tags: search_tags,
        paginationIndex: pageParam,
      }),
    initialPageParam: 0,   
    getNextPageParam: (lastPage, pages) =>
      lastPage.data.length === global_variables.reloadInfiniteDataLimit
        ? pages.length + 1
        : undefined,
    enabled: false,
  });


  const {
    data: forYouBlogsData,
    refetch: refetchForYouBlogs,
    isError: isErrorForYouBlogs
  } = useInfiniteQuery({
    queryKey:  query_id({}).foryoublogs,
    queryFn: ({ pageParam = 0 }) =>
      get_foryou_blogs({
        user_token: user_Info?.token || '',
        paginationIndex: pageParam,
      }),
    initialPageParam: 0,   
    getNextPageParam: (lastPage, pages) =>
      lastPage.data.length === global_variables.reloadInfiniteDataLimit
        ? pages.length + 1
        : undefined,
  });

  useEffect(() => {
    refetchAllBlogs();
}, [search, search_tags,refetchAllBlogs]);


  const {
    data: trendingBlogsData,
    refetch: refetchTrendingBlogs,
    isError: isErrorTrendingBlogs
  } = useInfiniteQuery({
    queryKey:  query_id({}).trendingblogs,
    queryFn: ({ pageParam = 0 }) =>
      get_trending_blogs({
        user_token: user_Info?.token || '',
        paginationIndex: pageParam,
      }),
    initialPageParam: 0,   
    getNextPageParam: (lastPage, pages) =>
      lastPage.data.length === global_variables.reloadInfiniteDataLimit
        ? pages.length + 1
        : undefined,
  });
    useEffect(() => {
      refetchAllBlogs();
      refetchForYouBlogs();
      refetchTrendingBlogs();
    }, [search, search_tags, refetchAllBlogs, refetchForYouBlogs, refetchTrendingBlogs]);

    useEffect(() => {
      if (!isErrorAllBlogs && allBlogsData?.pages) {
          setAllBlogs(allBlogsData.pages.flatMap(p => p.data));
      }
  }, [allBlogsData, isErrorAllBlogs]);

  useEffect(() => {
      if (!isErrorForYouBlogs && forYouBlogsData?.pages) {
          setForYouBlogs(forYouBlogsData.pages.flatMap(p => p.data));
      }
  }, [forYouBlogsData, isErrorForYouBlogs]);

  useEffect(() => {
      if (!isErrorTrendingBlogs && trendingBlogsData?.pages) {
          setTrendingBlogs(trendingBlogsData.pages.flatMap(p => p.data));
      }
  }, [trendingBlogsData, isErrorTrendingBlogs]);

  return (
    <div className='home'>
      <div className='home-header'>
        <input 
          placeholder='Search for Blogs...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={isFetchingAllBlogs} 
        />
        <img src={filter} alt=''/>
      </div>

        {isErrorAllBlogs && (
          <div className="error-container">
            <p className="error-title">An Error Occurred! Press the Button below to Refresh.</p>
            <p className="error-message">{allBlogsError?.message || 'An error occurred.'}</p>
            <button onClick={() => refetchAllBlogs()} className="refresh-btn">
              Refetch
            </button>
          </div>
        )}

        {!isErrorAllBlogs && !isLoadingAllBlogs && allBlogs.length === 0 && (
          <p className="no-blogs">No Blogs Found!</p>
        )}

      {!isErrorAllBlogs && !isLoadingAllBlogs && allBlogs.length > 0 && (
        <div className='home-content'>
          {allBlogs.map((item, index) => (
            <React.Fragment key={item.bid}>
            {index === 0 && trendingBlogs.length > 0 && search.length === 0 && search_tags.length === 0 && (
                <div className='home-blog'>
                  {trendingBlogs.map((blog) => (
                    <Box key={'Trending' + blog.bid} blog_post={blog} index={0} tags={app_tags} />
                  ))}
                </div>
              )}

              {index === 3 && forYouBlogs.length > 0 && search.length === 0 && search_tags.length === 0 && (
              <>
                <div className="divider" />
                <h2>Recommended</h2>
                <div className='home-blog'>
                {forYouBlogs.map((blog) => (
                  <Box key={'ForYou' + blog.bid} blog_post={blog} index={0} tags={app_tags} />
                ))}
                </div>
                <div className="divider" />
              </>
             )}
              <Box blog_post={item} index={index} tags={app_tags} />
            </React.Fragment>
          ))}
        <div className="load-more-section">
          {hasNextPageAllBlogs && (
            <button
              onClick={() => fetchNextAllBlogs()}
              disabled={isFetchingNextAllBlogs}
              className="load-more-btn"
            >
              {isFetchingNextAllBlogs ? 'Loading more...' : 'Load More'}
            </button>
          )}
        </div>
        </div>
      )}
    </div>
  )
}

export default Home