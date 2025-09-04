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
import back from '../../Assets/icon/Back_Arrow.png'
import { INTF_Tag } from '../../Interface/Tags';
import { no_double_clicks } from '../../utils/no_double_click/no_double_clicks';
import TagButton from '../../components/Tag/TagButton';
import LandingPage from '../LandingPage/LandingPage';

interface props {
  setLoginPop: React.Dispatch<React.SetStateAction<boolean>>;
}
const Home = ({ setLoginPop }: props) => {
  const [search, setSearch] = useState<string>('');

  const [allBlogs, setAllBlogs] = useState<INTF_BlogPost[]>([]);
  const [forYouBlogs, setForYouBlogs] = useState<INTF_BlogPost[]>([]);
  const [trendingBlogs, setTrendingBlogs] = useState<INTF_BlogPost[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);




  const user_Info = useUserInfoStore().user_info;
  console.log({ user_Info })
  const search_tags = useSearchTagsStore().search_tags;
  const app_tags = useAppTagStore().app_tags;
  const clear_search_tags = useSearchTagsStore().clear_search_tags

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const {
    data: allBlogsData,
    error: allBlogsError,
    fetchNextPage: fetchNextAllBlogs,
    hasNextPage: hasNextPageAllBlogs,
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
      enabled: search.length > 0 || search_tags.length > 0, 
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

  const clear_search_tags_func = no_double_clicks({
      execFunc: () => {
          clear_search_tags();
      },
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
      {user_Info?.token ? (<>
      <div className='home-header'>
        <input 
          placeholder='Search for Blogs...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <img src={filter} alt='' onClick={openModal}/>
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
            <React.Fragment>
              {trendingBlogs.length > 0 && search.length === 0 && search_tags.length === 0 && (
                <div>  
                    <h2>Trending</h2>
                  <div>
                    {trendingBlogs.map((blog) => (
                      <Box key={'Trending' + blog.bid} blog_post={blog} index={0} tags={app_tags} />
                    ))}
                  </div>
                  <div className="divider" />
                </div>

              )}
              <div className='home-blog'>
                {allBlogs.map((item, index) => (
                    <Box key={item.bid} blog_post={item} index={index} tags={app_tags} />
                ))}
              </div>

              { forYouBlogs.length > 0 && search.length === 0 && search_tags.length === 0 && (
                <div>
                  <div className="divider" />
                  <h2>Recommended</h2>
                  <div className='home-blog'>
                  {forYouBlogs.map((blog) => (
                    <Box key={'ForYou' + blog.bid} blog_post={blog} index={0} tags={app_tags} />
                  ))}
                  </div>
                  <div className="divider" />
                </div>
               )}
            </React.Fragment>
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
      {showModal && 
        (app_tags || []) !== null &&
        (app_tags || []) !== undefined &&
        (app_tags || [])?.length > 0 && (
          <div className='side-modal'>
            <img src={back} alt='' className='back' onClick={closeModal} />
            <div className='modal-content'>
              <h2>Filter your Feeds:</h2>
              <div className='tag-in'>
                {app_tags !== undefined &&
                (app_tags || [])?.map(
                    (tag: INTF_Tag, index: number) => (
                        <TagButton tag={tag} key={index} />
                    ),
                )}
              </div>
              <button onClick={ clear_search_tags_func } className='filter'>Clear Filters</button>
            </div>
          </div>

        )
      }
      </>) : (
        <LandingPage setLoginPop={setLoginPop}/>
      )}
    </div>
  )
}

export default Home