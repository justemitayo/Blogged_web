import React, {useEffect, useState} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import AccountPopup from './components/AccountPopup/AccountPopup';
import Navbar from './components/Navbar/Navbar';
import ErrorPage from './components/ErrorPage/Error';
import InfoPage from './components/InfoPage/InfoPage';
import Home from './Screen/Home/Home';
import Blog from './Screen/Blog/Blog';
import Otp from './components/ProfileOtp/Otp';
import { query_id } from './config/hook/Query_ID/Query_ID';
import { get_tags } from './config/hook/Tags/Tags';
import { useInfiniteQuery, useQueries } from '@tanstack/react-query';
import { get_adverts } from './config/hook/Adverts/Adverts';
import { global_variables } from './config/hook/Global/Global_Variable';
import { useAppTagStore } from './store/App_Tags';
import { useAppAdvertstore } from './store/App_Adverts';
import { INTF_Tag } from './Interface/Tags';
import { INTF_Advert } from './Interface/Adverts';
import LikePage from './components/Box/LikePage';
import FollowerPage from './Screen/FollowerPage/FollowerPage';



function App() {

  const [loginPop, setLoginPop] = useState<boolean>(false);
  const set_app_tags = useAppTagStore().set_app_tags
  const set_app_adverts = useAppAdvertstore().set_app_adverts

  const queryResults = useQueries({
    queries: [
      {
        queryKey: query_id({}).tags,
        queryFn: get_tags,
        retry: 3,
        refetchIntervalInBackground: true,
        staleTime: 120000,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
      },
    ],
  });
  
  const { isError: tagsError, data: tagsData } = queryResults[0];

  const { data: advertsData, isError: advertsError } = useInfiniteQuery({
    queryKey: query_id({}).adverts,
    queryFn: ({ pageParam = 0 }) =>
      get_adverts({
        paginationIndex: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.data.length === 0) {
        return undefined;
      }
      if (
        lastPage.data.length === global_variables.reloadInfiniteDataLimit
      ) {
        return pages.length;
      }
      return undefined;
    },
    retry: 3,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });
  
  useEffect(() => {
    if (!tagsError) {
        set_app_tags((tagsData?.data as INTF_Tag[]) || [],);
    }
    if (!advertsError) {
        if (advertsData?.pages) {
            set_app_adverts(advertsData?.pages?.flatMap(pages => pages.data || [],) as INTF_Advert[],);
        }
    }
  }, [tagsData, advertsData, tagsError, advertsError, set_app_adverts, set_app_tags]);

  


  return (
    <BrowserRouter>
        {loginPop ? <AccountPopup setLoginPop={setLoginPop}/> : <></>}
       
       <div className='App'>
        <Navbar setLoginPop={setLoginPop}/>
       <Routes>
       <Route path='/' element={<Home />}/>
        <Route path='/info' element={ <InfoPage />} />
        <Route path='/error' element={<ErrorPage />}/>
        <Route path='/otp' element={<Otp />}/>
        <Route path='/blogPost/:bid' element={<Blog />}/>
        <Route path="/likes/:bid" element={<LikePage/>} />
        <Route path="/author/:aid/followers" element={<FollowerPage />} />
        {/* <Route path="/author/:aid" element={<AuthorsPage />} /> */}
       </Routes>
       </div>
    </BrowserRouter>
  );
}

export default App;
