import React, { useState, useEffect } from "react";
import { CODE_BREAKING_POINT } from "../../config/BreakingPoint.config";

import CodeViewer from "../Viewer/CodeViewer";
import CodeViewer1 from "../Viewer/CodeViewer1";
import TextViewer from "../Viewer/TextViewer";

interface ModelData {
  text?: string;
  inline_data?: {
    mime_type: string;
    data: string;
  };
}

const ModelBox = ({ data }: { data: ModelData[] }) => {
  const [newData, setNewData] = useState<string[]>([]);
  useEffect(() => {
    formatData(data?.[0]?.text || "");
  }, []);

  const formatData = (data: string) => {
    const result = data.replace(/\*\*(.*?)\*\*/g, (_, boldText) => boldText);

    const newResult = result
      .split(CODE_BREAKING_POINT)
      .map((item, index) => (index % 2 === 0 ? item.trim() : item));

    setNewData(newResult);
  };
  return (
    <div className="w-full flex-col gap-2 bg-[#343434] my-2 px-4 py-2 rounded-3xl rounded-bl-none">
      {newData?.map((item: string, index: number) => (
        <div
          key={index}
          className={`
            ${index % 2 == 0 && item.trim() !== "" ? "my-2" : ""}
          overflow-x-auto`}
        >
          {index % 2 == 0 ? (
            item.trim() !== "" ? (
              <TextViewer data={item} />
            ) : null
          ) : (
            // <CodeViewer data={item} />
            <>
            <CodeViewer data={item} />
            {/* <CodeViewer1 data={item} /> */}
            </>
          )}
        </div>
      ))}
      {/* {newData?.map((item, index) => index%2===0?<div key={index}>{item}</div>:<div key={index}>{item.language}+{item.code}</div>)} */}
    </div>
  );
};

export default ModelBox;
