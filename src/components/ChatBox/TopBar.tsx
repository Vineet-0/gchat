import { Box, Avatar, IconButton } from "@mui/material";
import { useDispatch } from "react-redux";
import { clearChat } from "../../store/slices/chatSlice";

function TopBar() {
  const userName = "Vineet";

  const dispatch=useDispatch();

  const handleClearChat = () => {
    dispatch(clearChat());
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        // paddingInline:'min(20px,5%)',
        fontSize:'1.1rem'
      }}
    >
      <IconButton onClick={handleClearChat} sx={{color:'white',borderRadius:'5px'}}>
        Clear Chat
      </IconButton>
      <IconButton>
        <Avatar sx={{ cursor: "pointer", backgroundColor: "#1976d2" }}>
          {userName.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>
    </Box>
  );
}

export default TopBar;
