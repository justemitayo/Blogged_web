import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';

type State = {
  search_tags: number[]
};

type Action = {
  update_search_tags: (tag_index: number) => void;
  clear_search_tags: () => void
}

export const useSearchTagsStore = create<
  State & Action,
  [['zustand/persist', unknown]]
>(
  persist(
    (set, get) => ({
      search_tags: [],

      update_search_tags: (tag_index: number) => {
        const prev_data = get().search_tags;
        if (prev_data.includes(tag_index)) {
          set({
            search_tags: prev_data.filter((item) => item !== tag_index),
          });
        } else {
          set({
            search_tags: [...prev_data, tag_index],
          });
        }
      },
    
      clear_search_tags: () => {
        set({ search_tags: [] });
      },
    }),
    {
      name: 'search-tag-store',
      storage: createJSONStorage(() => localStorage), 
    }
  ))