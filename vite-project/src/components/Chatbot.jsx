import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyCS0gXFNzKotDaEiiZsoMBmmIdjsE6eOgA"; 
const genAI = new GoogleGenerativeAI(apiKey);

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState(null); 
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [inputText, setInputText] = useState('');
  
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
  };

  const handleTopicSelect = (topic) => {
    if (topic.includes("AI")) {
      setSelectedTopic("AI_CHAT");
    } else {
      setSelectedTopic(topic);
    }
  };

  // --- Naya function wapas main menu par jane ke liye ---
  const goBackToMenu = () => {
    setSelectedTopic(null);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setInputText('');
    setSelectedTopic("AI_CHAT"); 
    
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const systemPrompt = `You are a helpful and polite travel assistant for a company named 'Mosafiroon' based in Pakistan. You help customers with Umrah packages, Ziarat, Visa, and tickets. Keep your answers short, professional, and friendly. The user prefers to speak in ${language === 'ur' ? 'Roman Urdu (Pakistani style)' : 'English'}. User asked: ${userMsg}`;

      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      const aiText = response.text();

      setMessages(prev => [...prev, { role: 'bot', text: aiText }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: `Error: ${error.message}` 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const topicsEn = ["Umrah Packages", "Ziarat", "Transport", "Tickets", "Accommodation", "Visa", "Insurance", "Other Inquiries (AI)"];
  const topicsUr = ["Umrah Packages", "Ziarat", "Transport", "Tickets", "Accommodation", "Visa", "Insurance", "Deegar Sawalat (AI)"];
  const currentTopics = language === 'ur' ? topicsUr : topicsEn;

  const topicResponses = {
    en: {
      "Umrah Packages": "We offer premium 14-day and 21-day Umrah packages including 5-star hotel stays and transport. Please leave a message to get a customized quote.",
      "Ziarat": "Our Ziarat tours cover all major holy sites in Makkah and Madinah with experienced guides.",
      "Transport": "We provide luxury buses, GMCs, and private cars for Jeddah to Makkah, and Makkah to Madinah transfers.",
      "Tickets": "We offer competitive airline ticket rates for all major airlines flying to Saudi Arabia.",
      "Accommodation": "Partnered with top-tier hotels in Makkah (Clock Tower) and Madinah (Markazia) for the best stay.",
      "Visa": "Fast and reliable Umrah Visa processing within 24 to 48 hours.",
      "Insurance": "Comprehensive travel insurance covering medical emergencies during your Umrah trip."
    },
    ur: {
      "Umrah Packages": "Hum 14 aur 21 din ke premium Umrah packages faraham karte hain jismein 5-star hotels aur transport shamil hain.",
      "Ziarat": "Humari Ziarat service mein Makkah aur Madinah ke tamam ahem muqamat tajurbakar guide ke sath shamil hain.",
      "Transport": "Jeddah se Makkah aur Madinah ke liye luxury buses aur private gariyon ki sahulat dastiyab hai.",
      "Tickets": "Saudi Arabia jane wali tamam bari airlines ke saste aur mayari tickets dastiyab hain.",
      "Accommodation": "Makkah (Clock Tower) aur Madinah (Markazia) ke behtareen hotels mein rihaish.",
      "Visa": "24 se 48 ghante ke andar Umrah Visa ki fauri processing.",
      "Insurance": "Dauran-e-safar kisi bhi medical emergency ke liye mukammal travel insurance."
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-[99999] w-16 h-16 md:w-20 md:h-20 transition-all duration-300 bg-transparent flex justify-center items-center hover:scale-110 outline-none"
      >
        {isOpen ? (
          <div className="w-12 h-12 bg-[#1f0333] rounded-full flex justify-center items-center shadow-lg border-2 border-[#cca332]">
            <i className="fa-solid fa-xmark text-white text-xl"></i>
          </div>
        ) : (
          <img src="/chatbot.png" alt="Chatbot" className="w-full h-full object-contain drop-shadow-xl" />
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-4 md:bottom-32 md:right-8 z-[100000] w-[90vw] md:w-[360px] h-[520px] bg-white rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden border border-[#cca332]/30 animate-fade-in origin-bottom-right">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#5a189a] via-[#3b0764] to-[#1f0333] p-4 relative flex items-center shadow-md z-10">
            <div className="w-10 h-10 bg-white rounded-full p-1 border-2 border-[#cca332]">
              <img src="/chatbot.png" alt="Bot" className="w-full h-full object-contain" />
            </div>
            <div className="text-left ml-3 flex-grow">
               <h3 className="text-white font-black tracking-widest uppercase text-[12px]">Mosafiroon AI</h3>
               <p className="text-[#cca332] text-[10px] font-bold flex items-center gap-1">
                 <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
               </p>
            </div>
            
            {/* 👇 PERMANENT BACK/HOME BUTTON (Sirf tab dikhega jab language select ho chuki ho) */}
            {language && (
              <button 
                onClick={goBackToMenu}
                className="bg-white/10 hover:bg-white/20 text-white w-8 h-8 rounded-lg flex justify-center items-center transition-all mr-1"
                title="Back to Menu"
              >
                <i className="fa-solid fa-house text-sm"></i>
              </button>
            )}
          </div>

          <div className="flex-grow bg-[#f8f9fa] p-4 overflow-y-auto flex flex-col gap-4 pb-20 scroll-smooth">
            
            {!language ? (
              <>
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-[90%] text-sm text-gray-700">
                  <p className="mb-2 font-bold text-[#3b0764]">Assalam-o-Alaikum! Welcome to Mosafiroon.</p>
                  <p className="text-xs text-gray-600 mb-1">Please select your preferred language.</p>
                </div>
                <div className="flex flex-col gap-2 mt-1">
                  <button onClick={() => handleLanguageSelect('en')} className="bg-[#3b0764] text-white py-2.5 px-4 rounded-xl hover:bg-[#1f0333] text-xs font-bold shadow-md text-left flex justify-between items-center group">
                    English <i className="fa-solid fa-arrow-right text-[#cca332]"></i>
                  </button>
                  <button onClick={() => handleLanguageSelect('ur')} className="bg-[#cca332] text-white py-2.5 px-4 rounded-xl hover:bg-[#b08d2a] text-xs font-bold shadow-md text-left flex justify-between items-center group">
                    اردو (Roman Urdu) <i className="fa-solid fa-arrow-right text-[#3b0764]"></i>
                  </button>
                </div>
              </>
            ) : (
              <>
                {!selectedTopic ? (
                  <div className="flex flex-col gap-3 mt-1 animate-fade-in">
                    <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-[90%] text-sm text-gray-700">
                      {language === 'en' ? 'How can I assist you today?' : 'Aaj main aapki kya madad kar sakti hoon?'}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {currentTopics.map((topic, idx) => (
                        <button 
                          key={idx}
                          onClick={() => handleTopicSelect(topic)}
                          className="bg-white border border-[#cca332] text-[#3b0764] py-2 px-1 rounded-lg hover:bg-[#cca332] hover:text-white transition-all text-[11px] font-bold shadow-sm text-center"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : selectedTopic !== "AI_CHAT" ? (
                  <div className="flex flex-col gap-3 animate-fade-in">
                    <div className="bg-[#cca332] text-white p-2 px-3 rounded-2xl rounded-tr-none shadow-sm self-end text-[11px] font-medium">
                      {selectedTopic}
                    </div>
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-sm text-gray-700">
                      <p className="leading-relaxed">{topicResponses[language][selectedTopic]}</p>
                    </div>
                    {/* 👇 Optional: Niche wala back button bhi rehne dete hain for easy access */}
                    <button onClick={goBackToMenu} className="self-start text-[#3b0764] hover:text-[#cca332] text-xs font-bold flex items-center gap-1 mt-2">
                      <i className="fa-solid fa-arrow-left"></i> {language === 'en' ? 'Back' : 'Wapas'}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 animate-fade-in">
                    {messages.length === 0 && (
                      <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-[90%] text-sm text-gray-700">
                        {language === 'en' ? 'Ask me anything about Umrah, Packages, or Visas!' : 'Umrah, Packages ya Visa ke baaray mein poochiye!'}
                      </div>
                    )}
                    
                    {messages.map((msg, index) => (
                      <div key={index} className={`max-w-[85%] p-3 text-xs font-medium ${msg.role === 'user' ? 'bg-[#cca332] text-white rounded-2xl rounded-tr-none self-end shadow-sm' : 'bg-white border border-gray-100 text-gray-700 rounded-2xl rounded-tl-none self-start shadow-sm'}`}>
                        {msg.text}
                      </div>
                    ))}

                    {isTyping && (
                      <div className="bg-white border border-gray-100 text-gray-500 rounded-2xl rounded-tl-none self-start shadow-sm p-3 text-xs font-medium flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                )}
              </>
            )}
          </div>

          {language && (
            <div className="absolute bottom-0 left-0 w-full p-3 bg-white border-t border-gray-200 z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
              <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={language === 'en' ? "Type message..." : "Sawal likhein..."}
                  className="flex-grow bg-gray-100 border border-gray-300 rounded-full px-4 py-2.5 text-xs outline-none focus:border-[#cca332] focus:bg-white transition-all shadow-inner"
                  disabled={isTyping}
                />
                <button type="submit" disabled={isTyping} className={`bg-[#3b0764] text-white w-10 h-10 rounded-full flex justify-center items-center shadow-md transition-all ${isTyping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#cca332]'}`}>
                  <i className="fa-solid fa-paper-plane text-sm"></i>
                </button>
              </form>
            </div>
          )}

        </div>
      )}
    </>
  );
}

export default Chatbot;