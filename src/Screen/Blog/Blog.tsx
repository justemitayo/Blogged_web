import React, { useState } from 'react';
import back from '../../Assets/icon/Back_Arrow.png'
import use from '../../Assets/icon/default_user_dark.jpg'
import message from '../../Assets/svg/message.svg'
import notLiked from '../../Assets/svg/notLiked.svg'
import comment from '../../Assets/svg/comment.svg'
import likes from '../../Assets/svg/liked.svg'
import './Blog.css'
import { useNavigate } from 'react-router-dom';

const Blog = () => {
  const [liked, setLiked] = useState(false);
  const [showModal, setShowModal] = useState<'comment' | 'message' | 'edit' | null>(null);



  const navigate = useNavigate()

  const toggleLike = () => {
    setLiked((prev) => !prev);
  };
  const openModal = (type: 'comment' | 'message' | 'edit') => setShowModal(type);
  const closeModal = () => setShowModal(null);


  return (
    <div className='blog'>
      <img src={back} alt='' className='back' onClick={()=> navigate(-1)} />
      <div className='blog-component'>
        <div className='blog-head'>
          <img src={use} alt='blogImage' className='blogImage'/>
        </div>
        <div className='blog-header'>
          <p>Economic</p>
          <div className='blogs'>
            <span style={{color:'rgb(170, 162, 162)'}}>date</span>
            <span style={{color:'rgb(170, 162, 162)'}}>likes</span>
          </div>
        </div>
        <h3 className='blog-title'>Topic is for use nhnlnihnklubnkjml.</h3>
        <div className='blog-owner'>
          <img src={use} alt="" />
          <p>By: Gbenga</p>
        </div>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio, aliquid adipisci? Quas dolorem maxime impedit beatae perferendis numquam quibusdam modi tempore praesentium sit! Quam at unde perferendis aut nesciunt a!  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat quod doloribus a dolores pariatur repellat provident quaerat? Maxime explicabo nostrum excepturi ratione doloribus facilis, sunt, ipsa molestias, dolore veritatis debitis!  Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias expedita officia, hic dolor quae eos minus ducimus doloremque ipsa vitae, inventore enim excepturi non ab odio quia. Animi, aliquid dolor.  Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, corporis quasi. Porro sunt facere atque, unde inventore dolorum laudantium praesentium non ullam ex, perspiciatis ea? Commodi saepe dolor inventore id.  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Similique, dolorem inventore maxime, fuga placeat obcaecati tempore tenetur soluta, molestias nemo sequi at! Obcaecati voluptates debitis, perferendis quos dignissimos praesentium maxime.Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio, aliquid adipisci? Quas dolorem maxime impedit beatae perferendis numquam quibusdam modi tempore praesentium sit! Quam at unde perferendis aut nesciunt a!  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat quod doloribus a dolores pariatur repellat provident quaerat? Maxime explicabo nostrum excepturi ratione doloribus facilis, sunt, ipsa molestias, dolore veritatis debitis!  Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias expedita officia, hic dolor quae eos minus ducimus doloremque ipsa vitae, inventore enim excepturi non ab odio quia. Animi, aliquid dolor.  Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, corporis quasi. Porro sunt facere atque, unde inventore dolorum laudantium praesentium non ullam ex, perspiciatis ea? Commodi saepe dolor inventore id.  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Similique, dolorem inventore maxime, fuga placeat obcaecati tempore tenetur soluta, molestias nemo sequi at! Obcaecati voluptates debitis, perferendis quos dignissimos praesentium maxime.</p>
      </div>
      <div className='blog-footer'>
        <div className='blog-mini'>
          <div>
            <img alt='' src={liked ? likes :  notLiked} onClick={toggleLike}/>
            <span>1</span>
          </div>
          <div>
          <img alt='' src={message} onClick={() => openModal('message')} />
            <span>1</span>
          </div>
        </div>
        
        <img alt='' src={comment} onClick={() => openModal('comment')} />
      </div>
      {showModal && (
        <div className="side-modal">
          <div className="modal-content">
          <img src={back} alt='' className='back' onClick={closeModal} />
            {showModal === 'comment' ? (
              <div>
                <div className='blog-owner'>
                  <img src={use} alt="" />
                  <p>Gbenga</p>
                </div>
                <textarea placeholder="Write your comment..." />
                <button>Send Reply</button>
              </div>
            ) : showModal === 'message' ?(
              <div>
                <div className='blog-owner'>
                  <img src={use} alt="" />
                  <p>Gbenga</p>
                  <span>2 months ago</span>
                </div>
                <p>Comments will be listed here...</p>
                <div className='bg'>
                  <p style={{color:'red'}}>Delete</p>
                  <p onClick={() => openModal('edit')}>Edit</p>
                </div>
              </div>
            ): (
              <div>
                <div className='blog-owner'>
                  <img src={use} alt="" />
                  <p>Gbenga</p>
                  <span>2 months ago</span>
                </div>
                <textarea />
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}

export default Blog