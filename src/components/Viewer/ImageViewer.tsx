import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ImageViewer = ({ image }: { image: any }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {image ? (
        <img
          src={`data:${image?.mime_type};base64,${image?.data}`}
          alt="Inline Data"
          className="max-w-[200px] h-auto rounded-md cursor-pointer"
          onClick={handleOpen}
        />
      ) : null}

      <Dialog
        open={open}
        onClose={handleClose}
        // fullWidth={true}
        maxWidth="md"
        PaperProps={{
          sx: {
            maxWidth: { xs: "100%", sm: "80%", md: "70%", lg: "60%" },
            maxHeight: { xs: "100%", sm: "80%", md: "70%", lg: "60%" },
            overflow: "auto",
            alignItems: "center",
          },
        }}
      >
        <DialogContent sx={{ padding: "0px !important" }}>
          <img
            src={`data:${image?.mime_type};base64,${image?.data}`}
            alt="Fullscreen Image"
            style={{
              width: "fit-content !important",
              maxWidth: "100%",
              height: "auto",
            }} // maintain aspect ratio
          />
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 5, top: 5 ,backgroundColor:'#121212',color:'white',fontStyle:'bold'}}
          >
            <CloseIcon />
          </IconButton>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageViewer;
