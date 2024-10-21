import React from 'react';
import TextViewer from '../Viewer/TextViewer';

interface UserData {
  text?: string;
  inline_data?: {
    mime_type: string;
    data: string;
  };
}

const UserBox = ({ data }: { data: UserData[] }) => {
  return (
    <div className="w-fit bg-blue-600 my-2 p-2 rounded-3xl rounded-br-none">
      {data.map((item, index) => (
        <div key={index} className='flex flex-col items-end'>
          {item.text ? (
            <TextViewer data={item.text} />

          ) : item.inline_data ? (
            <img
              src={`data:${item.inline_data.mime_type};base64,${item.inline_data.data}`}
              alt="Inline Data"
              className="max-w-[200px] h-auto mt-2 border-2 border-gray-200 rounded-2xl rounded-br-none"
            />
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default UserBox;
