import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InlineData {
  mime_type: string;
  data: string; // Base64 encoded data
}

interface TextPart {
  text: string;
}

interface InlineDataPart {
  inline_data: InlineData;
}

type Part = TextPart | InlineDataPart;

interface ChatMessage {
  role: "user" | "model";
  parts: Part[];
}

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
}

const loadInitialState = (): ChatState => {
  const savedMessages = localStorage.getItem("chatMessages");
  return savedMessages
    ? { messages: JSON.parse(savedMessages), loading: false }
    : { messages: [], loading: false };
};

const chatSlice = createSlice({
  name: "chat",
  initialState: loadInitialState(),
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
      localStorage.setItem("chatMessages", JSON.stringify(state.messages));
      if (action.payload.role === "user") {
        state.loading = true;
      }
    },
    clearChat: (state) => {
      state.messages = [];
      localStorage.removeItem("chatMessages"); // Clear the chat data from local storage
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    deleteMessages: (state, action: PayloadAction<number>) => {
      const index = action.payload; // The index from which to delete i-th and (i + 1)-th
      if (index >= 0 && index < state.messages.length - 1) {
        state.messages.splice(index, 2); // Remove i-th and (i + 1)-th elements
        localStorage.setItem("chatMessages", JSON.stringify(state.messages)); // Update local storage
      }
    },
  },
});

export const { addMessage, clearChat, setLoading, deleteMessages } = chatSlice.actions;
export default chatSlice.reducer;
