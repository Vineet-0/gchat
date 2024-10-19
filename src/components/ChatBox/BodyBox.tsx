import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import UserBox from "../Box/UserBox";
import ModelBox from "../Box/ModelBox";

const BodyBox = () => {
  const messages = useSelector((state: RootState) => state.chat.messages);

  return (
    <div className="flex-1 overflow-auto w-[100%]">
      {messages?.map((item, index) => (
        <div key={index} className={`max-w-[90%] w-fit ${item.role==='user'?'ml-auto':'mr-auto'}`}>
          {item.role === "user" ? <UserBox data={item?.parts} /> : <ModelBox data={item?.parts} />}
        </div>
      ))}
    </div>
  );
};

export default BodyBox;
