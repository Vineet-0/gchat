import React from 'react'
import TopBar from '../components/ChatBox/TopBar'
import BodyBox from '../components/ChatBox/BodyBox'
import SearchBox from '../components/ChatBox/SearchBox'

const Chat = () => {
  return (
    <div className='mx-auto w-[min(1200px,100%)] h-screen max-h-screen overflow-hidden
    flex-1 flex flex-col px-2 pb-2'>
      <TopBar/>
      <BodyBox/>
      <SearchBox/> 
    </div>
  )
}

export default Chat