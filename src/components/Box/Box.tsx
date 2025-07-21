import React,{FunctionComponent} from 'react'
import use from '../../Assets/icon/default_user_dark.jpg'
import './Box.css'
import { useNavigate } from 'react-router-dom'
import {INTF_BlogPost } from '../../Interface/Blog_Post'
import {INTF_Tag } from '../../Interface/Tags'


interface BlogCardProps {
  blog_post: INTF_BlogPost;
  index: number;
  tags: INTF_Tag[];
}

const Box: FunctionComponent<BlogCardProps>= ({blog_post, index, tags}) => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate('/blogPost')
  }

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate('/')
  }

  const handleLikesClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate('/')
  }

  return (
    <div className='box' onClick={handleNavigate}>
      <div className='box-component'>
        <img alt='' src={use} className='box-image'/>
        <div className='box-content'>
          <h3>World War 3 Introduction webbipbf47gb big4bhrn2 3</h3>
          <div className='box-section'>
            <p className='p' onClick={handleAuthorClick}>By: Gbenga</p>
            <p className='pp'>Carbon Emmision</p>
          </div>
          <div className='box-footer'>
            <span style={{color:'rgb(170, 162, 162)'}}>date</span>
            <span style={{color:'rgb(170, 162, 162)'}} onClick={handleLikesClick}>likes</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Box