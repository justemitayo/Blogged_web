import React from 'react'
import './Home.css'
import filter from '../../Assets/svg/filter.svg'
import Box from '../../components/Box/Box'

const Home = () => {
  return (
    <div className='home'>
      <div className='home-header'>
        <input 
          placeholder='Search for Blogs...'
        />
        <img src={filter} alt=''/>
      </div>
      <div className='home-content'>
        <div className='home-blog'>
          <Box />
          <Box />
          <Box />
          <Box />
          <Box />
          <Box />
          <Box />
        </div>

        <>
          <div className="divider" />
          <h2>Recommended</h2>
          <div className='home-blog'>
            <Box />
            <Box />
            <Box />
            <Box />
            <Box />
            <Box />
            <Box />
          </div>
          <div className="divider" />
        </>
      </div>

    </div>
  )
}

export default Home