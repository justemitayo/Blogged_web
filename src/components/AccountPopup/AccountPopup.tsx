import React, { useState } from 'react'
import './AccountPopup.css'
import ProfilePicture from '../ProfileOtp/ProfilePicture';


interface props{
  setLoginPop: React.Dispatch<React.SetStateAction<boolean>>
}
const AccountPopup = ({setLoginPop}:props) => {
  const[currState, setCurrState] = useState<'Login' | 'signup' | 'pass'>('Login');
  const [step, setStep] = useState<'signup' | 'pic' |'otp' >('signup');


  return (
    <div className='account-popup'>
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
                    placeholder='Enter your email'
                    required
                  />
                  <input 
                    type='password'
                    name='password'
                    placeholder='Enter your password'
                    required
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
              <button>Login</button>
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