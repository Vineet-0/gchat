import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import UserBox from "../Box/UserBox";
import ModelBox from "../Box/ModelBox";
import ModelLoadingBox from "../Box/ModelLoadingBox";
import { deleteMessages } from "../../store/slices/chatSlice";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const BodyBox = () => {
  const messages = useSelector((state: RootState) => state.chat.messages);
  const loading = useSelector((state: RootState) => state.chat.loading);
  const dispatch = useDispatch<AppDispatch>();

  // State to track the index of the hovered message
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
  }, [messages, loading]);
  const handleDelete = (index: number) => {
    dispatch(deleteMessages(index));
  };

  return (
    <div className="w-[100%] flex-1 p-2 overflow-auto scrollbar-custom">
      {messages?.map((item, index: number) => (
        <div
          key={index}
          className={`max-w-[90%] w-fit ${
            item.role === "user" ? "ml-auto" : "mr-auto"
          }
            `}
          ref={
            index ===
            messages
              .map((it, index) => (it.role === "user" ? index : null))
              .filter((it) => it !== null)
              .reverse()[0]
              ? contentRef
              : null
          }
          onMouseEnter={() => setHoveredIndex(index)} // Set the hovered index
          onMouseLeave={() => setHoveredIndex(null)} // Clear the hovered index
        >
          {item.role === "user" ? (
            <div className="relative">
              <UserBox data={item?.parts} />
              {hoveredIndex === index && (
                <button
                  onClick={() => handleDelete(index)} // Call delete function
                  className="absolute bottom-[-41px] right-0 mt-2 bg-red-500 text-white p-2 rounded-3xl rounded-tr-none"
                >
                  <DeleteForeverIcon />
                </button>
              )}
            </div>
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
