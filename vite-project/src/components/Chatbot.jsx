import React, { useState, useRef, useEffect } from 'react';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState(null); 
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [inputText, setInputText] = useState('');
  
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  const handleBackSequence = () => {
    if (selectedTopic) setSelectedTopic(null);
    else if (language) setLanguage(null);
  };

  const handleLanguageSelect = (lang) => setLanguage(lang);

  const topicResponses = {
    en: {
      "Umrah Packages": "Assalam-o-Alaikum! How can I assist you with our Umrah Packages?",
      "Ziarat": "Assalam-o-Alaikum! How can I help you with our Ziarat tours?",
      "Transport": "Assalam-o-Alaikum! How can I assist you with Transport details?",
      "Tickets": "Assalam-o-Alaikum! How can I help you with Ticket bookings?",
      "Accommodation": "Assalam-o-Alaikum! How can I assist you regarding Accommodation?",
      "Visa": "Assalam-o-Alaikum! How can I help you with Visa processing?",
      "Insurance": "Assalam-o-Alaikum! How can I assist you with Travel Insurance?",
      "Other Inquiries (AI)": "Assalam-o-Alaikum! How can I help you today?"
    },
    ur: {
      "Umrah Packages": "Assalam-o-Alaikum! Main Umrah Packages ke hawalay se aapki kya madad kar sakta hoon?",
      "Ziarat": "Assalam-o-Alaikum! Main Ziarat ke hawalay se aapki kya madad kar sakta hoon?",
      "Transport": "Assalam-o-Alaikum! Main Transport ke hawalay se aapki kya madad kar sakta hoon?",
      "Tickets": "Assalam-o-Alaikum! Main Tickets ke hawalay se aapki kya madad kar sakta hoon?",
      "Accommodation": "Assalam-o-Alaikum! Main Accommodation (Rihaish) ke hawalay se aapki kya madad kar sakta hoon?",
      "Visa": "Assalam-o-Alaikum! Main Visa processing ke hawalay se aapki kya madad kar sakta hoon?",
      "Insurance": "Assalam-o-Alaikum! Main Travel Insurance ke hawalay se aapki kya madad kar sakta hoon?",
      "Deegar Sawalat (AI)": "Assalam-o-Alaikum! Main aapki kya madad kar sakta hoon?"
    }
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setMessages([{ role: 'bot', text: topicResponses[language][topic] }]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      // 👇 Yahan auto-detect logic lagai hai (Local ya Live Backend)
      const apiUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:5000/api/chat' 
        : 'https://AAPKA-LIVE-BACKEND-LINK.com/api/chat'; // <-- ISKO APNE LIVE BACKEND LINK SE REPLACE KAREIN

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMsg, 
          language: language 
        })
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'bot', text: data.reply || "Maaf kijiye, main abhi theek se samajh nahi paya." }]);
      
    } catch (error) {
      console.error("Backend API Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "Server connection error. Barae meharbani thori dair baad try karein." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const topicsEn = ["Umrah Packages", "Ziarat", "Transport", "Tickets", "Accommodation", "Visa", "Insurance", "Other Inquiries (AI)"];
  const topicsUr = ["Umrah Packages", "Ziarat", "Transport", "Tickets", "Accommodation", "Visa", "Insurance", "Deegar Sawalat (AI)"];
  const currentTopics = language === 'ur' ? topicsUr : topicsEn;

  return (
    <>
      <div className="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-[999999] group flex flex-col items-center justify-end">
        
        {!isOpen && (
          <div className="absolute -top-[50px] md:-top-[60px] right-12 md:right-14 flex flex-col items-end" style={{zIndex: -1}}>
            
            <div className="bg-white py-2 px-4 md:py-2.5 md:px-5 rounded-[2rem] shadow-xl border border-purple-100 text-center min-w-[120px] md:min-w-[140px] animate-cloud-float">
              <span className="block text-[#6d568c] font-semibold text-[11px] md:text-[13px] leading-tight" dir="rtl">
                السلام عليكم
              </span>
              <span className="block text-[#5a189a] font-extrabold text-[12px] md:text-[14px] leading-tight mt-0.5" dir="rtl">
                أنا مقصود
              </span>
            </div>
            
            <div className="flex flex-col items-end w-full mt-1.5 pr-0 md:pr-1">
                <div className="w-3.5 h-3.5 md:w-4 md:h-4 bg-white rounded-full shadow-md border border-purple-100 mr-3 md:mr-4"></div>
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-white rounded-full shadow-sm border border-purple-100 mr-0 mt-1"></div>
            </div>

          </div>
        )}

        <button onClick={() => setIsOpen(!isOpen)} className="hover:scale-110 transition-all outline-none relative z-10 flex justify-center items-center w-20 h-20 md:w-28 md:h-28">
          {isOpen ? (
            <div className="w-12 h-12 md:w-14 md:h-14 bg-[#1f0333] rounded-full flex justify-center items-center shadow-lg border-2 border-[#cca332]">
              <i className="fa-solid fa-xmark text-white text-xl md:text-2xl"></i>
            </div>
          ) : (
            <img src="/chatbot.gif" alt="Maqsood" className="w-full h-full object-contain drop-shadow-lg scale-110 translate-y-2" />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-28 right-4 md:bottom-40 md:right-8 z-[999999] w-[85vw] max-w-[320px] md:max-w-[360px] h-[450px] md:h-[520px] max-h-[75vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#cca332]/30 animate-fade-in origin-bottom-right">
          
          <div className="bg-gradient-to-r from-[#5a189a] via-[#3b0764] to-[#1f0333] p-3 md:p-4 flex items-center shadow-md flex-shrink-0">
            {language && (
              <button onClick={handleBackSequence} className="mr-2 text-white hover:text-[#cca332] w-6 h-6 md:w-8 md:h-8 flex justify-center items-center transition-all">
                <i className="fa-solid fa-chevron-left text-base md:text-lg"></i>
              </button>
            )}
            
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full p-1 border-2 border-[#cca332] overflow-hidden flex justify-center items-center flex-shrink-0">
              <img src="/chatbot.gif" alt="Maqsood" className="w-full h-full object-cover scale-125" />
            </div>
            
            <div className="text-left ml-2 md:ml-3 flex-grow">
               <h3 className="text-white font-black uppercase text-[12px] md:text-[14px] tracking-wide">Maqsood</h3>
               <p className="text-[#cca332] text-[8px] md:text-[10px] font-bold flex items-center gap-1">
                 <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse"></span> Online
               </p>
            </div>
            {language && (
              <button onClick={() => {setLanguage(null); setSelectedTopic(null);}} className="text-white/70 hover:text-white w-6 h-6 md:w-8 md:h-8 flex justify-center items-center">
                <i className="fa-solid fa-house text-xs md:text-sm"></i>
              </button>
            )}
          </div>

          <div className="flex-grow bg-[#f8f9fa] p-3 md:p-4 overflow-y-auto flex flex-col gap-3 md:gap-4 scroll-smooth">
            {!language ? (
              <div className="animate-fade-in flex flex-col gap-3">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-xs md:text-sm text-gray-700">
                  <p className="font-bold text-[#3b0764]">Assalam-o-Alaikum!</p>
                  <p className="text-[10px] md:text-xs mt-1">Muntakhib karein / Select Language:</p>
                </div>
                <button onClick={() => handleLanguageSelect('en')} className="bg-[#3b0764] text-white py-2.5 px-4 rounded-xl flex justify-between items-center font-bold text-[11px] md:text-xs shadow-md">English <i className="fa-solid fa-arrow-right"></i></button>
                <button onClick={() => handleLanguageSelect('ur')} className="bg-[#cca332] text-white py-2.5 px-4 rounded-xl flex justify-between items-center font-bold text-[11px] md:text-xs shadow-md">اردو (Roman Urdu) <i className="fa-solid fa-arrow-right"></i></button>
              </div>
            ) : !selectedTopic ? (
              <div className="grid grid-cols-2 gap-2 animate-fade-in">
                <div className="col-span-2 bg-white p-2.5 md:p-3 rounded-2xl rounded-tl-none shadow-sm text-xs md:text-sm text-gray-700 mb-1 md:mb-2 font-medium">
                  {language === 'en' ? 'Choose a service:' : 'Service muntakhib karein:'}
                </div>
                {currentTopics.map((topic, idx) => (
                  <button key={idx} onClick={() => handleTopicSelect(topic)} className="bg-white border border-[#cca332] text-[#3b0764] py-2 md:py-2.5 px-1 rounded-lg text-[10px] md:text-[11px] font-bold shadow-sm hover:bg-[#cca332] hover:text-white transition-all">{topic}</button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 md:gap-3 animate-fade-in">
                <div className="bg-[#cca332] text-white p-1.5 px-3 rounded-2xl rounded-tr-none shadow-sm self-end text-[9px] md:text-[11px] font-medium opacity-80">{selectedTopic}</div>
                {messages.map((msg, index) => (
                  <div key={index} className={`max-w-[85%] p-2.5 md:p-3 text-[11px] md:text-xs font-medium whitespace-pre-wrap break-words ${msg.role === 'user' ? 'bg-[#cca332] text-white rounded-2xl rounded-tr-none self-end shadow-sm' : 'bg-white border border-gray-100 text-gray-700 rounded-2xl rounded-tl-none self-start shadow-sm'}`}>{msg.text}</div>
                ))}
                {isTyping && (
                  <div className="bg-white border border-gray-100 text-gray-500 rounded-2xl rounded-tl-none self-start shadow-sm p-2.5 md:p-3 text-[11px] md:text-xs font-medium flex flex-row gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                  </div>
                )}
                <div ref={chatEndRef} className="h-2" />
              </div>
            )}
          </div>

          {language && selectedTopic && (
            <div className="w-full p-2.5 md:p-3 bg-white border-t z-20 shadow-inner flex-shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder={language === 'en' ? "Type message..." : "Sawal likhein..."} className="flex-grow bg-gray-100 rounded-full px-3 md:px-4 py-2 md:py-2.5 text-[11px] md:text-xs outline-none focus:bg-white focus:border-[#cca332] border border-transparent transition-all shadow-inner" disabled={isTyping} />
                <button type="submit" disabled={isTyping} className={`bg-[#3b0764] text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex justify-center items-center shadow-md transition-all ${isTyping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#cca332]'}`}><i className="fa-solid fa-paper-plane text-xs md:text-sm"></i></button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Chatbot;