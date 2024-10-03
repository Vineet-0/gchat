// /pages/index.tsx

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import JSONPretty from "react-json-pretty";

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setFontSize, setFontStyle } from '../store/slices/fontSlice';

import axios from "axios";

import NorthIcon from "@mui/icons-material/North";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { CODE_BREAKING_POINT } from "../config/codeBreaking.config";
import { CircularProgress } from "@mui/material";
import CodeViewer from "@/components/CodeViewer";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const Chat: React.FC = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<
    { id: number; text: string; sender: "user" | "bot" }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for sidebar visibility

  const FontSize = useSelector((state: RootState) => state.font.fontSize);
  const FontStyle = useSelector((state: RootState) => state.font.fontStyle);
  const dispatch = useDispatch();

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("auth-token"); // Clear the auth token
    localStorage.removeItem("login-time"); // Clear the login time
    router.push("/login"); // Redirect to the login page
  };

  // Simulate receiving messages
  const receiveMessage = (message: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: prevMessages.length + 1, text: message, sender: "bot" },
    ]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    // if (newMessage.trim()) {
    //   // Add user message
    //   setMessages((prevMessages) => [
    //     ...prevMessages,
    //     { id: prevMessages.length + 1, text: newMessage, sender: "user" },
    //   ]);
    //   setNewMessage(""); // Clear input

    //   // Simulate bot response
    //   setTimeout(() => {
    //     receiveMessage("This is a bot response!");
    //   }, 1000); // Simulating a response after 1 second
    // }
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    const loginTime = localStorage.getItem("login-time");

    // Check if the user is not logged in
    if (!token || !loginTime) {
      router.push("/login"); // Redirect to login if not authenticated
      return;
    }

    const now = Date.now();
    // const fifteenMinutes = 15 * 60 * 1000;

    // // Check if the token has expired
    // if (now - Number(loginTime) >= fifteenMinutes) {
    //   localStorage.removeItem("auth-token"); // Clear local storage if expired
    //   localStorage.removeItem("login-time");
    //   router.push("/login"); // Redirect to login
    // }
  }, [router]);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const [enable, setEnable] = useState(false);

  const [searchItem, setSearchItem] = useState("");
  const [searchData, setSearchData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    const storedHistory = localStorage.getItem("chatHistory");
    if (storedHistory) {
      setChatHistory(JSON.parse(storedHistory));
    }

    const storedData = localStorage.getItem("geminiData");
    if (storedData) {
      setSearchData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [searchData]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  function clearLocalStorage() {
    setSearchData([]);
    setChatHistory([]);
    if (localStorage.getItem("chatHistory")) {
      localStorage.removeItem("chatHistory");
      console.log(`Variable chatHistory removed from local storage.`);
    } else {
      console.log(`Variable chatHistory does not exist in local storage.`);
    }
    if (localStorage.getItem("geminiData")) {
      localStorage.removeItem("geminiData");
      console.log(`Variable geminiData removed from local storage.`);
    } else {
      console.log(`Variable geminiData does not exist in local storage.`);
    }
  }

  function setLast20ChatHistory(
    newRole: "user" | "assistant",
    newContent: string
  ) {
    let newChatHistory = [
      ...chatHistory,
      { role: newRole, content: newContent },
    ];
    if (newChatHistory.length > 20) {
      newChatHistory = newChatHistory.slice(-20);
    }
    setChatHistory(newChatHistory);
    localStorage.setItem("chatHistory", JSON.stringify(newChatHistory));
  }

  function setNewSearchData(data: string) {
    const regex = /\*\*(.*?)\*\*/g;
    let result = data;
    let matchData;

    while ((matchData = regex.exec(data)) !== null) {
      const boldText = matchData[1];
      result = result.replace(matchData[0], `${boldText}`);
    }

    let newResult = result
      ?.split(CODE_BREAKING_POINT)
      ?.map((item: any, index: any) => {
        if (index % 2 === 0) {
          return item?.replace(/^(\s*\n*\s*)|(\s*\n*\s*)$/g, "");
        } else {
          let newLanguage = "";
          let newCode = "";
          const firstNewlineIndex = item.indexOf("\n");
          if (firstNewlineIndex === -1) {
            newLanguage = item;
            newCode = "";
          } else {
            newLanguage = item.substring(0, firstNewlineIndex);
            newCode = item.substring(firstNewlineIndex + 1);
          }
          console.log({ newLanguage, newCode });
          return {
            language: newLanguage,
            code: newCode?.replace(/^(\s*\n*\s*)|(\s*\n*\s*)$/g, ""),
          };
        }
      });
    console.log([newResult]);

    let newSearchData = [...searchData, { que: searchItem, ans: newResult }];
    // if (newSearchData.length > 20) {
    //   newSearchData = newSearchData.slice(-20);
    // }
    setSearchData(newSearchData);
    localStorage.setItem("geminiData", JSON.stringify(newSearchData));
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    axios
      .request({
        method: "post",
        maxBodyLength: Infinity,
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBb7E-Q_Trxhpk_ySAoz62zgTIJXQEvew0",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    JSON.stringify(
                      chatHistory?.map(
                        (item) => `${item.role}: ${item.content}`
                      )
                    ) +
                    "\n\n" +
                    searchItem,
                },
              ],
            },
          ],
        }),
      })
      .then((response) => {
        const data =
          response.data["candidates"][0]["content"]["parts"][0]["text"];

        if (data) {
          setLast20ChatHistory("assistant", data);
          setNewSearchData(data);
        }
        setSearchItem("");
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log("got error");
      });
  };

  return (
    <div className="flex h-screen bg-gray-100 w-full max-w-full">
      {/* Sidebar */}
      <aside
        className={`transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "min-w-[15%]" : "w-0 overflow-hidden"
        }`}
      >
        <div className={`bg-[#212121] text-white p-4 h-full`}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-blue-600">gChat</h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="ml-4 px-4 py-2 text-white rounded hover:bg-slate-700 transition"
            >
              <MenuOpenIcon />
            </button>
          </div>
          <ul>
            {/* Sample chat items */}
            <li className="mb-2">
              <a href="#" className="hover:text-blue-400">
                Chat 1
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:text-blue-400">
                Chat 2
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:text-blue-400">
                Chat 3
              </a>
            </li>
            {/* Add more chat items as needed */}
          </ul>
        </div>
      </aside>

      <div
        className={`flex flex-col flex-grow bg-[#1e1e1e] h-screen transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "min-w-[85%] max-w-[85%]" : "w-full"
        }`}
      >
        {/* Top bar */}
        <header className="shadow-md flex justify-between items-center px-8 py-4 w-full">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`mr-4 px-4 py-2 ${
                isSidebarOpen ? "hidden" : "block"
              }  text-white rounded hover:bg-slate-700 transition`}
            >
              <MenuIcon />
            </button>
            <h1
              className={`text-2xl font-bold text-blue-600 ${
                isSidebarOpen ? "hidden" : "block"
              } `}
            >
              gChat
            </h1>
          </div>
          <div className="flex items-center">
            <button
              onClick={()=>dispatch(setFontSize(FontSize===10?10:FontSize-1))}
              disabled={FontSize===10}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              -
            </button>
            <div  className="text-white px-4">
            {FontSize}
            </div>
            <button
              onClick={()=>dispatch(setFontSize(FontSize===20?20:FontSize+1))}
              disabled={FontSize===20}
              className="px-4 py-2 mr-10 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              +
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main chat area */}
        <main className="flex flex-col w-full md:w-3/4 md:max-w-4/5 min-h-[90%] h-full relative px-4 md:px-1 left-[50%] translate-x-[-50%]">
          <div className="scrollbar-custom overflow-y-auto p-4 mb-[90px] h-full max-w-[100%]">
            {searchData.map((item: any, index: any) => (
              <div
                key={index}
                // style={{
                //   background: "#343434",
                //   paddingBlockEnd: "5px",
                // }}
              >
                <div
                  ref={index !== item.length-1 ? contentRef : null}
                  className="relative"
                >
                  <JSONPretty
                    id="json-pretty"
                    data={item.que}
                    style={{
                      fontSize: `${FontSize}px`,

                      fontFamily: "monospace !important",
                      whiteSpace: "pre-wrap !important",
                    }}
                    className={`my-4 px-4 py-2 rounded-3xl rounded-br-none overflow-auto w-fit max-w-[95%] bg-blue-600 ml-auto text-white self-end"}`}
                    space={4}
                  ></JSONPretty>
                  {/* <button
                    className="absolute top-[-30px] left-0 p-1 font-[8px] text-red-100 min-w-fit bg-[#343434] hover:bg-[#343434]"
                    style={{
                      minWidth: "fit-content !important",
                    }}
                    onClick={() => handleCopy(item?.que)}
                  >
                    <ContentCopyIcon /> copy
                  </button> */}
                </div>

                <div
                  className={`p-4 rounded-3xl rounded-bl-none overflow-hidden w-fit max-w-[95%] bg-[#313131] mr-auto text-white self-end"}`}
                >
                  {item?.ans?.map((it: any, index: any) => {
                    if (index % 2 === 0) {
                      return (
                        <div className={`overflow-y-auto ${index!==0?'p-4':'px-2'}`}>
                          {it && (
                            <JSONPretty
                              id="json-pretty"
                              data={it}
                              // mainStyle="padding:1em"
                              style={{
                                // padding: "4px",
                                fontFamily: "monospace !important",
                                whiteSpace: "pre-wrap !important",
                                backgroundColor: "red !important",
                                // maxWidth: "100%",
                                fontSize: `${FontSize}px`,

                                wordWrap: "break-word",
                              }}
                              space={4}
                            ></JSONPretty>
                          )}
                        </div>
                      );
                    } else {
                      return <CodeViewer it={it} />;
                    }
                  })}
                </div>
              </div>
            ))}
            {/* {messages.map((message) => (
              <p
                key={message.id}
                className={`my-4 px-4 py-2 rounded-3xl overflow-hidden w-fit max-w-[95%] ${
                  message.sender === "user"
                    ? "bg-blue-600 ml-auto text-white self-end rounded-br-none"
                    : "bg-gray-700 mr-auto text-white self-start rounded-bl-none"
                }`}
              >
                {message.text}
              </p>
            ))} */}
          </div>

          {/* Input area */}
          <form
            onSubmit={handleSubmit}
            className="border-r-10 rounded-[50px] flex p-2 bg-[#3b3b3b] w-full absolute bottom-[20px] left-[50%] translate-x-[-50%]"
          >
            <input
              type="text"
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              disabled={loading}
              placeholder="Type your message..."
              className="flex-grow px-4 py-2 mr-8 border-0 border-gray-600 rounded-lg bg-transparent text-white outline-none focus:outline-none"
            />
            {loading ? (
              <CircularProgress
                sx={{
                  position: "absolute",
                  top: "8px",
                  right: "10px",
                  padding: "4px",
                  minWidth: "fit-content !important",
                }}
              />
            ) : (
              <button
                type="submit"
                className="ml-4 p-2 bg-blue-600 text-white rounded-[50px] hover:bg-blue-500 transition absolute right-2 top-[50%] translate-y-[-50%]"
              >
                <NorthIcon />
              </button>
            )}
          </form>
        </main>
      </div>
    </div>
  );
};

export default Chat;
