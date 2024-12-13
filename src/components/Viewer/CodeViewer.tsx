import React, { useState, useEffect } from "react";
import CopyAllIcon from "@mui/icons-material/CopyAll";

interface Data {
  code: string;
  language: string;
}

const CodeViewer = ({ data }: { data: string }) => {
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    const newLanguage = data?.substring(0, data?.indexOf("\n"))?.trim() ?? data;
    const newCode = data?.substring(data?.indexOf("\n") + 1) ?? data;

    setLanguage(newLanguage);
    setCode(newCode);

    // console.log(data?.substring(data?.indexOf("\n") + 1)?.split('\n')?.map((item)=>item?.[0]===' ' ? item.substring(5) : item)?.join('\n'))

  }, [data]);

  const handleCopy = () => {
    navigator?.clipboard?.writeText(code)?.then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000); // Revert to original state after 3 seconds
    });
  };

  return (
    <div className="relative flex-col bg-black rounded-md overflow-hidden">
      <div className="flex items-center justify-between pl-4 pr-1 py-1 bg-[#2f2f2f]">
        <h4 className="text-yellow-400 text-xs font-[400]">{language&&language}</h4>
        <button
          onClick={handleCopy}
          className={`px-2 py-1 text-[12px] rounded flex items-center gap-1 ${
            isCopied
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-[#2f2f2f] hover:bg-gray-700 text-gray-300"
          }  focus:outline-none`}
        >
          {/* <CopyAllIcon sx={{ fontSize:/"20px", marginInlineEnd: "5px" }} /> */}
          <img src='/copy.png' alt='copy' className="w-4 h-4"/>
          {isCopied ? "Copied !" : "Copy"}
        </button>
      </div>
      <pre
        className={`overflow-auto mx-4 mt-2 mb-2 pb-1 scrollbar-custom text-white`}
      >
        {code}
      </pre>
    </div>
  );
};

export default CodeViewer;

// whitespace-pre-wrap
