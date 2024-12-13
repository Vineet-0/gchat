import React from "react";

const SideBar = () => {
  return (
    <div className="w-[300px] h-full bg-[#424242] p-2">
      <div className="w-full h-full  flex flex-col gap-2">
        <button className="w-full h-10 bg-red-500 text-white rounded-md">
          Clear Chat
        </button>

        <div className="w-full h-full flex flex-col gap-1 flex-1 overflow-auto scrollbar-custom">
          {[
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2,
            3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
          ].map((item, index) => (
            <div className="w-full min-h-[50px] bg-green-500 text-white rounded-md">
              Log Out Log Out Log Out Log Out Log Out Log Out
            </div>
          ))}
        </div>
        <button className="w-full h-10 bg-red-500 text-white rounded-md">
          Clear Chat
        </button>
        <button className="w-full h-10 bg-green-500 text-white rounded-md">
          Log Out
        </button>
      </div>
    </div>
  );
};

export default SideBar;
