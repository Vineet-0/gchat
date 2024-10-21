import React, { useState } from "react";
import { Box, Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import { useDispatch } from "react-redux";
import { clearChat } from "../../store/slices/chatSlice";

function TopBar() {
  const userName = "Vineet";
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const dispatch = useDispatch();

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClearChat = () => {
    dispatch(clearChat());
    handleClose();
  };

  const handleLogout = () => {
    handleClose();
    console.log("Logout button clicked");
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        // paddingInline:'min(20px,5%)',
        fontSize: "1.1rem",
      }}
    >
      <IconButton
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ ml: 2 }}
      >
        <Avatar sx={{ cursor: "pointer", backgroundColor: "#1976d2" }}>
          {userName.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 0,
            px: 1,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 23,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          sx={{
            width: "fit-content",
            ml: "auto",
          }}
        >
          {userName}
        </MenuItem>
        <MenuItem
          onClick={handleClearChat}
          sx={{
            color: "white",
            borderRadius: "5px",
            backgroundColor: "orange",
            width: "fit-content",
            ml: "auto",
            my: 1,
            "&:hover": {
              backgroundColor: "#dd9510",
            },
            "&:active": {
              transform: "scale(0.95)",
            },
          }}
        >
          Clear Chat
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={{
            color: "white",
            borderRadius: "5px",
            backgroundColor: "red",
            width: "fit-content",
            ml: "auto",
            "&:hover": {
              backgroundColor: "#EE0000",
            },
            "&:active": {
              transform: "scale(0.95)",
            },
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default TopBar;
