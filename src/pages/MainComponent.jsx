"use client";
import React from "react";

import { useUpload } from "../utilities/runtime-helpers";
import { useState } from "react";



function MainComponent() {
  const [query, setQuery] = useState("");
  const [upload, { loading }] = useUpload();
  const [file, setFile] = useState(null);
  const [showFileManager, setShowFileManager] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
  const [isDarkMode, setIsDarkMode] = useState(true);

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
            }).then((res) => res.json())
          )
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
        } transition-all duration-300 ${
          isDarkMode ? "bg-[#2C2C2C]" : "bg-gray-100"
        } overflow-hidden flex flex-col h-screen fixed md:relative z-50`}
      >
        <div className="p-4 flex-1">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-400 hover:text-current"
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
            } p-2 rounded-lg border border-gray-600`}
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
                } rounded cursor-pointer`}
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
            <button className="text-gray-400 hover:text-current">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div
          onClick={() => setLanguage(language === "en" ? "sr" : "en")}
          className={`absolute top-8 left-1/2 -translate-x-1/2 cursor-pointer mb-12 w-full max-w-[200px] px-4`}
        >
          <div className="relative">
            <div
              className={`w-full h-[40px] rounded-full p-1 transition-colors duration-300 ${
                isDarkMode ? "bg-[#2C2C2C]" : "bg-gray-200"
              } flex items-center relative`}
            >
              <div
                className={`absolute w-[calc(50%-4px)] h-[32px] bg-white rounded-full transition-all duration-300 ${
                  language === "sr"
                    ? "translate-x-[calc(100%+4px)]"
                    : "translate-x-[4px]"
                }`}
              ></div>
              <span
                className={`flex-1 text-sm text-center z-10 transition-colors duration-300 ${
                  language === "en" ? "text-black" : "text-gray-400"
                }`}
              >
                English
              </span>
              <span
                className={`flex-1 text-sm text-center z-10 transition-colors duration-300 ${
                  language === "sr" ? "text-black" : "text-gray-400"
                }`}
              >
                Srpski
              </span>
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

        <div className="max-w-3xl mx-auto mt-16 md:mt-32 px-4">
          <h1 className="text-4xl font-medium text-center mb-8 mt-12">
            {getTranslation("Srpski is here to help!")}
          </h1>
          <div className="relative">
            <div
              className={`flex flex-col sm:flex-row items-center ${
                isDarkMode ? "bg-[#2C2C2C]" : "bg-gray-100"
              } rounded-lg`}
            >
              <input
                type="text"
                name="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={getTranslation("Ask anything...")}
                className={`w-full bg-transparent p-4 ${
                  isDarkMode
                    ? "text-white placeholder-gray-400"
                    : "text-black placeholder-gray-500"
                } focus:outline-none`}
              />
              <div className="flex items-center gap-2 p-4 sm:pr-4 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setShowFileManager(!showFileManager)}
                  className="text-gray-400 hover:text-current px-2 py-1"
                >
                  <i className="fas fa-paperclip"></i>
                </button>
                <button
                  onClick={handleCameraClick}
                  className="text-gray-400 hover:text-current px-2 py-1"
                >
                  <i className="fas fa-camera"></i>
                </button>
                <div className="h-6 w-[1px] bg-gray-600"></div>
                <button className="text-gray-400 hover:text-current">
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
              <button
                onClick={() => setQuery(getTranslation("Create image"))}
                className={`${
                  isDarkMode
                    ? "bg-[#2C2C2C] hover:bg-[#3C3C3C]"
                    : "bg-gray-100 hover:bg-gray-200"
                } p-2 rounded-lg flex items-center gap-2 transition-colors text-sm`}
              >
                <i className="fas fa-image text-xs"></i>
                <span>{getTranslation("Create image")}</span>
              </button>
              <button
                onClick={() => setQuery(getTranslation("Surprise me"))}
                className={`${
                  isDarkMode
                    ? "bg-[#2C2C2C] hover:bg-[#3C3C3C]"
                    : "bg-gray-100 hover:bg-gray-200"
                } p-2 rounded-lg flex items-center gap-2 transition-colors text-sm`}
              >
                <i className="fas fa-magic text-xs"></i>
                <span>{getTranslation("Surprise me")}</span>
              </button>
              <button
                onClick={() => setQuery(getTranslation("Summarize text"))}
                className={`${
                  isDarkMode
                    ? "bg-[#2C2C2C] hover:bg-[#3C3C3C]"
                    : "bg-gray-100 hover:bg-gray-200"
                } p-2 rounded-lg flex items-center gap-2 transition-colors text-sm`}
              >
                <i className="fas fa-file-alt text-xs"></i>
                <span>{getTranslation("Summarize text")}</span>
              </button>
              <button
                onClick={() => setQuery(getTranslation("Analyze images"))}
                className={`${
                  isDarkMode
                    ? "bg-[#2C2C2C] hover:bg-[#3C3C3C]"
                    : "bg-gray-100 hover:bg-gray-200"
                } p-2 rounded-lg flex items-center gap-2 transition-colors text-sm`}
              >
                <i className="fas fa-search text-xs"></i>
                <span>{getTranslation("Analyze images")}</span>
              </button>
              <button
                onClick={() => setQuery(getTranslation("Get advice"))}
                className={`${
                  isDarkMode
                    ? "bg-[#2C2C2C] hover:bg-[#3C3C3C]"
                    : "bg-gray-100 hover:bg-gray-200"
                } p-2 rounded-lg flex items-center gap-2 transition-colors text-sm`}
              >
                <i className="fas fa-lightbulb text-xs"></i>
                <span>{getTranslation("Get advice")}</span>
              </button>
              <button
                onClick={() => setQuery(getTranslation("Help me write"))}
                className={`${
                  isDarkMode
                    ? "bg-[#2C2C2C] hover:bg-[#3C3C3C]"
                    : "bg-gray-100 hover:bg-gray-200"
                } p-2 rounded-lg flex items-center gap-2 transition-colors text-sm`}
              >
                <i className="fas fa-pen text-xs"></i>
                <span>{getTranslation("Help me write")}</span>
              </button>
              <button
                onClick={() => setQuery(getTranslation("Code"))}
                className={`${
                  isDarkMode
                    ? "bg-[#2C2C2C] hover:bg-[#3C3C3C]"
                    : "bg-gray-100 hover:bg-gray-200"
                } p-2 rounded-lg flex items-center gap-2 transition-colors text-sm`}
              >
                <i className="fas fa-code text-xs"></i>
                <span>{getTranslation("Code")}</span>
              </button>
              <button
                onClick={() => setQuery(getTranslation("Brainstorm"))}
                className={`${
                  isDarkMode
                    ? "bg-[#2C2C2C] hover:bg-[#3C3C3C]"
                    : "bg-gray-100 hover:bg-gray-200"
                } p-2 rounded-lg flex items-center gap-2 transition-colors text-sm`}
              >
                <i className="fas fa-brain text-xs"></i>
                <span>{getTranslation("Brainstorm")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;