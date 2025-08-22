import React from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { INTF_ProfileMenu } from "../../Interface/Profile_Menu";
import "./MenuMaker.css";

interface MenuMakerProps {
  menu: INTF_ProfileMenu[];
  bgColor?: string;
}

const MenuMaker: React.FC<MenuMakerProps> = ({ menu, bgColor }) => {
  const navigate = useNavigate();

  const handleClick = (item: INTF_ProfileMenu) => {
    if (item.route) {
      navigate(item.route, { state: { ...item.state } });
    } else {
      navigate("/", { state: { ...item.state } });
    }
  };

  return (
    <div
      className="menu-container"
      style={{
        backgroundColor: bgColor || "#fff",
        margin: "0 22px",
        borderRadius: 10,
      }}
    >
      {menu.map((item, index) => (
        <div key={item.id} className="menu-item-wrapper">
          <button className="menu-item" onClick={() => handleClick(item)}>
            <span className="menu-text" style={{ color: "#333" }}>
              {item.name}
            </span>
            <FiChevronRight className="menu-arrow" />
          </button>
          {index !== menu.length - 1 && (
            <hr className="menu-divider" style={{ borderColor: "rgba(0,0,0,0.1)" }} />
          )}
        </div>
      ))}
    </div>
  );
};

export default MenuMaker;
