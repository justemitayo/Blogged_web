import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
import { INTF_UserInfo } from "../Interface/User_Info";


type State = {
  user_info: INTF_UserInfo;
};

type Action = {
  set_user_info: (data?: INTF_UserInfo) => void;
  clear_user_info: () => void;
};

const defaultUserInfo: INTF_UserInfo = {
  email_v: false,
  token: '',
  uid: '',
};

export const useUserInfoStore = create<
  State & Action,
  [['zustand/persist', unknown]]
>(
  persist(
    (set) => ({
      user_info: defaultUserInfo,

      set_user_info: (data) => {
        set(() => ({
          user_info: data ?? defaultUserInfo,
        }));
      },

      clear_user_info: () => {
        set(() => ({
          user_info: defaultUserInfo,
        }));
      },
    }),
    {
      name: 'user-info-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);


