import React, { useState, useRef, useEffect } from "react";
import {
    addChat,
    setCurrentChatId,
    deleteChat,
    setChatName,
    resetChats,
    clearCurrentChat,
    toggleSideBar,
} from "../../store/slices/chatSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add"; // Import AddIcon
import { Menu, MenuItem, Button } from "@mui/material";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";

import LogoutIcon from "@mui/icons-material/Logout";

const SideBar = () => {
    const { chats, currentChatId, loading, sideBarOpen } = useSelector(
        (state: RootState) => state?.chatsData
    );
    const dispatch = useDispatch<AppDispatch>();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [chatIdForMenu, setChatIdForMenu] = useState<string | null>(null);

    const chatListRef = useRef<HTMLDivElement>(null);

    const handleClick = (
        event: React.MouseEvent<HTMLElement>,
        chatId: string
    ) => {
        setAnchorEl(event?.currentTarget);
        setChatIdForMenu(chatId);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = (chatId: string) => {
        dispatch(deleteChat(chatId));
        handleClose();
    };

    const handleRename = (chatId: string) => {
        const newName = prompt("Enter new chat name:");
        if (newName && newName?.trim()) {
            dispatch(setChatName({ chatId, name: newName }));
        }
        handleClose();
    };

    const shouldShowDelete = chats?.length > 1;

    useEffect(() => {
        setTimeout(() => {
            if (!loading) {
                if (chatListRef?.current) {
                    chatListRef?.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
                }
            }
        }, 100);
    }, [chats, currentChatId, loading]);

    const getChatDisplayName = (chat: any): string | undefined => {
        if (!chat?.data?.[0]?.parts?.[0]) return undefined;

        const firstPart = chat?.data?.[0]?.parts?.[0];
        return "text" in firstPart
            ? firstPart?.text
            : firstPart?.inline_data?.data;
    };

    return (
        <div
            className={`z-[1000] md:block fixed top-0 left-0 h-full overflow-y-auto bg-[#171717] p-2 select-none transition-all duration-300 ease-in-out ${
                !sideBarOpen ? "translate-x-[-100%]" : "" // Use translate-x for smoother transition
            }`}
            style={{ width: "250px", right: 0 }} // Use style for width, avoids conflict with translate-x
        >
            <div className="w-full h-full flex flex-col gap-2">
                <div className="w-full flex items-center justify-between">
                    <button
                        onClick={() => !loading && dispatch(toggleSideBar())}
                        className="px-2"
                    >
                        <DensityMediumIcon />
                    </button>
                    <Button
                        variant="contained"
                        onClick={() => !loading && dispatch(addChat())}
                        startIcon={<AddIcon />}
                        sx={{
                            backgroundColor: (theme) =>
                                theme?.palette?.primary?.main,
                            color: (theme) => theme?.palette?.common?.white,
                            "&:hover": {
                                backgroundColor: (theme) =>
                                    theme?.palette?.primary?.dark,
                            },
                        }}
                    >
                        Add Chat
                    </Button>
                </div>
                <div className="w-full h-full flex flex-col gap-1 flex-1 overflow-auto scrollbar-custom">
                    {chats.map((item, index) => (
                        <div
                            key={item?.chatId}
                            ref={
                                item?.chatId === currentChatId
                                    ? chatListRef
                                    : null
                            }
                            onClick={() =>
                                !loading &&
                                dispatch(setCurrentChatId(item?.chatId))
                            }
                            className={`w-full pl-4 py-1 flex items-center justify-between rounded-md shadow-md hover:bg-[#2f2f2f] ${
                                item.chatId === currentChatId
                                    ? "bg-[#2f2f2f]"
                                    : ""
                            }`}
                        >
                            <div className="overflow-hidden w-full max-h-6 flex text-nowrap">
                                {item?.name ||
                                    getChatDisplayName(item) ||
                                    `Chat - ${index}`}
                            </div>
                            <button
                                onClick={(e) => handleClick(e, item?.chatId)}
                                className="text-white p-1"
                            >
                                <MoreVertIcon />
                            </button>
                        </div>
                    ))}
                </div>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
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
                                right: 15,
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
                    <MenuItem
                        onClick={() => handleRename(chatIdForMenu!)}
                        sx={{
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            textTransform: "capitalize",
                            py: 0.5,
                            px: 1,
                            borderRadius: "5px",
                            // backgroundColor: "green",
                            color: "white",
                            // width: "fit-content",
                            ml: "auto",
                            mb: shouldShowDelete ? 1 : 0,
                            "&:hover": {
                                backgroundColor: "#009900",
                            },
                            "&:active": {
                                transform: "scale(0.95)",
                            },
                        }}
                    >
                        <EditIcon style={{ marginRight: "8px" }} />
                        Rename
                    </MenuItem>
                    {shouldShowDelete && (
                        <MenuItem
                            onClick={() => handleDelete(chatIdForMenu!)}
                            sx={{
                                fontSize: "0.9rem",
                                fontWeight: "600",
                                textTransform: "capitalize",
                                py: 0.5,
                                px: 1,
                                color: "white",
                                borderRadius: "5px",
                                // width: "fit-content",
                                ml: "auto",
                                "&:hover": {
                                    backgroundColor: "#EE0000",
                                },
                                "&:active": {
                                    transform: "scale(0.95)",
                                },
                            }}
                        >
                            <DeleteForeverIcon style={{ marginRight: "8px" }} />
                            Delete Chat
                        </MenuItem>
                    )}
                </Menu>
                <Button
                    variant="contained"
                    onClick={() => !loading && dispatch(clearCurrentChat())}
                    sx={{
                        backgroundColor: (theme) =>
                            theme?.palette?.primary?.main,
                        color: (theme) => theme?.palette?.common?.white,
                        "&:hover": {
                            backgroundColor: (theme) =>
                                theme?.palette?.primary?.dark,
                        },
                    }}
                >
                    Clear Chat
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        dispatch(resetChats());
                        window?.location?.reload();
                    }}
                    sx={{
                        backgroundColor: "red",
                        color: "white",
                        gap: "5px",
                        "&:hover": {
                            backgroundColor: "#BB0000",
                        },
                    }}
                >
                    <LogoutIcon />
                    Log Out
                </Button>
            </div>
        </div>
    );
};

export default SideBar;
