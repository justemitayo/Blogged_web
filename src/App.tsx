import React, {useState} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import AccountPopup from './components/AccountPopup/AccountPopup';
import Navbar from './components/Navbar/Navbar';
import ErrorPage from './components/ErrorPage/Error';


function App() {

  const [loginPop, setLoginPop] = useState<boolean>(false)

  return (
    <BrowserRouter>
       {loginPop ? <AccountPopup setLoginPop={setLoginPop}/> : <></>}
       <div className='App'>
        <Navbar setLoginPop={setLoginPop}/>
       </div>
       <Routes>
        <Route path='/error' element={<ErrorPage />}/>
       </Routes>

    </BrowserRouter>
  );
}

export default App;
