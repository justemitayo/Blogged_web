import React, {useState} from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import AccountPopup from './components/AccountPopup/AccountPopup';
import Navbar from './components/Navbar/Navbar';
import ProfilePicture from './components/ProfileOtp/ProfilePicture';
import Otp from './components/ProfileOtp/Otp';

function App() {

  const [loginPop, setLoginPop] = useState<boolean>(false)

  return (
    <BrowserRouter>
       {loginPop ? <AccountPopup setLoginPop={setLoginPop}/> : <></>}
       <div className='App'>
        <Navbar setLoginPop={setLoginPop}/>
        <Otp />
        {/* <ProfilePicture />  */}
       </div>

    </BrowserRouter>
  );
}

export default App;
