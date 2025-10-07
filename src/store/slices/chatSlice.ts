import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

// Define the Chat interface
interface Chat {
    chatId: string;
    name: string; // Add name for each chat
    data: Array<{
        role: 'user' | 'model';
        parts: Array<
            | { text: string }
            | {
                  inline_data?: {
                      mime_type: string;
                      data: string;
                  };
              }
        >;
    }>;
}

// Define the state structure
interface ChatState {
    chats: Chat[]; // All chats
    currentChatId: string | null; // Currently active chat ID
    loading: boolean; // Loading state
    sideBarOpen: boolean; // Add sideBarOpen state
}

// Retrieve the chat history from localStorage or initialize with a default chat
const getInitialState = (): ChatState => {
    const chatHistory = localStorage.getItem('chatHistory');
    const currentChatId = localStorage.getItem('currentChatId');
    const sideBarOpenString = localStorage.getItem('sideBarOpen'); // Get sideBarOpen from localStorage
    const sideBarOpen =
        sideBarOpenString === null ? true : JSON.parse(sideBarOpenString); // Parse and use default if null

    if (chatHistory) {
        const chats = JSON.parse(chatHistory);
        return {
            chats,
            currentChatId:
                currentChatId || (chats.length > 0 ? chats[0].chatId : null),
            loading: false,
            sideBarOpen, // Include sideBarOpen in the returned state
        };
    } else {
        const defaultChatId = uuidv4();
        const defaultChat: Chat = { chatId: defaultChatId, name: '', data: [] };

        const initialState = {
            chats: [defaultChat],
            currentChatId: defaultChatId,
            loading: false,
            sideBarOpen: true, // Set default value for sideBarOpen
        };

        localStorage.setItem('chatHistory', JSON.stringify(initialState.chats));
        localStorage.setItem('currentChatId', defaultChatId);
        localStorage.setItem(
            'sideBarOpen',
            JSON.stringify(initialState.sideBarOpen)
        ); // Save sideBarOpen to localStorage
        return initialState;
    }
};

const initialState: ChatState = getInitialState();

// Create the slice
const chatSlice = createSlice({
    name: 'chatsData',
    initialState,
    reducers: {
        // Create a new empty chat with a new chatId
        addChat: (state) => {
            const newChatId = uuidv4();
            const newChat: Chat = { chatId: newChatId, name: '', data: [] };
            state?.chats?.reverse()?.push(newChat);
            state?.chats?.reverse();
            state.currentChatId = newChatId; // Set as the current chat
            localStorage?.setItem('chatHistory', JSON.stringify(state?.chats));
            localStorage?.setItem('currentChatId', newChatId); // Save the new currentChatId to localStorage
        },
        // Delete a chat by chatId
        deleteChat: (state, action: PayloadAction<string>) => {
            state.chats = state?.chats?.filter(
                (chat) => chat?.chatId !== action?.payload
            );
            if (state?.currentChatId === action?.payload) {
                state.currentChatId =
                    state?.chats?.length > 0 ? state?.chats?.[0]?.chatId : null; // Reset to the first chat or null
                localStorage.setItem(
                    'currentChatId',
                    state?.currentChatId || ''
                );
            }
            localStorage.setItem('chatHistory', JSON.stringify(state.chats));
        },
        deleteQuestionAnswer: (state, action: PayloadAction<number>) => {
            if (state.currentChatId) {
                const currentChat = state.chats.find(
                    (chat) => chat.chatId === state.currentChatId
                );
                if (currentChat) {
                    currentChat.data.splice(action.payload, 2);
                }
                localStorage.setItem(
                    'chatHistory',
                    JSON.stringify(state.chats)
                );
            }
        },
        addQuestion: (
            state,
            action: PayloadAction<
                Array<{
                    role: 'user';
                    parts: Array<
                        | { text: string }
                        | {
                              inline_data?: {
                                  mime_type: string;
                                  data: string;
                              };
                          }
                    >;
                }>
            >
        ) => {
            if (state.currentChatId) {
                const currentChat = state.chats.find(
                    (chat) => chat.chatId === state.currentChatId
                );
                if (currentChat) {
                    // Loop through the array in the payload and push each object into the chat's data
                    action.payload.forEach((message) => {
                        currentChat.data.push(message);
                    });
                }
                localStorage.setItem(
                    'chatHistory',
                    JSON.stringify(state.chats)
                );
            }
        },
        addAnswer: (state, action: PayloadAction<{ text: string }>) => {
            if (state.currentChatId) {
                const currentChat = state.chats.find(
                    (chat) => chat.chatId === state.currentChatId
                );
                if (currentChat) {
                    currentChat.data.push({
                        role: 'model',
                        parts: [{ text: action.payload.text }],
                    });
                }
                localStorage.setItem(
                    'chatHistory',
                    JSON.stringify(state.chats)
                );
            }
        },
        // Set the current active chat ID and update in localStorage
        setCurrentChatId: (state, action: PayloadAction<string | null>) => {
            state.currentChatId = action.payload;
            localStorage.setItem('currentChatId', action.payload || '');
        },
        // Set the loading state
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        // Update the chat name by chatId
        setChatName: (
            state,
            action: PayloadAction<{ chatId: string; name: string }>
        ) => {
            const { chatId, name } = action.payload;
            const chat = state.chats.find((chat) => chat.chatId === chatId);
            if (chat) {
                chat.name = name; // Update the chat name
                localStorage.setItem(
                    'chatHistory',
                    JSON.stringify(state.chats)
                ); // Save updated chats to localStorage
            }
        },
        setChatOrder: (state, action: PayloadAction<Chat[]>) => {
            state.chats = action.payload;
            localStorage.setItem('chatHistory', JSON.stringify(state.chats));
        },
        resetChats: (state) => {
            const defaultChatId = uuidv4();
            const defaultChat: Chat = {
                chatId: defaultChatId,
                name: '',
                data: [],
            };

            const resetState = {
                chats: [defaultChat],
                currentChatId: defaultChatId,
                loading: false,
                sideBarOpen: true,
            };

            localStorage.removeItem('chatHistory');
            localStorage.removeItem('currentChatId');
            state = resetState;
        },
        clearCurrentChat: (state) => {
            if (state.currentChatId) {
                const currentChatIndex = state.chats.findIndex(
                    (chat) => chat.chatId === state.currentChatId
                );

                if (currentChatIndex !== -1) {
                    state.chats[currentChatIndex].data = []; // Clear the data array
                    localStorage.setItem(
                        'chatHistory',
                        JSON.stringify(state.chats)
                    );
                }
            }
        },
        toggleSideBar: (state) => {
            state.sideBarOpen = !state.sideBarOpen;
            localStorage.setItem(
                'sideBarOpen',
                JSON.stringify(state.sideBarOpen)
            );
        },
    },
});

// Export actions and reducer
export const {
    addChat,
    deleteChat,
    deleteQuestionAnswer,
    addQuestion,
    addAnswer,
    setCurrentChatId,
    setLoading,
    setChatName, // Export setChatName action
    setChatOrder,
    resetChats,
    clearCurrentChat,
    toggleSideBar,
} = chatSlice.actions;

export default chatSlice.reducer;
