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
    // const afterBold = data?.replace(
    //   /\*\*(.*?)\*\*/g,
    //   (_, boldText) => `${boldText}`
    // );
    // const afterList = afterBold?.replace(
    //   /\*(.*?)\n/g,
    //   (_, boldText) => `•${boldText}\n`
    // );

    const newResult = data?.split(CODE_BREAKING_POINT)?.map((item, index) =>
      index % 2 === 0
        ? item
            ?.replace(/\*\*(.*?)\*\*/g, (_, boldText) => `${boldText}`)
            ?.replace(/\*(.*?)\n/g, (_, listText) => `•${listText}\n`)
            ?.replace(/`([^`]*)`/g, (_, listText) => `${listText}`)
            ?.trim()
        : item
    );

    setNewData(newResult);
  };
  return (
    <div className="w-full flex-col gap-2 bg-transparent p-2 rounded-3xl rounded-bl-none">
      {newData?.map((item: string, index: number) => (
        <div
          key={index}
          className={`
            ${index % 2 == 0 && item?.trim() !== "" && "my-2"}
          overflow-x-auto`}
        >
          {index % 2 == 0 ? (
            item.trim() !== "" && <TextViewer text={item} />
          ) : (
            <CodeViewer data={item} />
          )}
        </div>
      ))}
    </div>
  );
};

export default ModelBox;
