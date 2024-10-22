import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import NearMeIcon from "@mui/icons-material/NearMe";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { addMessage, setLoading } from "../../store/slices/chatSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";

import { Box } from "@mui/material";

const API_KEY = process.env.REACT_APP_API_KEY;

const SearchBox = () => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [text, setText] = useState("");
  const [rows, setRows] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const maxRows = 10;

  const messages = useSelector((state: RootState) => state.chat.messages);
  const loading = useSelector((state: RootState) => state.chat.loading);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    handleTextareaFocus();
  }, [messages, loading]);

  const handleTextareaFocus = () => {
    textareaRef.current?.focus();
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);

    if (textareaRef.current) {
      textareaRef.current.rows = 1;
      const newRows = Math.min(
        Math.floor(textareaRef.current.scrollHeight / 28),
        maxRows
      );
      setRows(newRows);
      textareaRef.current.rows = newRows;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAddMessage();
    }
  };

  const handleAddMessage = () => {
    if (text.trim() !== "") {
      if (uploadedImage) {
        handleApisubmit([
          ...messages,
          {
            role: "user",
            parts: [
              { text: text },
              {
                inline_data: {
                  mime_type: uploadedImage?.split(";")?.[0]?.split(":")?.[1],
                  data: uploadedImage?.split(";")?.[1]?.substring(7),
                },
              },
            ],
          },
        ]);
        dispatch(
          addMessage({
            role: "user",
            parts: [
              { text: text },
              {
                inline_data: {
                  mime_type:
                    uploadedImage?.split(";")?.[0]?.split(":")[1] || "",
                  data: uploadedImage?.split(";")?.[1]?.substring(7),
                },
              },
            ],
          })
        );
      } else {
        handleApisubmit([
          ...messages,
          { role: "user", parts: [{ text: text }] },
        ]);

        dispatch(addMessage({ role: "user", parts: [{ text: text }] }));
      }
      setText("");
      setRows(1);
      setUploadedImage(null);
    }
  };

  const handleApisubmit = (data: any) => {
    dispatch(setLoading(true));
    let newData;
    axios
      .request({
        method: "post",
        // maxBodyLength: Infinity,
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          contents: data,
        }),
      })
      .then((response: any) => {
        const data =
          response.data["candidates"][0]["content"]["parts"][0]["text"];
        // console.log(data);

        if (data) {
          dispatch(addMessage({ role: "model", parts: [{ text: data }] }));
          dispatch(setLoading(false));
        } else {
          dispatch(
            addMessage({
              role: "model",
              parts: [{ text: "Don't try to enter Sensitive Info" }],
            })
          );
          dispatch(setLoading(false));
        }
      })
      .catch((error) => {
        dispatch(
          addMessage({ role: "model", parts: [{ text: error.message }] })
        );
        dispatch(setLoading(false));
        console.log("got error");
      });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const image = new Image();
      image.src = reader.result as string;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 500; // Adjust the maximum width to control size
        const scale = maxWidth / image.width;
        const width = maxWidth;
        const height = image.height * scale;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(image, 0, 0, width, height);

          // Adjust quality to get the image under 100 KB
          let quality = 0.8; // Start with 80% quality
          let resizedImage = canvas.toDataURL("image/jpeg", quality);

          while (resizedImage.length > 100 * 1024 && quality > 0.1) {
            quality -= 0.05; // Decrease quality by 5%
            resizedImage = canvas.toDataURL("image/jpeg", quality);
          }

          setUploadedImage(resizedImage);
        }
      };
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const clearUploadedImage = () => {
    setUploadedImage(null);
  };

  return (
    <Box
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{
        width: "min(1000px, 100%)",
        marginInline: "auto",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        paddingInline: "min(10px, 5%)",
        border: isDragging ? "2px dashed #00f" : "1px dashed white",
        borderRadius: "30px",
        padding: "10px 20px",
        backgroundColor: isDragging ? "rgba(0, 0, 255, 0.1)" : "transparent",
      }}
    >
      <textarea
        placeholder="Maximize your Idea's !"
        ref={textareaRef}
        rows={rows}
        value={text}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        disabled={loading}
        style={{
          fontSize: "1.1rem",
          fontWeight: "400",
          flex: 1,
          backgroundColor: "transparent",
          color: "white",
          padding: "8px",
          border: "none",
          outline: "none",
          resize: "none",
          borderRadius: "10px",
        }}
        className="scrollbar-custom"
      />
      <Box
        onMouseEnter={() => setShowDeleteIcon(true)}
        onMouseLeave={() => setShowDeleteIcon(false)}
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          // height: "100%",
        }}
      >
        {uploadedImage ? (
          <>
            <img
              src={uploadedImage}
              alt="Uploaded"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                objectFit: "cover",
                cursor: "pointer",
              }}
            />
            {showDeleteIcon && (
              <DeleteForeverIcon
                onClick={clearUploadedImage}
                sx={{
                  position: "absolute",
                  top: "-16px",
                  right: "-16px",
                  cursor: "pointer",
                  backgroundColor: "red",
                  borderRadius: "30% 30% 30% 0%",
                  color: "white",
                }}
              />
            )}
          </>
        ) : (
          <label
            htmlFor="file-upload"
            style={{ cursor: "pointer", paddingBlock: "10px" }}
          >
            <AttachFileIcon style={{ fontSize: "1.5rem", color: "white" }} />
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
          </label>
        )}
        {text && (
          <button onClick={handleAddMessage} className="text-white px-1">
            <NearMeIcon style={{ fontSize: "1.5rem" }} />
          </button>
        )}
      </Box>
    </Box>
  );
};

export default SearchBox;