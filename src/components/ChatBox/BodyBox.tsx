import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import UserBox from "../Box/UserBox";
import ModelBox from "../Box/ModelBox";
import ModelLoadingBox from "../Box/ModelLoadingBox";
import { deleteQuestionAnswer } from "../../store/slices/chatSlice";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { hostname } from "os";

const BodyBox = () => {
  const { chats, currentChatId } = useSelector(
    (state: RootState) => state.chatsData
  );
  const loading = useSelector((state: RootState) => state?.chatsData?.loading);

  const currentChat = chats?.find(
    (chat: any) => chat?.chatId === currentChatId
  );

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  }, [currentChat, loading]);

  return (
    <div className="w-[100%] flex-1 mb-2 p-2 overflow-auto scrollbar-custom">
      {currentChat?.data?.map((item: any, index: number) => (
        <div
          key={index}
          className={`max-w-[90%] w-fit ${
            item?.role === "user" ? "ml-auto" : "mr-auto"
          }
            `}
          ref={
            index ===
            currentChat?.data
              ?.map((it: any, index: any) =>
                it.role === "user" ? index : null
              )
              ?.filter((it: any) => it !== null)
              ?.reverse()?.[0]
              ? contentRef
              : null
          }
          onMouseEnter={() => setHoveredIndex(index)} // Set the hovered index
          onMouseLeave={() => setHoveredIndex(null)} // Clear the hovered index
        >
          {item?.role === "user" ? (
            <UserBox
              data={item?.parts}
              hoveredIndex={hoveredIndex}
              index={index}
            />
          ) : (
            <ModelBox data={item?.parts} />
          )}
        </div>
      ))}
      {loading && <ModelLoadingBox />}
    </div>
  );
};

export default BodyBox;
