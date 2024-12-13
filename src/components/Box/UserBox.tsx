import React from "react";
import TextViewer from "../Viewer/TextViewer";
import ImageViewer from "../Viewer/ImageViewer";

interface UserData {
  text?: string;
  inline_data?: {
    mime_type: string;
    data: string;
  };
}

const UserBox = ({ data }: { data: UserData[] }) => {
  return (
    <div className="flex flex-col items-end">
      {data?.map((item, index) => (
        <div key={index} className="w-fit max-w-full mt-2">
          {item?.inline_data && <ImageViewer image={item?.inline_data} />}
        </div>
      ))}
      <div className="w-fit max-w-full bg-[#424242] mt-1 px-2 py-1 rounded-xl overflow-auto scrollbar-custom">
        <TextViewer text={data?.[0]?.text ?? ''}/>
      </div>
    </div>
  );
};

export default UserBox;
