// store/userData.store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { INTF_UserData } from '../Interface/User_Data';

type State = {
  user_data: INTF_UserData;
};

type Action = {
  set_user_data: (data?: INTF_UserData) => void;
  clear_user_data: () => void;
  update_user_name: (username: string) => void;
};

const defaultUserData: INTF_UserData = {
  blogs_l: 0,
  createdAt: '',
  dp_link: '',
  followed: false,
  followers_l: 0,
  following_l: 0,
  isowner: false,
  uid: '',
  username: '',
  verified: false,
};

export const useUserDataStore = create<
  State & Action,
  [['zustand/persist', unknown]]
>(
  persist(
    (set, get) => ({
      user_data: defaultUserData,

      set_user_data: (data) => {
        set(() => ({
          user_data: data ?? defaultUserData,
        }));
      },

      clear_user_data: () => {
        set(() => ({
          user_data: defaultUserData,
        }));
      },

      update_user_name: (username) => {
        set(() => ({
          user_data: {
            ...get().user_data,
            username,
          },
        }));
      },
    }),
    {
      name: 'user-data-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
