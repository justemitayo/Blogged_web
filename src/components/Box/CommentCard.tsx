import React, { FunctionComponent, useState } from 'react'
import { INTF_Comments } from '../../Interface/Comments';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { delete_comments, edit_comment } from '../../config/hook';
import { useCurrentCommentsStore } from '../../store/Current_Comments';
import { query_id } from '../../config/hook/Query_ID/Query_ID';
import { INTF_BlogDetails } from '../../Interface/Blog_Details';
import { no_double_clicks } from '../../utils/no_double_click/no_double_clicks';
import { useUserInfoStore } from '../../store/User_Info.store';
import { http_link_fix } from '../../utils/HTTP_Link_Fix/HTTP_Link_Fix';
import { shorten_text } from '../../utils/Shorten_Text/Shorten_Text';
import { getCustomTimeAgo } from '../../utils/Time_Converter/Time_Converter';
import './CommentCard.css'
import edits from '../../Assets/svg/edit.svg';
import deletes from '../../Assets/svg/delete.svg'

interface CommentCardProps {
  comment: INTF_Comments;
}
const CommentCard: FunctionComponent<CommentCardProps> = ({comment}) => {
  const queryClient = useQueryClient();

  const [edit, setEdit] = useState<boolean>(false);
  const [editComment, setEditComment] = useState<string>(comment?.comment ?? '');

  const update_comment = useCurrentCommentsStore().update_comment
  const current_blog_id = useCurrentCommentsStore().current_blog_id
  const current_comments = useCurrentCommentsStore().current_comments
  const delete_comment = useCurrentCommentsStore().delete_comment
  const set_comments = useCurrentCommentsStore().set_comments
  const user_info = useUserInfoStore().user_info

  const edit_comment_mutate = useMutation({
    mutationFn: edit_comment,
  
    onMutate: () => {
      update_comment(comment?._id ?? '', editComment);
    },
    onSuccess: (data) => {
      queryClient.cancelQueries({queryKey: query_id({ id:current_blog_id }).blog_with_id});

      const old_data = queryClient.getQueryData<{ data: INTF_BlogDetails; error: boolean }>(
        query_id({ id: current_blog_id! }).blog_with_id
      );

      if (old_data) {
        queryClient.setQueryData(query_id({ id: current_blog_id! }).blog_with_id, {
          ...old_data,
          data: {
            ...old_data.data,
            comments: current_comments
          },
          error: false,
        });
      }
      if (data?.error){
        const comment_to_change: INTF_Comments[] =  old_data?.data?.comments?.filter(item => item?._id === comment?._id,) as INTF_Comments[];
        update_comment(comment?._id ?? '', comment_to_change[0]?.comment ?? '' )
      }
      queryClient.resumePausedMutations();
    },

  })

  const delete_comment_mutate = useMutation({
    mutationFn: delete_comments,
  

    onMutate: () => {
      delete_comment(comment?._id ?? '');
    },
    onSuccess: (data) => {
      queryClient.cancelQueries({queryKey: query_id({ id:current_blog_id }).blog_with_id});

      const old_data = queryClient.getQueryData<{ data: INTF_BlogDetails; error: boolean }>(
        query_id({ id: current_blog_id! }).blog_with_id
      );

      if (old_data) {
        queryClient.setQueryData(query_id({ id: current_blog_id! }).blog_with_id, {
          ...old_data,
          data: {
            ...old_data.data,
            comments: current_comments,
            comments_l: current_comments?.length
          },
          error: false,
        });
      }
      if (data?.error){
        set_comments(old_data?.data?.comments as INTF_Comments[],)
      }
      queryClient.resumePausedMutations();
    },

  })

  const upload__comment = no_double_clicks({
    execFunc: () => {
        setEdit(false);
        edit_comment_mutate.mutate({
            blogID: current_blog_id,
            comment: editComment,
            commentID: comment?._id ?? '',
            user_token: user_info?.token ?? '',
        });
    },
  });

  const delete__comment = no_double_clicks({
    execFunc: () => {
        setEdit(false);
        delete_comment_mutate.mutate({
            blogID: current_blog_id,
            commentID: comment?._id ?? '',
            user_token: user_info?.token ?? '',
        });
    },
  });

  const edit__comment = no_double_clicks({
    execFunc: () => {
        setEdit(true);
    },
  });

  const cancel__edit = no_double_clicks({
      execFunc: () => {
          setEdit(false);
      },
  });

  const showDp = comment?.dp_link && comment?.dp_link !== 'none';
  return (
        <div className="comment-main">
          <div className="comment-top">
            <img
              className="comment-avatar"
              src={showDp ? http_link_fix({ http_link: comment?.dp_link ?? ''}) :  require('../../Assets/icon/default_user_dp_light.jpg') }
              alt="User"
            />
            <span className="comment-username">
              {shorten_text({ text: comment?.username ?? '', limit: 25 })}
            </span>
            <span className="comment-date">
              {getCustomTimeAgo({ date_string: comment?.createdAt ?? '' })}
            </span>
          </div>
    
          {!edit && (
            <p className="comment-text">{comment?.comment}</p>
          )}
    
          {edit && (
            <textarea
              className="comment-editbox"
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              autoFocus
            />
          )}
    
          {comment?.is_c_owner && !edit && (
            <div className="comment-actions">
              <img src={deletes} alt='' onClick={delete__comment} />
              <img src={edits} alt='' onClick={edit__comment} />
            </div>
          )}
    
          {comment?.is_c_owner && edit && (
            <div className="comment-actions">
              <p onClick={cancel__edit} style={{color:'red'}}>x</p>
              <p onClick={upload__comment} style={{color:'black'}}>upload</p>
            </div>
          )}
        </div>
    
  )
}

export default CommentCard