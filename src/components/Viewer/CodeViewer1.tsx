import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

interface Data {
  code: string;
  language: string;
}

const CodeViewer1 = ({ data }: { data: string }) => {
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
            isCopied ? "bg-green-500 text-white" : "bg-gray-700 text-gray-300"
          } hover:bg-gray-600 focus:outline-none`}
        >
          {isCopied ? "Copied" : "Copy"}
        </button>
      </div>
      <Editor
        className="editorEdit"
        // id={'editor'}
        // height='auto' // Set height to "auto" to adjust to content
        height={`${
          code ? (code?.split("\n")?.length + 2) * 19 + 5 : 400
        }px`} // Set height to "auto" to adjust to content
        language={language}
        theme="vs-dark"
        // theme="cobalt"
        // theme="night-owl"
        // theme="solaried-dark"
        // theme="tommorow-night-bright"
        // theme="vibrant-ink"
        value={code}
        defaultLanguage="javascript"
        defaultValue="// Write your code here"
        options={{
          // inlineSuggest:true,
          // fontSize:'12px',
          // padding:20,
          formatOnType: true,
          formatOnPaste: true,
          // autoClosingBrackets:true,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          minimap: {
            enabled: false,
          },
          readOnly: true,
          // lineNumbers: "off",
          // suggestLineHeight:20,
          // clickThrough: true,
          cursorStyle: "line",
          contextmenu: true, // Enable context menu
          // wordWrap: "on",
          acceptSuggestionOnCommitCharacter: true,
          acceptSuggestionOnEnter: "on",
          accessibilitySupport: "auto",
          // autoIndent: false,
          // automaticLayout: true,
          codeLens: true,
          colorDecorators: true,
          cursorBlinking: "blink",
          // cursorSmoothCaretAnimation: false,
          disableLayerHinting: false,
          disableMonospaceOptimizations: false,
          dragAndDrop: false,
          fixedOverflowWidgets: false,
          folding: true,
          foldingStrategy: "auto",
          fontLigatures: false,
          // formatOnPaste: false,
          // formatOnType: false,
          hideCursorInOverviewRuler: false,
          // highlightActiveIndentGuide: true,
          links: true,
          mouseWheelZoom: false,
          multiCursorMergeOverlapping: true,
          multiCursorModifier: "alt",
          overviewRulerBorder: true,
          overviewRulerLanes: 2,
          quickSuggestions: true,
          quickSuggestionsDelay: 100,
          renderControlCharacters: false,
          // renderFinalNewline: true,
          // renderIndentGuides: true,
          renderLineHighlight: "all",
          renderWhitespace: "none",
          revealHorizontalRightPadding: 30,
          roundedSelection: true,
          rulers: [],
          scrollBeyondLastColumn: 5,
          // scrollBeyondLastLine: true,
          selectOnLineNumbers: true,
          selectionClipboard: true,
          selectionHighlight: true,
          showFoldingControls: "mouseover",
          smoothScrolling: false,
          suggestOnTriggerCharacters: true,
          // wordBasedSuggestions: true,
          wordSeparators: "~!@#$%^&*()-=+[{]}|;:'\",.<>/?",
          // wordWrap: "off",
          wordWrapBreakAfterCharacters: "\t})]?|&,;",
          wordWrapBreakBeforeCharacters: "{([+",
          // wordWrapBreakObtrusiveCharacters: ".",
          wordWrapColumn: 80,
          // wordWrapMinified: true,
          wrappingIndent: "none",
        }}
      />
    </div>
  );
};

export default CodeViewer1;
