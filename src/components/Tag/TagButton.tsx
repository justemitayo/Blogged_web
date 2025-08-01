import React,{useEffect, useState, FunctionComponent} from 'react'
import { INTF_Tag } from '../../Interface/Tags';
import { useSearchTagsStore } from '../../store/Search_Tags';
import { no_double_clicks } from '../../utils/no_double_click/no_double_clicks';



interface TagButtonProps {
  tag: INTF_Tag;
}
const TagButton: FunctionComponent<TagButtonProps> = ({tag}) => {
    //tag
    //active as in when you click on it 
    const [active, setActive] = useState<boolean>(false)
    const update_search_tags = useSearchTagsStore().update_search_tags
    const search_tags = useSearchTagsStore().search_tags

    const update_search_tags_func = no_double_clicks({
      execFunc: () => {
            update_search_tags(tag?.tag_index as number);
      },
  });

  useEffect(() => {
      if (search_tags?.includes(tag?.tag_index ?? 0)) {
          setActive(true);
      } else {
          setActive(false);
      }
  }, [search_tags, tag.tag_index]);
    
  return (
  <button
    onClick={update_search_tags_func}
    style={{
      padding: '8px 16px',
      margin: '8px',
      borderRadius: '8px',
      backgroundColor: active ? '#007bff' : '#e0e0e0',
      color: active ? 'white' : 'black',
      border: 'none',
      cursor: 'pointer',
      width:'7rem',
      height:'iopx'
    }}
  >
    {tag.tag_name}
  </button>
  )
}

export default TagButton