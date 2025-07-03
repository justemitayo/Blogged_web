import React from 'react'
import './Navbar.css'


interface props{
  setLoginPop: React.Dispatch<React.SetStateAction<boolean>>
}

const Navbar = ({setLoginPop}:props) => {
  return (
    <div className='navbar'>
      <h2>Blogged</h2>
      <button onClick={() => setLoginPop(true)}>Sign In</button>
    </div>
  )
}

export default Navbar