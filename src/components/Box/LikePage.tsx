import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { INTF_AuthorDesc } from '../../Interface/Author_Desc';
import { useUserInfoStore } from '../../store/User_Info.store';
import { global_variables } from '../../config/hook/Global/Global_Variable';
import { useInfiniteQuery } from '@tanstack/react-query';
import { query_id } from '../../config/hook/Query_ID/Query_ID';
import { get_blog_likes } from '../../config/hook';
import use from '../../Assets/icon/Back_Arrow.png'
import RefreshIcon from '@mui/icons-material/Refresh';
import BlogLikes from './BlogLikes';

const LikePage = () => { 

  const { bid } = useParams<{ bid: string }>();

  const [blogLikes, setBlogLikes] = useState<INTF_AuthorDesc[]>([]);

  const user_info = useUserInfoStore().user_info

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    error,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery(
    {
      queryKey: query_id({}).blog_with_id_likes,
      queryFn: ({ pageParam = 0 }) =>
        get_blog_likes({
          blogID: bid!,
          user_token: user_info?.token || '',
          paginationIndex: pageParam,
        }),
        initialPageParam: 0,
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.data.length === 0) return undefined;
        if (lastPage.data.length === global_variables.reloadInfiniteDataLimit)
          return pages.length + 1;
        return undefined;
      },
      retry: 3,
      enabled: !!bid,
    }
  );

  useEffect(() => {
    if (!isError) {
        if (data?.pages) {
            const newBlogLikes = data.pages.flatMap(page => page.data);
            setBlogLikes(newBlogLikes);
        } else {
            setBlogLikes([]);
        }
    }
}, [data, isError]);

  return (
    <div className="likes-page" style={{ backgroundColor: '#fdfdfd', minHeight: '100vh' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px 22px' }}>
        <img alt='' onClick={() => window.history.back()} style={{ marginRight: 20 }} src={use}/>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Likes</h2>
      </div>

      {/* Loading Spinner */}
      {(!bid || isLoading) && (
        <div className="overlay-spinner">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
      )}

      {/* Error State */}
      {isError && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20 }}>
          <p style={{ color: '#FFBF00', fontWeight: 500, textAlign: 'center', maxWidth: 300 }}>
            An Error Occurred! Press the Button below to Refresh.
          </p>
          <p style={{ color: 'red', fontWeight: 500 }}>{(error as any)?.message || 'An error occurred.'}</p>
          <button onClick={() => refetch()} style={{ marginTop: 10 }}>
            <RefreshIcon  />
          </button>
        </div>
      )}

      {/* No Likes */}
      {!isError && blogLikes.length === 0 && !isLoading && (
        <div style={{ textAlign: 'center', marginTop: '30vh', color: '#333', fontWeight: 500 }}>
          No Likes!
        </div>
      )}

      {/* Likes List */}
      {!isError && blogLikes.length > 0 && (
        <div style={{ padding: '0 20px' }}>
          {blogLikes.map((item, index) => (
            <BlogLikes key={item.uid} blog_like={item} blog_id={bid!} />
          ))}

          {/* Load more */}
          {hasNextPage && (
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 5,
                  cursor: 'pointer',
                }}
              >
                {isFetchingNextPage ? 'Loading more...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default LikePage