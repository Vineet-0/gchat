import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { deleteQuestionAnswer } from "../../store/slices/chatSlice";

import TextViewer from "../Viewer/TextViewer";
import ImageViewer from "../Viewer/ImageViewer";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

interface UserData {
  text?: string;
  inline_data?: {
    mime_type: string;
    data: string;
  };
}

const UserBox = ({
  data,
  hoveredIndex,
  index,
}: {
  data: UserData[];
  hoveredIndex: number | null;
  index: number;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const handleDelete = (index: number) => {
    dispatch(deleteQuestionAnswer(index));
  };
  return (
    <div className="relative">
      <div className="flex flex-col items-end">
        {data?.map((item, index) => (
          <div key={index} className="w-fit max-w-full mt-2">
            {item?.inline_data && <ImageViewer image={item?.inline_data} />}
          </div>
        ))}
        <div className="w-fit max-w-full bg-[#424242] mt-1 px-2 py-1 rounded-xl overflow-auto scrollbar-custom">
          <TextViewer text={data?.[0]?.text ?? ""} />
        </div>
      </div>
      {hoveredIndex === index && (
        <button
          onClick={() => handleDelete(index)}
          className="absolute bottom-[-35px] right-0 mt-2 bg-red-500 text-white p-1.5 rounded-xl"
        >
          <DeleteForeverIcon />
        </button>
      )}
    </div>
  );
};

export default UserBox;
