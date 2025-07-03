import React,{useEffect, useState, useRef} from 'react'
import './Otp.css'

const Otp = () => {

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [resendTimer, setResendTimer] = useState(60);

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

  return (
    <div className='verify'>
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
          <p style={{color:"rgb(177, 70, 70)"}}>Resend Email</p>
        </div>
      </div>

      <div>
        <button >Send Mail</button>
      </div>
    </div>
  )
}

export default Otp