import React, { useState } from 'react'
import './AccountPopup.css'
import ProfilePicture from '../ProfileOtp/ProfilePicture';
import { useNavigate } from 'react-router-dom';
import { useUserInfoStore } from '../../store/User_Info.store';
import { useMutation } from '@tanstack/react-query';
import { error_handler } from '../../utils/Error_Handler/Error_Handler';
import { regex_email_checker } from '../../utils/Email_Checker/Email_Checker';
import { sign_in } from '../../config/hook/user/User';
import { saveString } from '../../config/domain/Storage';
import { strings } from '../../config/domain/Strings';



interface props{
  setLoginPop: React.Dispatch<React.SetStateAction<boolean>>
}
const AccountPopup = ({setLoginPop}:props) => {
  const[currState, setCurrState] = useState<'Login' | 'signup' | 'pass'>('Login');
  const [step, setStep] = useState<'signup' | 'pic' |'otp' >('signup');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);
  const [disableButton, setDisableButton] = useState(false);


  const setUserInfo = useUserInfoStore().set_user_info

  const { mutate: sign_in_mutate } = useMutation({
    mutationFn: sign_in,
    onMutate: () => {
      setDisableButton(true);
      setShowSpinner(true);
    },
    onSettled: async (data) => {
      setShowSpinner(false);
      setDisableButton(false);

      if (data?.error) {
        error_handler({
          navigate,
          error_mssg: data.data,
        });
        return;
      }
            // Success
      const { token, uid, email_v } = data?.data;
      await saveString(strings.userToken, token);
      setUserInfo({ token, uid, email_v });
      navigate('/', { replace: true });
    },
  });

  const signInUser = () => {
    if (regex_email_checker({ email }) && password) {
      sign_in_mutate({ email, password });
    } else {
      error_handler({
        navigate,
        error_mssg: 'Email or password cannot be empty!',
      });
    }
  };



  return (
    <div className='account-popup'>
    {showSpinner && <div>Loading...</div>}
      {step === 'signup' ? (
        <form className='popup-component'>
          {
            currState === 'Login' ? (
            <label>
              <h4>Welcome back! Glad to see you again!</h4>
              <h3 onClick={() => setLoginPop(false)}>x</h3>
            </label>
            ): currState === 'signup' ? (
              <label>
                <h4>Hello! Register to get Started</h4>
                <h3 onClick={() => setCurrState('Login')}>x</h3>
              </label>
            ): (
              <>
                <label>
                  <h4>Forgot Password?</h4>
                  <h3 onClick={() => setCurrState('Login')}>x</h3>
                </label>
                <span className='p'>Don't worry! It occurs. Please enter the email address linked to your account</span>
              </>
            )
          }
          {
            currState === 'Login' ? (
              <>

                <div className='account-input'>
                  <input 
                    type='email'
                    name='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Enter your email'
                    required
                    disabled={disableButton}
                  />
                  <input 
                    type='password'
                    name='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Enter your password'
                    required
                    disabled={disableButton}
                  />
                  <p className='d' onClick={() => setCurrState('pass')}>Forgot Password?</p>
                </div>
              </>

            ) : currState === 'signup' ? (
              <div className='account-input'>
                <input 
                  type='Username'
                  name='Username'
                  placeholder='Username'
                  required
                />
                <input 
                  type='Email'
                  name='Email'
                  placeholder='Email'
                  required
                />
                <input 
                  type='Password'
                  name='Password'
                  placeholder='Password'
                  required
                />
                <input 
                  type='Confirm Password'
                  name='Confirm Password'
                  placeholder='Confirm Password'
                  required
                />
              </div>
            ) : (
                <div className='account-input'>
                <input 
                  type='email'
                  name='email'
                  placeholder='Enter your email'
                  required
                />
                </div>
            )
          }
          {
            currState === 'Login' ? (
              <button onClick={signInUser}>Login</button>
            ) : currState === 'signup' ? (
              <button>Proceed</button>
            ) : (
              <button>Send Mail</button>
            )
          }
          {
            currState === 'Login' ? (
              <p style={{color:'white'}}>Create a new account? <span style={{color:'green'}} onClick={() => setCurrState('signup')}>Register Now</span></p>
            ) : currState === 'signup' ? (
              <p style={{color:'white'}}>Create a new account? <span style={{color:'green'}} onClick={() => setCurrState('Login')}>Login Now</span></p>
            ) : null
          }
        </form>

      ): step === 'pic' ? (<ProfilePicture  setCurrState={setCurrState}/>): (<p>h</p>)}
    </div>
  )
}

export default AccountPopup