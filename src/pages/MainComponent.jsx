"use client";
import React from "react";

import { useUpload } from "../utilities/runtime-helpers";
import { useState } from "react";
import { useHandleStreamResponse } from "../hooks/useHandleStreamResponse";


function MainComponent() {
  const [query, setQuery] = useState("");
  const [upload, { loading }] = useUpload();
  const [file, setFile] = useState(null);
  const [showFileManager, setShowFileManager] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatLanguage, setChatLanguage] = useState("en");
  const [imageLanguage, setImageLanguage] = useState("en");
  const [language, setLanguage] = useState("en");
  const [translations, setTranslations] = useState({});
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: "Bitcoin price analysis", date: "2024-01-15" },
    { id: 2, title: "AI technology trends", date: "2024-01-14" },
    { id: 3, title: "Tech conference details", date: "2024-01-13" },
  ]);
  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "nl", name: "Dutch" },
    { code: "pl", name: "Polish" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" },
    { code: "ar", name: "Arabic" },
    { code: "hi", name: "Hindi" },
    { code: "bn", name: "Bengali" },
    { code: "sr", name: "Serbian" },
  ];
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const { url } = await upload({ file });
      console.log("Uploaded file URL:", url);
      setShowFileManager(false);
    }
  };
  const handleCameraClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "camera";
    input.click();
    input.onchange = async (e) => {
      const file = e.target.files[0];
      setFile(file);
      const { url } = await upload({ file });
      console.log("Captured image URL:", url);
    };
  };
  const openFileManager = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.click();
    input.onchange = handleFileChange;
  };
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [textareaHeight, setTextareaHeight] = useState("auto");
  const [messages, setMessages] = useState([]);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);

  React.useEffect(() => {
    const translateText = async () => {
      if (language === "sr") {
        const textsToTranslate = [
          "What do you want to know?",
          "Search anything...",
          "History",
          "Supported formats: PDF, DOC, DOCX, TXT, PNG, JPG",
          "Cancel",
          "Chat Language:",
          "Image Language:",
          "Bitcoin price analysis",
          "AI technology trends",
          "Tech conference details",
          "Create image",
          "Surprise me",
          "Summarize text",
          "Analyze images",
          "Get advice",
          "Help me write",
          "Code",
          "Brainstorm",
          "Select Language",
          "Unlock boundless creativity and innovation with Srpski.AI—your ultimate partner in writing, learning, and brainstorming. Empower yourself to achieve, discover, and create with ease and intuition.",
          "Srpski.AI is here to help!",
          "Ask me anything...",
          "What is the current Bitcoin price?",
          "Tell me about recent AI trends",
          "What are the upcoming tech conferences?",
          "Help me analyze an image",
          "I need advice",
          "Help me write something",
          "Help me with coding",
          "Let's brainstorm ideas",
          "Bitcoin price",
          "AI trends",
          "Conferences",
          "John Doe",
          "john@example.com",
        ];

        const responses = await Promise.all(
          textsToTranslate.map((text) =>
            fetch("/integrations/google-translate/language/translate/v2", {
              method: "POST",
              body: new URLSearchParams({
                q: text,
                target: "sr",
                source: "en",
              }),
            }).then((res) => res.json()),
          ),
        );

        const newTranslations = {};
        responses.forEach((response, index) => {
          newTranslations[textsToTranslate[index]] =
            response.data.translations[0].translatedText;
        });
        setTranslations(newTranslations);
      }
    };

    translateText();
  }, [language]);

  const getTranslation = (text) => {
    return language === "sr" ? translations[text] || text : text;
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && query.trim()) {
      handleSubmit();
    }
  };
  const handleButtonClick = (text) => {
    setQuery(text);
    const textarea = document.querySelector('textarea[name="query"]');
    if (textarea) {
      textarea.focus();
    }
    const chatContainer = document.querySelector(".chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };
  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingMessage,
    onFinish: (message) => {
      setMessages((prev) => [...prev, { role: "assistant", content: message }]);
      setStreamingMessage("");
      const chatContainer = document.querySelector(".chat-container");
      const bottomChat = document.querySelector("#bottom-chat");
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
      if (bottomChat) {
        bottomChat.scrollIntoView({ behavior: "smooth" });
      }
    },
  });
  const handleSubmit = async () => {
    if (!query.trim()) return;

    setHasInteracted(true);
    const userMessage = { role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");

    const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...messages, userMessage],
        stream: true,
      }),
    });
    handleStreamResponse(response);
  };
  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
  };

  React.useEffect(() => {
    const chatContainer = document.querySelector(".chat-container");
    const bottomChat = document.querySelector("#bottom-chat");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    if (bottomChat) {
      bottomChat.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streamingMessage, query]);

  return (
    <div
      className={`flex flex-col md:flex-row min-h-screen ${
        isDarkMode ? "bg-[#1C1C1C] text-white" : "bg-white text-black"
      } font-montserrat`}
    >
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 shadow-lg z-30"
        style={{
          backgroundColor: isDarkMode ? "#2C2C2C" : "#f3f4f6",
        }}
      >
        <i
          className={`fas ${isDarkMode ? "fa-sun" : "fa-moon"} text-lg ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        ></i>
      </button>
      <div
        className={`${
          isSidebarOpen ? "w-full md:w-64" : "w-0"
        } transform transition-all duration-500 ease-in-out ${
          isDarkMode ? "bg-[#2C2C2C]" : "bg-gray-100"
        } overflow-hidden flex flex-col h-screen fixed md:relative z-50`}
        style={{
          opacity: isSidebarOpen ? 1 : 0,
          visibility: isSidebarOpen ? "visible" : "hidden",
          transform: `translateX(${isSidebarOpen ? "0" : "-100%"})`,
        }}
      >
        <div className="p-4 flex-1">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-400 hover:text-current transition-colors duration-300"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="mb-2 text-sm text-gray-400">Select Language</div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={`w-full mb-6 ${
              isDarkMode ? "bg-[#3C3C3C]" : "bg-white"
            } p-2 rounded-lg border border-gray-600 transition-colors duration-300`}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <h2 className="text-xl font-medium mb-4">
            {getTranslation("Chat History")}
          </h2>
          <div className="space-y-2">
            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                className={`p-2 ${
                  isDarkMode ? "hover:bg-[#3C3C3C]" : "hover:bg-gray-200"
                } rounded cursor-pointer transition-colors duration-300`}
              >
                <div className="text-sm">{getTranslation(chat.title)}</div>
                <div className="text-xs text-gray-400">{chat.date}</div>
              </div>
            ))}
          </div>
        </div>
        <div
          className={`p-4 border-t ${
            isDarkMode ? "border-gray-700" : "border-gray-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <i className="fas fa-user text-gray-300"></i>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">John Doe</div>
              <div className="text-xs text-gray-400">john@example.com</div>
            </div>
            <button className="text-gray-400 hover:text-current transition-colors duration-300">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-2 flex flex-col h-screen">
        <div className="md:fixed md:top-0 md:left-0 md:right-0 md:z-50 md:bg-inherit">
          <div
            onClick={() => setLanguage(language === "en" ? "sr" : "en")}
            className="relative mx-auto md:fixed md:left-1/2 md:top-4 md:-translate-x-1/2 cursor-pointer mb-8 w-full max-w-[160px] px-2 transition-all duration-300"
          >
            <div className="relative">
              <div
                className={`w-full h-[32px] rounded-full p-1 transition-colors duration-300 ${
                  isDarkMode ? "bg-[#2C2C2C]" : "bg-gray-200"
                } flex items-center relative`}
              >
                <div
                  className={`absolute w-[calc(50%-4px)] h-[24px] bg-white rounded-full transition-all duration-300 ${
                    language === "sr"
                      ? "translate-x-[calc(100%+4px)]"
                      : "translate-x-[4px]"
                  }`}
                ></div>
                <span
                  className={`flex-1 text-xs text-center z-10 transition-colors duration-300 ${
                    language === "en" ? "text-black" : "text-gray-400"
                  }`}
                >
                  English
                </span>
                <span
                  className={`flex-1 text-xs text-center z-10 transition-colors duration-300 ${
                    language === "sr" ? "text-black" : "text-gray-400"
                  }`}
                >
                  Srpski
                </span>
              </div>
            </div>
          </div>
        </div>

        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 left-4 text-gray-400 hover:text-white"
          >
            <i className="fas fa-bars"></i>
          </button>
        )}

        {!hasInteracted && (
          <div className="max-w-2xl mx-auto mt-12 md:mt-24 px-2 flex-grow">
            <h1 className="text-2xl font-medium text-center mb-2 mt-8">
              {getTranslation("Srpski.AI is here to help!")}
            </h1>
            <p className="text-sm text-gray-400 text-center mb-6">
              {getTranslation(
                "Unlock boundless creativity and innovation with Srpski.AI your ultimate partner in writing, learning, and brainstorming. Empower yourself to achieve, discover, and create with ease.",
              )}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 mb-6">
              <button
                onClick={() =>
                  handleButtonClick("What is the current Bitcoin price?")
                }
                className={`p-1.5 rounded-lg text-center hover:bg-[#3C3C3C] transition-colors ${
                  isDarkMode ? "bg-[#2C2C2C]" : "bg-gray-100"
                }`}
              >
                <i className="fab fa-bitcoin mb-1 text-base"></i>
                <div className="text-[10px]">
                  {getTranslation("Bitcoin price")}
                </div>
              </button>
              <button
                onClick={() =>
                  handleButtonClick("Tell me about recent AI trends")
                }
                className={`p-1.5 rounded-lg text-center hover:bg-[#3C3C3C] transition-colors ${
                  isDarkMode ? "bg-[#2C2C2C]" : "bg-gray-100"
                }`}
              >
                <i className="fas fa-robot mb-1 text-base"></i>
                <div className="text-[10px]">{getTranslation("AI trends")}</div>
              </button>
              <button
                onClick={() =>
                  handleButtonClick("What are the upcoming tech conferences?")
                }
                className={`p-1.5 rounded-lg text-center hover:bg-[#3C3C3C] transition-colors ${
                  isDarkMode ? "bg-[#2C2C2C]" : "bg-gray-100"
                }`}
              >
                <i className="fas fa-calendar mb-1 text-base"></i>
                <div className="text-[10px]">
                  {getTranslation("Conferences")}
                </div>
              </button>
              <button
                onClick={() => handleButtonClick("Help me analyze an image")}
                className={`p-1.5 rounded-lg text-center hover:bg-[#3C3C3C] transition-colors ${
                  isDarkMode ? "bg-[#2C2C2C]" : "bg-gray-100"
                }`}
              >
                <i className="fas fa-image mb-1 text-base"></i>
                <div className="text-[10px]">
                  {getTranslation("Analyze images")}
                </div>
              </button>
              <button
                onClick={() => handleButtonClick("I need advice")}
                className={`p-1.5 rounded-lg text-center hover:bg-[#3C3C3C] transition-colors ${
                  isDarkMode ? "bg-[#2C2C2C]" : "bg-gray-100"
                }`}
              >
                <i className="fas fa-lightbulb mb-1 text-base"></i>
                <div className="text-[10px]">
                  {getTranslation("Get advice")}
                </div>
              </button>
              <button
                onClick={() => handleButtonClick("Help me write something")}
                className={`p-1.5 rounded-lg text-center hover:bg-[#3C3C3C] transition-colors ${
                  isDarkMode ? "bg-[#2C2C2C]" : "bg-gray-100"
                }`}
              >
                <i className="fas fa-pen mb-1 text-base"></i>
                <div className="text-[10px]">
                  {getTranslation("Help me write")}
                </div>
              </button>
              <button
                onClick={() => handleButtonClick("Help me with coding")}
                className={`p-1.5 rounded-lg text-center hover:bg-[#3C3C3C] transition-colors ${
                  isDarkMode ? "bg-[#2C2C2C]" : "bg-gray-100"
                }`}
              >
                <i className="fas fa-code mb-1 text-base"></i>
                <div className="text-[10px]">{getTranslation("Code")}</div>
              </button>
              <button
                onClick={() => handleButtonClick("Let's brainstorm ideas")}
                className={`p-1.5 rounded-lg text-center hover:bg-[#3C3C3C] transition-colors ${
                  isDarkMode ? "bg-[#2C2C2C]" : "bg-gray-100"
                }`}
              >
                <i className="fas fa-brain mb-1 text-base"></i>
                <div className="text-[10px]">
                  {getTranslation("Brainstorm")}
                </div>
              </button>
            </div>
          </div>
        )}

        {(messages.length > 0 || streamingMessage) && (
          <div
            className="max-w-2xl mx-auto w-full px-2 flex-1 mt-16 mb-4 chat-container"
            style={{
              overflowY: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div className="flex flex-col min-h-0">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 flex items-start gap-2 ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === "user"
                        ? isDarkMode
                          ? "bg-[#3C3C3C]"
                          : "bg-blue-100"
                        : isDarkMode
                          ? "bg-[#2C2C2C]"
                          : "bg-gray-100"
                    }`}
                  >
                    <i
                      className={`${
                        message.role === "user" ? "fas fa-user" : "fas fa-robot"
                      } text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    ></i>
                  </div>
                  <div className="flex flex-col gap-2 max-w-[80%]">
                    <div
                      className={`inline-block p-3 rounded-lg ${
                        message.role === "user"
                          ? isDarkMode
                            ? "bg-[#3C3C3C]"
                            : "bg-blue-100"
                          : isDarkMode
                            ? "bg-[#2C2C2C]"
                            : "bg-gray-100"
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.role === "assistant" && (
                      <button
                        onClick={() => handleCopyText(message.content)}
                        className="self-end text-gray-400 hover:text-current text-sm"
                      >
                        <i className="fas fa-copy"></i>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {streamingMessage && (
                <div className="flex items-start gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isDarkMode ? "bg-[#2C2C2C]" : "bg-gray-100"
                    }`}
                  >
                    <i
                      className={`fas fa-robot text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    ></i>
                  </div>
                  <div className="flex flex-col gap-2 max-w-[80%]">
                    <div
                      className={`inline-block p-3 rounded-lg ${
                        isDarkMode ? "bg-[#2C2C2C]" : "bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <i className="fas fa-spinner animate-[spin_1s_linear_infinite]"></i>
                        <span>srpski.ai is thinking</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div
          id="bottom-chat"
          className="max-w-2xl mx-auto w-full px-2 py-4 mt-auto"
        >
          <div
            className={`flex flex-col sm:flex-row items-center ${
              isDarkMode ? "bg-[#2C2C2C]" : "bg-gray-100"
            } rounded-lg shadow-lg border ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <textarea
              name="query"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value === "") {
                  setTextareaHeight("48px");
                } else {
                  setTextareaHeight("auto");
                  setTextareaHeight(`${e.target.scrollHeight}px`);
                }
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder={getTranslation("Ask me anything...")}
              style={{
                height: textareaHeight,
                minHeight: "48px",
                maxHeight: "160px",
              }}
              className={`w-full bg-transparent p-3 resize-none ${
                isDarkMode
                  ? "text-white placeholder-gray-400"
                  : "text-black placeholder-gray-500"
              } focus:outline-none text-base`}
            />
            <div className="flex items-center gap-3 p-2 sm:pr-4 w-full sm:w-auto justify-end">
              <button
                onClick={openFileManager}
                className="text-gray-400 hover:text-current px-1.5 py-0.5"
              >
                <i className="fas fa-paperclip text-lg"></i>
              </button>
              <button
                onClick={handleCameraClick}
                className="text-gray-400 hover:text-current px-1.5 py-0.5"
              >
                <i className="fas fa-camera text-lg"></i>
              </button>
              <div className="h-6 w-[1px] bg-gray-600"></div>
              <button
                onClick={handleSubmit}
                className="text-gray-400 hover:text-current px-1.5"
              >
                <i className="fas fa-arrow-right text-lg"></i>
              </button>
            </div>
          </div>
          {showFileManager && (
            <div
              className={`mt-2 p-4 rounded-lg shadow-lg ${
                isDarkMode
                  ? "bg-[#2C2C2C] border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
            >
              <div className="flex flex-col gap-4">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#1C1C1C] file:text-white hover:file:bg-[#3C3C3C]"
                />
                <div className="text-sm text-gray-400">
                  {getTranslation(
                    "Supported formats: PDF, DOC, DOCX, TXT, PNG, JPG",
                  )}
                </div>
                <button
                  onClick={() => setShowFileManager(false)}
                  className="text-gray-400 hover:text-current text-sm"
                >
                  {getTranslation("Cancel")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

<style jsx global>{`
  .chat-container::-webkit-scrollbar {
    display: none;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`}</style>;



export default MainComponent;
