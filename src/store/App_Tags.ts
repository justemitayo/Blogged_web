import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
import { INTF_Tag  } from "../Interface/Tags";


type State = {
  app_tags: INTF_Tag[]
}

type Action = {
  set_app_tags: (tags?: INTF_Tag[]) => void;
  clear_app_tags: () => void
}

export const useAppTagStore = create<
  State & Action,
  [['zustand/persist', unknown]]
>(
  persist(
    (set) => ({
      app_tags: [],

      set_app_tags: (tags) => {
        set(() => ({
          app_tags: tags ?? [],
        }));
      },
      
      clear_app_tags: () => {
        set(() => ({
          app_tags: [],
        }))
      }
    }),
    {
      name: 'app-tag-store',
      storage: createJSONStorage(() => localStorage), 
    }
  )
)