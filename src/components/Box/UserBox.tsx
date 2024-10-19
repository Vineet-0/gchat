import React from 'react';

interface UserData {
  text?: string;
  inline_data?: {
    mime_type: string;
    data: string;
  };
}

const UserBox = ({ data }: { data: UserData[] }) => {
  return (
    <div className="w-fit bg-blue-600 p-2 rounded-3xl rounded-br-none">
      {data.map((item, index) => (
        <div key={index} className='flex flex-col items-end'>
          {item.text ? (
            <p className='px-2'>{item.text}</p>
          ) : item.inline_data ? (
            <img
              src={`data:${item.inline_data.mime_type};base64,${item.inline_data.data}`}
              alt="Inline Data"
              className="max-w-[200px] h-auto mt-2 rounded-2xl rounded-br-none"
            />
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default UserBox;
