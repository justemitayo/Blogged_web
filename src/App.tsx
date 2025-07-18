import React, {useState} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import AccountPopup from './components/AccountPopup/AccountPopup';
import Navbar from './components/Navbar/Navbar';
import ErrorPage from './components/ErrorPage/Error';
import InfoPage from './components/InfoPage/InfoPage';
import Home from './Screen/Home/Home';
import Blog from './Screen/Blog/Blog';


function App() {

  const [loginPop, setLoginPop] = useState<boolean>(false)

  return (
    <BrowserRouter>
        {loginPop ? <AccountPopup setLoginPop={setLoginPop}/> : <></>}
       
       <div className='App'>
        <Navbar setLoginPop={setLoginPop}/>
       <Routes>
       <Route path='/' element={<Home />}/>
        <Route path='/info' element={ <InfoPage />} />
        <Route path='/error' element={<ErrorPage />}/>
        <Route path='/blogPost' element={<Blog />}/>
       </Routes>
       </div>
    </BrowserRouter>
  );
}

export default App;
