import React,{useEffect, useState, useRef} from 'react'
import './Otp.css'
import { useUserInfoStore } from '../../store/User_Info.store';
import { useNavigate } from 'react-router-dom';
import { error_handler } from '../../utils/Error_Handler/Error_Handler';
import { useMutation } from '@tanstack/react-query';
import { send_email_ver, confirm_email} from '../../config/hook/user/User';
import { saveString } from '../../config/domain/Storage';
import { strings } from '../../config/domain/Strings';
import { no_double_clicks } from '../../utils/no_double_click/no_double_clicks';


const Otp = () => {

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [resendTimer, setResendTimer] = useState(60);
  const [showSpinner, setShowSpinner] = useState(false);

  const user_info = useUserInfoStore().user_info;
  const set_user_info = useUserInfoStore().set_user_info;
  const navigate = useNavigate();


  const { mutate: send_mail_mutate } = useMutation({
    mutationFn: send_email_ver, 

    onMutate: () => setShowSpinner(true),
    onSettled: (data) => {
      setShowSpinner(false);
      if (data?.error) {
        error_handler({ navigate, error_mssg: data?.data });
      } else {
        setResendTimer(60); // restart countdown
      }
    }
  });

  const { mutate: confirm_mail_mutate } = useMutation({
    mutationFn: confirm_email,

    onMutate: () => setShowSpinner(true),
    onSettled: async (data) => {
      setShowSpinner(false);
      if (data?.error) {
        error_handler({ navigate, error_mssg: data?.data });
      } else {
        const token = user_info?.token;
        const uid = user_info?.uid;

        if (!token || !uid) {
          error_handler({ navigate, error_mssg: 'Invalid user session.' });
          return;
        }

        await saveString(strings.userToken, token);
        set_user_info({
            email_v: true,
            token,
            uid,
        });
        navigate('/', { replace: true });
      }
    },
  });


  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);
//   It starts a countdown from the current resendTimer value (typically 60 seconds).
// Every second (1000ms), it decrements the timer by 1.

  useEffect(() => {
    inputsRef.current[activeIndex]?.focus();
    // Whenever activeIndex changes (e.g., after typing or backspacing), this effect runs.
  }, [activeIndex]);

    // Auto-trigger email send on page mount
  useEffect(() => {
    const token = user_info?.token;
  
    if (token) {
      send_mail_mutate({ user_token: token });
    } else {
      navigate('/', { replace: true });
    }
  }, [user_info?.token, navigate, send_mail_mutate]);

    const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value) || index !== activeIndex) return;
    // ensures that only a single digit (0–9) is allowed. It ignores anything else.

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      setActiveIndex(index + 1);
      inputsRef.current[index + 1]?.focus(); 
      //  shifts the cursor to the next input field.
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      setActiveIndex(index - 1);
      inputsRef.current[index - 1]?.focus();
      // Checks if the pressed key is 'Backspace'.
      // If the current field is empty and it's not the first field, move focus back to the previous field.
    }
  };

  const verifyOtp = no_double_clicks({
    execFunc: () => {
      const code = otp.join('');
      if (code.length === 6 && user_info?.token) {
        confirm_mail_mutate({
          otp: code,
          user_token: user_info.token,
        });
      } else {
        error_handler({
          navigate,
          error_mssg: 'Please enter a valid 6-digit code.',
        });
      }
    }
  });

  const resendEmail = no_double_clicks({
    execFunc: async() => {
      if (user_info?.token) {
        send_mail_mutate({ user_token: user_info.token });
      }
    }
  });

  

  return (
    <div className='verify'>
         {showSpinner &&
                  <div className="overlay-spinner">
                  <div className="spinner" />
                  <p>Verifying...</p>
                </div>}
      <h4>Let's verify your Email</h4>
      <div style={{display:'flex', justifyContent:'center',alignItems:'center',placeItems:"center"}}>
        <span style={{color:"rgb(117, 110, 110)"}} >Please input the One-Time-Password (OTP) sent to your Email Address.</span>
      </div>
      <div>
      {otp.map((digit, idx) => (
        <input
          key={idx}
          name='token'
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          ref={(el) => {(inputsRef.current[idx] = el)}}
          onChange={(e) => handleChange(e.target.value, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
        />
        ))}
        <div style={{display:'flex', justifyContent:'flex-end',alignItems:'center',placeItems:"center"}}>
          <p style={{color:"rgb(177, 70, 70)"}}  onClick={resendEmail}>
          {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
          </p>
        </div>
      </div>

      <div>
        <button onClick={verifyOtp}>Send Mail</button>
      </div>
    </div>
  )
}

export default Otp