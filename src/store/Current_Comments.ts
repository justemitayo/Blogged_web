import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
import { INTF_Comments } from "../Interface/Comments";

type State = {
  current_comments: INTF_Comments[] 
  current_blog_id: string
}

type Action = {
  set_current_blog_id: (blogID?: string) => void;
  set_comments:(svr_comments?: INTF_Comments[]) => void;
  update_comment:(cid?: string, message?: string) => void;
  delete_comment:(cid?: string) => void;
}

export const useCurrentCommentsStore = create<
  State & Action,
  [['zustand/persist', unknown]]
>(
  persist(
    (set) => ({
      current_comments: [],

      current_blog_id: '',

      set_current_blog_id: (blogID) => {
        set(() => ({
          current_blog_id: blogID ?? '',
        }))
      },

      set_comments: (svr_comments) => {
        set(() => ({
          current_comments: svr_comments ?? [],
        }))
      }, 

      update_comment: (cid, message) => {
        if (!cid || !message) return;
        set((state) => ({
          current_comments: state.current_comments.map((item) => 
            item._id === cid ? {...item, current_comments: message} : item
          )
        }))
      },

      delete_comment: (cid) => {
        if (!cid) return;
        set((state) => ({
          current_comments: state.current_comments.filter((item) => item._id !== cid)
        }))
      }
    }),
    {
      name: 'current-comments-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);