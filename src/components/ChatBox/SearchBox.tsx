import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import NearMeIcon from "@mui/icons-material/NearMe";
import CloseIcon from "@mui/icons-material/Close";

import { addMessage, setLoading } from "../../store/slices/chatSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";

import axios from "axios";

const SearchBox = () => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [text, setText] = useState("");
  const [rows, setRows] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const maxRows = 10;

  const messages = useSelector((state: RootState) => state.chat.messages);
  // const loading = useSelector((state: RootState) => state.chat.loading);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    handleTextareaFocus();
  }, []);

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
      dispatch(setLoading(true));
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
      setUploadedImage(null)
    }
  };

  const handleApisubmit = (data: any) => {
    dispatch(setLoading(true));
    axios
      .request({
        method: "post",
        maxBodyLength: Infinity,
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBb7E-Q_Trxhpk_ySAoz62zgTIJXQEvew0",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          contents: data,
        }),
      })
      .then((response) => {
        const data =
          response.data["candidates"][0]["content"]["parts"][0]["text"];
        console.log(data);

        if (data) {
          dispatch(addMessage({ role: "model", parts: [{ text: data }] }));
        } else {
          dispatch(
            addMessage({
              role: "model",
              parts: [{ text: "Don't try to enter Sensitive Info" }],
            })
          );
        }
      })
      .catch((error) => {
        dispatch(
          addMessage({ role: "model", parts: [{ text: error.message }] })
        );
        console.log("got error");
      });
    dispatch(setLoading(false));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
  
            while (resizedImage.length > 100 * 1024 && quality > 0.1) { // Loop until size < 100 KB or quality too low
              quality -= 0.05; // Decrease quality by 5%
              resizedImage = canvas.toDataURL("image/jpeg", quality);
            }
  
            setUploadedImage(resizedImage);
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };
  

  const clearUploadedImage = () => {
    setUploadedImage(null);
  };

  return (
    <Box
      sx={{
        width: "min(1000px, 100%)",
        marginInline: "auto",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        paddingInline: "min(10px, 5%)",
        border: "1px dashed white",
        borderRadius: "30px",
        padding: "10px 20px",
      }}
    >
      <textarea
        placeholder="Type a message"
        ref={textareaRef}
        rows={rows}
        value={text}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
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
      />
      <Box
        onMouseEnter={() => setShowDeleteIcon(true)}
        onMouseLeave={() => setShowDeleteIcon(false)}
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          height: "100%",
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
              <CloseIcon
                onClick={clearUploadedImage}
                sx={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  cursor: "pointer",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  borderRadius: "50%",
                  color: "white",
                }}
              />
            )}
          </>
        ) : (
          <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
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
