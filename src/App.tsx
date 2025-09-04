import React, {useEffect, useState} from 'react';
import {Route, Routes, useNavigate } from 'react-router-dom';
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
import AuthorsPage from './Screen/AuthorsPage/AuthorsPage';
import Profile from './Screen/ProfilePage/Profile';
import CreateBlog from './Screen/BlogPage/CreateBlog';
import BlogTitle from './Screen/BlogPage/Blog-title/BlogTitle';
import BlogTagPage from './Screen/BlogPage/BlogTag/BlogTag';
import BlogDp from './Screen/BlogPage/BlogDp/BlogDp';
import BlogMessage from './Screen/BlogPage/BlogMessage/BlogMessage';
import SettingPage from './Screen/Settings/SettingPage/SettingPage';
import Feedback from './Screen/Settings/Feedback/Feedback';
import Tag from './Screen/Settings/Feedback/Tag';
import Username from './Screen/Settings/Feedback/Username';
import Password from './Screen/Settings/Feedback/Password';
import ProfileSet from './Screen/Settings/Profile/ProfileSet';
import FindAuthor from './Screen/FollowerPage/FindAuthor';
import ProfilePicture from './components/ProfileOtp/ProfilePicture';
import { error_handler } from './utils/Error_Handler/Error_Handler';



function App() {

  const [loginPop, setLoginPop] = useState<boolean>(false);
  const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState<string>('');

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
    } else{
                  error_handler({
                      navigate,
                      error_mssg: 'Tags Error Message',
                  });
    }
    if (!advertsError) {
        if (advertsData?.pages) {
            set_app_adverts(advertsData?.pages?.flatMap(pages => pages.data || [],) as INTF_Advert[],);
        }
    }else {
      error_handler({
        navigate,
        error_mssg: 'Advert Error Message',
    });
    }
  }, [navigate, tagsData, advertsData, tagsError, advertsError, set_app_adverts, set_app_tags]);

  


  return (
    <>
        {loginPop ? 
        <AccountPopup setLoginPop={setLoginPop}  
          email={email} setEmail={setEmail}
          password={password} setPassword={setPassword}
          username={username} setUsername={setUsername}
        /> 
        : <></>}
       
       <div className='App'>
        <Navbar setLoginPop={setLoginPop}/>
       <Routes>
       <Route path='/' element={<Home setLoginPop={setLoginPop}/>}/>
        <Route path='/info' element={ <InfoPage />} />
        <Route path='/error' element={<ErrorPage />}/>
        <Route path='/otp' element={<Otp />}/>
        <Route path='/pic' element={<ProfilePicture 
          email={email}
          password={password}
          username={username}
        />}/>

        <Route path='/blogPost/:bid' element={<Blog />}/>

        <Route path="/likes/:bid" element={<LikePage/>} />

        <Route path="/author/:aid/followers" element={<FollowerPage />} />
        <Route path="/author/:aid" element={<AuthorsPage />} />

        <Route path='/createblog' element={<CreateBlog />}/>
        <Route path='/blog-title' element={<BlogTitle />} />
        <Route path='/blog-tags' element={<BlogTagPage />} />
        <Route path='/blogdp' element={<BlogDp />} />
        <Route path='/blog-message' element={<BlogMessage />} />
        
        

        <Route path="/profile" element={<Profile />} />


        <Route path="/setting" element={<SettingPage />} />
        <Route path="/setting/change-username" element={<Username />} />
        <Route path="/setting/feedback" element={<Feedback />} />
        <Route path="/setting/suggest-tag" element={<Tag />} />
        <Route path="/setting/change-password" element={<Password />} />
        <Route path="/setting/update-dp" element={<ProfileSet />} />
        <Route path="/setting/find-author" element={<FindAuthor />} />





       </Routes>
       </div>
    </>
  );
}



export default App;
