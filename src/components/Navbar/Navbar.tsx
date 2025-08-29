import React, { useState } from "react";
import "./Navbar.css";
import { useUserInfoStore } from "../../store/User_Info.store";
import { Link } from "react-router-dom";
import blogged from '../../Assets/icon/Blogged_Logo_Black.png'

interface props {
  setLoginPop: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar = ({ setLoginPop }: props) => {
  const user_info = useUserInfoStore().user_info;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <img src={blogged} alt="blogged"/>

      {user_info?.token ? (
        <>
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          </li>
          <li>
            <Link to="/createblog" onClick={() => setMenuOpen(false)}>Create</Link>
          </li>
          <li>
            <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
          </li>
          <li>
            <Link to="/setting" onClick={() => setMenuOpen(false)}>Settings</Link>
          </li>
        </ul>

          <div
            className={`hamburger ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </>
      ) : (
        <button onClick={() => setLoginPop(true)}>Sign In</button>
      )}
    </nav>
  );
};

export default Navbar;
