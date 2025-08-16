import React, { useEffect, useState } from 'react';
import { INTF_Tag } from '../../Interface/Tags';
import { useSearchTagsStore } from '../../store/Search_Tags';
import { no_double_clicks } from '../../utils/no_double_click/no_double_clicks';

interface TagButtonProps {
  tag: INTF_Tag;
  blogTags?: number[];
  setBlogTags?: React.Dispatch<React.SetStateAction<number[]>>;
}

const TagButton: React.FC<TagButtonProps> = ({ tag, blogTags, setBlogTags }) => {
  const [active, setActive] = useState(false);

  const storeTags = useSearchTagsStore().search_tags;
  const updateStoreTags = useSearchTagsStore().update_search_tags;

  const isUsingStore = !blogTags || !setBlogTags;

  const updateTagSelection = () => {
    if (isUsingStore) {
      updateStoreTags(tag.tag_index as number);
    } else {
      const index = tag.tag_index as number;
      const updated = blogTags.includes(index)
        ? blogTags.filter(i => i !== index)
        : [...blogTags, index];
      setBlogTags(updated);
    }
  };

  const updateTagSelectionSafe = no_double_clicks({
    execFunc: updateTagSelection,
  });

  useEffect(() => {
    const selectedTags = isUsingStore ? storeTags : blogTags || [];
    setActive(selectedTags.includes(tag.tag_index ?? -1));
  }, [storeTags, blogTags, tag.tag_index, isUsingStore]);

  return (
    <button
      onClick={updateTagSelectionSafe}
      style={{
        padding: '8px 16px',
        margin: '8px',
        borderRadius: '8px',
        backgroundColor: active ? '#007bff' : '#e0e0e0',
        color: active ? 'white' : 'black',
        border: 'none',
        cursor: 'pointer',
        width: '7rem',
      }}
    >
      {tag.tag_name}
    </button>
  );
};

export default TagButton;
