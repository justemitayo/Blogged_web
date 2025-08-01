import React,{FunctionComponent} from 'react'
import './Box.css'
import { useNavigate } from 'react-router-dom'
import {INTF_BlogPost } from '../../Interface/Blog_Post'
import { mongo_date_converter_3 } from '../../utils/Mongo_Date_Converter/Mongo_Date_Converter'
import { high_nums_converter } from '../../utils/High_Nums_Converter/High_Nums_Converter';
import { shorten_text } from '../../utils/Shorten_Text/Shorten_Text'
import { http_link_fix } from '../../utils/HTTP_Link_Fix/HTTP_Link_Fix'
import {INTF_Tag } from '../../Interface/Tags'



interface BlogCardProps {
  blog_post: INTF_BlogPost;
  index: number;
  tags: INTF_Tag[];
}

const Box: FunctionComponent<BlogCardProps>= ({blog_post, index, tags}) => {
  const navigate = useNavigate();
  const first_tag = blog_post?.tags?.[0];

  const handleNavigate = () => {
    navigate(`/blogPost/${blog_post?.bid}`, { state: { bid: blog_post?.bid } });
  }

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate('/author', { state: { bid: blog_post?.bid } });

  }

  const handleLikesClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(`/likes/${blog_post?.bid}`, { state: { bid: blog_post?.bid } });
  }
  

  return (
    <div className='box' onClick={handleNavigate}>
      <div className='box-component'>
        <div>
          <img
            className="box-image"
            src={
              blog_post?.b_dp_link === 'none' || blog_post?.b_dp_link === undefined
                ? require('../../Assets/Images/No_Blog_Image.png')
                : http_link_fix({ http_link: blog_post?.b_dp_link as string })
            }
            alt="blog"
          />
        </div>

        <div className='box-content'>
          <h3>  {shorten_text({ text: blog_post?.title as string, limit: 63 })}</h3>
          <div className='box-section'>
            <p className='p' onClick={handleAuthorClick}>{`By: ${shorten_text({ text: blog_post?.author as string, limit: 17 })}`}</p>
            {tags[(first_tag as number) || 0]?.tag_name && (
                <p className='pp'>{tags[(first_tag as number) || 0]?.tag_name}</p>
            )}
          </div>
          <div className='box-footer'>
            <span style={{color:'rgb(170, 162, 162)'}}>{mongo_date_converter_3({ input_mongo_date: blog_post?.createdAt as string })}</span>
            <span style={{color:'rgb(170, 162, 162)'}} onClick={handleLikesClick}> {(blog_post?.likes_l as number) === 1
              ? '1 like'
              : `${high_nums_converter({ number: blog_post?.likes_l as number })} likes`}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Box