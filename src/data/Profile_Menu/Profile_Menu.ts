// src/config/profileMenu.ts
import { INTF_ProfileMenu } from "../../Interface/Profile_Menu";

export const profile_menu_1: INTF_ProfileMenu[] = [
  {
    id: 1,
    name: "Change Username",
    route: "/profile/change-username",
    state: {}
  },
  {
    id: 2,
    name: "Change Display Picture",
    route: "/profile/update-dp",
    state: {}
  },
];

export const profile_menu_2: INTF_ProfileMenu[] = [
  {
    id: 1,
    name: "Verify Email",
    route: "/profile/verify-email",
    state: {}
  },
];

export const profile_menu_3: INTF_ProfileMenu[] = [
  {
    id: 1,
    name: "Send Feedback",
    route: "/profile/feedback",
    state: {}
  },
  {
    id: 2,
    name: "Suggest Tag",
    route: "/profile/suggest-tag",
    state: {}
  },
];

export const profile_menu_4: INTF_ProfileMenu[] = [
  {
    id: 1,
    name: "Change Password",
    route: "/profile/change-password",
    state: {}
  },
  {
    id: 2,
    name: "Delete Account",
    route: "/info",
    state: {
      hide_back_btn: false,
      success_mssg: "Are you sure you want to 'Delete' your Account?",
      proceed_type: 4,
      hide_header: true,
    },
  },
  {
    id: 3,
    name: "Sign Out",
    route: "/info",
    state: {
      hide_back_btn: false,
      success_mssg: "Are you sure you want to Sign Out?",
      proceed_type: 2,
      hide_header: true,
    },
  },
];

export const profile_menu_5: INTF_ProfileMenu[] = [
  {
    id: 1,
    name: "Find Authors",
    route: "/authors/find",
    state: {}
  },
];
