import React, { useState } from "react";
import {
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import { useDispatch } from "react-redux";
// import { clearChat } from "../../store/slices/chatSlice";

import ClearIcon from "@mui/icons-material/Clear";
import LogoutIcon from "@mui/icons-material/Logout";

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

  // const handleClearChat = () => {
  //   dispatch(clearChat());
  //   handleClose();
  // };

  const handleLogout = () => {
    handleClose();
    console.log("Logout button clicked");
  };

  const MENU_ITEM = [
    // {
    //   name: "Clear Chat",
    //   backgroundColor: "orange",
    //   hoverColor: "#dd9510",
    //   onClick: handleClearChat,
    //   icon: <ClearIcon sx={{color:'white'}}/>,
    // },
    {
      name: "Logout",
      backgroundColor: "red",
      hoverColor: "#EE0000",
      onClick: handleLogout,
      icon: <LogoutIcon sx={{ color: "white" }} />,
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        fontSize: "0.7rem",
      }}
    >
      <div className={`text-[16px] font-bold text-white`}>{userName}</div>
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
            py: 0,
            backgroundColor: "#424242",
            "& .MuiAvatar-root": {
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
              bgcolor: "#424242",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {MENU_ITEM.map((item: any, index: any) => (
          <MenuItem
            key={item.name}
            onClick={item.onClick}
            sx={{
              fontSize: "0.9rem",
              fontWeight: "600",
              textTransform: "capitalize",
              py: 0.5,
              px: 1,
              color: "white",
              borderRadius: "5px",
              backgroundColor: item.backgroundColor,
              // width: "fit-content",
              ml: "auto",
              mb: index !== MENU_ITEM.length - 1 ? 1 : 0,
              "&:hover": {
                backgroundColor: item.hoverColor,
              },
              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          >
            <ListItemIcon aria-setsize={12}>{item.icon}</ListItemIcon>
            {item.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export default TopBar;
