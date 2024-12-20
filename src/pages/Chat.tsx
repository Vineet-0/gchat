import React from "react";
import TopBar from "../components/ChatBox/TopBar";
import BodyBox from "../components/ChatBox/BodyBox";
import SearchBox from "../components/ChatBox/SearchBox";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";

const Chat = () => {
  const { chats, currentChatId, loading,sideBarOpen } = useSelector(
    (state: RootState) => state?.chatsData
  );
  return (
    <div
      className={`mx-auto h-screen max-h-screen overflow-hidden
    flex-1 flex flex-col px-2 pb-2 ${sideBarOpen ? "ml-[0px] md:ml-[250px]" : ""}`}
    >
      <div
        className={`mx-auto w-[min(800px,100%)] h-screen max-h-screen overflow-hidden
     flex flex-col px-2 pb-2`}
      >
        <TopBar />
        <BodyBox />
        <SearchBox />
      </div>
    </div>
  );
};

export default Chat;
