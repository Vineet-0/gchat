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
    setCode(data.substring(data.indexOf("\n") + 1).trim());
    setLanguage(data.substring(0, data.indexOf("\n")) || data);
  }, [data]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000); // Revert to original state after 3 seconds
    });
  };

  return (
    <div className="relative flex-col bg-black rounded-xl my-2 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-[#171717]">
      <h4 className="text-yellow-400">Language: {language}</h4>
      <button
        onClick={handleCopy}
        className={`px-2 py-1 text-sm rounded ${
          isCopied ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-700 hover:bg-gray-600 text-gray-300"
        }  focus:outline-none`}
      >
        <CopyAllIcon sx={{ fontSize: "20px", marginInlineEnd:'5px' }} />{isCopied ? "Copied" : "Copy"}
      </button>
      </div>
      <pre className="overflow-auto p-4 scrollbar-custom text-white whitespace-pre-wrap">{code}</pre>
     
    </div>
  );
};

export default CodeViewer;
