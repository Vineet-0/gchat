"use client";

import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import CopyAllIcon from '@mui/icons-material/CopyAll';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setFontSize, setFontStyle } from '../store/slices/fontSlice';


const CodeViewer = ({it}:{it:any}) => {
  const [enable, setEnable] = useState(false);

  const FontSize = useSelector((state: RootState) => state.font.fontSize);
  const FontStyle = useSelector((state: RootState) => state.font.fontStyle);

  const editorRef = useRef<any>(null); // Reference to the editor instance
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div
      className="relative w-full"
      onClick={(e) => {
        e.stopPropagation();
        // setEnable(!enable);
      }}
      style={{
        pointerEvents: enable ? "none" : "stroke",
        // width: "96%",
        // marginInline: "auto",
        // marginBlock:'0px',
        background: "black",
        border: "5px solid black",
        borderRadius: "10px",
        padding: "30px 0px 0px 0px",
        // marginInline: "10px",
        overflow: "hidden",
        position: "relative",
      }}
      ref={editorRef}
    >
      <Editor
        className="editorEdit"
        // id={'editor'}
        // height='auto' // Set height to "auto" to adjust to content
        height={`${it?.code ? (it?.code?.split("\n")?.length) * (19/12*FontSize) : 400}px`} // Set height to "auto" to adjust to content
        // height={`${it?.code ? (it?.code?.split("\n")?.length+2) * 18 + 5 : 400}px`} // Set height to "auto" to adjust to content
        language={it?.language}
        theme="vs-dark"
        // theme="cobalt"
        // theme="night-owl"
        // theme="solaried-dark"
        // theme="tommorow-night-bright"
        // theme="vibrant-ink"
        value={it?.code}
        defaultLanguage="javascript"
        defaultValue="// Write your code here"
        options={{
          // inlineSuggest:true,
          fontSize:FontSize,
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
      <div
        style={{
          position: "absolute",
          top: "2px",
          left: "10px",
          fontSize: "14px",
          fontWeight: "bold",
        }}
      >
        {`${it.language} - [ Lines = ${it?.code?.split("\n")?.length}] - [ LineHeight = ${it?.code ? it?.code?.split("\n")?.length * 25 : 400}px ]`}
      </div>
      <button
        onClick={(e: any) => handleCopy(it.code)}
        style={{
          position: "absolute",
          top: "2px",
          right: "10px",
          display: "flex",
          alignItems: "center",
          background: "transparent",
          border: "none",
          padding: "0px",
          cursor: "pointer",
          color: "white",
        }}
      >
        {/* <PiCopy/> */}
        <CopyAllIcon sx={{ fontSize: "20px" }} /> Copy Code
      </button>
    </div>
  );
};

export default CodeViewer;
