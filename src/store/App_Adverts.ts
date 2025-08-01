import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
import {INTF_Advert} from '../Interface/Adverts'

type State = {
  app_adverts: INTF_Advert[] 
}

type Action = {
  set_app_adverts: (adverts?: INTF_Advert[]) => void;
  clear_app_adverts: () => void 
}

export const useAppAdvertstore = create<
  State & Action,
  [['zustand/persist', unknown]]
>(
  persist(
    (set) => ({
      app_adverts: [],
      set_app_adverts: (advert) => {
        set(() => ({
          app_adverts: advert ?? [],
        }));
      },
      
      clear_app_adverts: () => {
        set(() => ({
          app_adverts: [],
        }))
      }
    }),
    {
      name: 'app-advert-store',
      storage: createJSONStorage(() => localStorage), 
    }
  ))