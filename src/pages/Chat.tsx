import React from 'react'
import TopBar from '../components/ChatBox/TopBar'
import BodyBox from '../components/ChatBox/BodyBox'
import SearchBox from '../components/ChatBox/SearchBox'

const Chat = () => {
  return (
    <div className='mx-auto w-[min(1200px,100%)] h-screen max-h-screen overflow-hidden
    flex flex-col gap-4 p-4'>
      <TopBar/>
      <BodyBox/>
      <SearchBox/> 
    </div>
  )
}

export default Chat