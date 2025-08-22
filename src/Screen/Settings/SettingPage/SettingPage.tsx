import React from "react";

import "./SettingPage.css";
import MenuMaker from "../../../components/MenuMaker/MenuMaker";
import SectionHeader from "../../../components/MenuMaker/SectionHeader";
import { http_link_fix } from "../../../utils/HTTP_Link_Fix/HTTP_Link_Fix";
import { shorten_text } from "../../../Shorten_Text/Shorten_Text";
import { mongo_date_converter_1 } from "../../../utils/Mongo_Date_Converter/Mongo_Date_Converter";
import { profile_menu_1, profile_menu_2, profile_menu_3, profile_menu_4, profile_menu_5 } from "../../../data/Profile_Menu/Profile_Menu";
import { useUserDataStore } from "../../../store/User_Data.store";
import { useUserInfoStore } from "../../../store/User_Info.store";
import profile from '../../../Assets/icon/default_user_dp_light.jpg'
import verifys from '../../../Assets/icon/Verified_Icon.png'
const SettingsPage: React.FC = () => {
  const showSpinner =false;

  const userData = useUserDataStore().user_data
  const userInfo = useUserInfoStore().user_info

  return (
    <div className="settings-container">
      {showSpinner && <div className="overlay-spinner">Loading...</div>}

      <div className="profile-header">
        <div className="profile-pic-wrapper">
          <img
            className="profile-pic"
            src={
              userData?.dp_link && userData?.dp_link !== "none"
                ? http_link_fix({ http_link: userData.dp_link })
                : profile
            }
            alt="Profile"
          />
        </div>

        <div className="profile-info">
          <h2 className="username">
            {shorten_text({ text: userData?.username || "", limit: 22 })}
            {userData?.verified && (
              <img
                src={verifys}
                alt=""
                className="verified-icon"
              />
            )}
          </h2>
          <p className="joined-text">
            Joined{" "}
            {mongo_date_converter_1({
              input_mongo_date: userData?.createdAt || "",
            })}
          </p>
        </div>
      </div>

      {/* Account */}
      <SectionHeader icon="👤" title="Account" />
      <MenuMaker menu={profile_menu_1} bgColor= '#b7aef1' />

      {/* Authors */}
      <SectionHeader icon="📚" title="Authors" />
      <MenuMaker menu={profile_menu_5} bgColor="#b6eab1" />

      {/* Feedback */}
      <SectionHeader icon="📻" title="Feedback" />
      <MenuMaker menu={profile_menu_3} bgColor="#f2c39b" />

      {/* Email Verification */}
      {!userInfo?.email_v && (
        <>
          <SectionHeader icon="✉️" title="Email Verification" />
          <MenuMaker menu={profile_menu_2} />
        </>
      )}

      {/* Privacy */}
      <SectionHeader icon="🛡️" title="Privacy & Security" />
      <MenuMaker menu={profile_menu_4} bgColor="#e7b3b3" />
    </div>
  );
};


export default SettingsPage;
