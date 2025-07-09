import React, {useState} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import AccountPopup from './components/AccountPopup/AccountPopup';
import Navbar from './components/Navbar/Navbar';
import ErrorPage from './components/ErrorPage/Error';
import InfoPage from './components/InfoPage/InfoPage';
import Home from './Screen/Home/Home';


function App() {

  const [loginPop, setLoginPop] = useState<boolean>(false)

  return (
    <BrowserRouter>
       
       <div className='App'>
        <Navbar setLoginPop={setLoginPop}/>
        {loginPop ? <AccountPopup setLoginPop={setLoginPop}/> : <></>}
       </div>
       <Routes>
        <Route path='/info' element={ <InfoPage />} />
        <Route path='/error' element={<ErrorPage />}/>
        <Route path='/' element={<Home />}/>

       </Routes>

    </BrowserRouter>
  );
}

export default App;
