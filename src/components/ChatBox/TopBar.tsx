import React, { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import {
  addChat,
  setLoading,
  setCurrentChatId,
  deleteChat,
  setChatName,
  resetChats,
  clearCurrentChat,
  toggleSideBar
} from "../../store/slices/chatSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add"; // Import AddIcon
import { styled } from "@mui/material/styles";
import DensityMediumIcon from '@mui/icons-material/DensityMedium';

import ClearIcon from "@mui/icons-material/Clear";
import LogoutIcon from "@mui/icons-material/Logout";

function TopBar() {
  const userName = "Vineet";
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { chats, currentChatId, loading,sideBarOpen } = useSelector(
      (state: RootState) => state?.chatsData
    );

  const dispatch = useDispatch<AppDispatch>();

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

  const handleWindowResize = () => {
    const windowWidth = window.innerWidth;
    if (windowWidth < 768 && sideBarOpen) {
      // Call function x (or any other action)
      dispatch(toggleSideBar()); // Example: Close the sidebar
    }
    if (windowWidth >= 1024 &&!sideBarOpen) {
      // Call function y (or any other action)
      dispatch(toggleSideBar()); // Example: Open the sidebar
    }
  };

  useEffect(() => {
    // Add event listener for window resize
    window.addEventListener("resize", handleWindowResize);
    return () => {
      // Clean up event listener on component unmount
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [sideBarOpen, dispatch]); // Add sideBarOpen and dispatch to dependency array

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: "0.7rem",
      }}
    >
      {!sideBarOpen && <button
          onClick={() => !loading && dispatch(toggleSideBar())}
          className="px-2"
        >
          <DensityMediumIcon />
        </button>}
      <div className="w-full flex items-center justify-end">
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
      </div>
    </Box>
  );
}

export default TopBar;
