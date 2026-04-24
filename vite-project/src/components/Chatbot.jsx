import React, { useState, useRef, useEffect } from 'react';

// 👇 Aapki Groq API Key
const apiKey = "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"; 

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

  const handleBackSequence = () => {
    if (selectedTopic) setSelectedTopic(null);
    else if (language) setLanguage(null);
  };

  const handleLanguageSelect = (lang) => setLanguage(lang);

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic.includes("AI") ? "AI_CHAT" : topic);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setInputText('');
    setSelectedTopic("AI_CHAT"); 
    
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const systemPrompt = `You are a professional travel assistant for 'Mosafiroon'. Help with Umrah, Ziarat, Visa, and tickets. Keep answers short and polite. Language: ${language === 'ur' ? 'Roman Urdu (Pakistani Style)' : 'English'}.`;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          // 👇 YAHAN TABDEELI KI HAI: Latest active model laga diya hai
          model: "llama-3.3-70b-versatile", 
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMsg }
          ],
          max_tokens: 500
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      const aiText = data.choices[0].message.content;
      setMessages(prev => [...prev, { role: 'bot', text: aiText }]);
      
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: `System Error: ${error.message}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  const topicsEn = ["Umrah Packages", "Ziarat", "Transport", "Tickets", "Accommodation", "Visa", "Insurance", "Other Inquiries (AI)"];
  const topicsUr = ["Umrah Packages", "Ziarat", "Transport", "Tickets", "Accommodation", "Visa", "Insurance", "Deegar Sawalat (AI)"];
  const currentTopics = language === 'ur' ? topicsUr : topicsEn;

  const topicResponses = {
    en: {
      "Umrah Packages": "We offer premium 14-day and 21-day Umrah packages. Please leave a message for a quote.",
      "Ziarat": "Our Ziarat tours cover all major holy sites in Makkah and Madinah.",
      "Transport": "Luxury buses and private cars are available for all transfers.",
      "Tickets": "Best airline rates for Saudi Arabia are available.",
      "Accommodation": "Premium hotel options in Makkah and Madinah.",
      "Visa": "Fast Umrah Visa processing within 24-48 hours.",
      "Insurance": "Travel insurance is included for medical emergencies."
    },
    ur: {
      "Umrah Packages": "Hum premium 14 aur 21 din ke Umrah packages faraham karte hain.",
      "Ziarat": "Makkah aur Madinah ke tamam muqaddas muqamat ki Ziarat.",
      "Transport": "GMC aur luxury buses ki sahulat dastiyab hai.",
      "Tickets": "Saste airline tickets ke liye humse rabta karein.",
      "Accommodation": "Behtareen hotels mein rihaish ka bandobast.",
      "Visa": "Umrah Visa sirf 24 se 48 ghanto mein.",
      "Insurance": "Mukammal travel insurance ki sahulat."
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-[99999] w-16 h-16 md:w-20 md:h-20 hover:scale-110 transition-all outline-none">
        {isOpen ? (
          <div className="w-12 h-12 bg-[#1f0333] rounded-full flex justify-center items-center shadow-lg border-2 border-[#cca332]">
            <i className="fa-solid fa-xmark text-white text-xl"></i>
          </div>
        ) : (
          <img src="/chatbot.png" alt="Chatbot" className="w-full h-full object-contain" />
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-4 md:bottom-32 md:right-8 z-[100000] w-[90vw] md:w-[360px] h-[520px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#cca332]/30 animate-fade-in origin-bottom-right">
          
          <div className="bg-gradient-to-r from-[#5a189a] via-[#3b0764] to-[#1f0333] p-4 flex items-center shadow-md">
            {language && (
              <button onClick={handleBackSequence} className="mr-2 text-white hover:text-[#cca332] w-8 h-8 flex justify-center items-center transition-all">
                <i className="fa-solid fa-chevron-left text-lg"></i>
              </button>
            )}
            <div className="w-10 h-10 bg-white rounded-full p-1 border-2 border-[#cca332]">
              <img src="/chatbot.png" alt="Bot" className="w-full h-full object-contain" />
            </div>
            <div className="text-left ml-3 flex-grow">
               <h3 className="text-white font-black uppercase text-[12px]">Mosafiroon AI</h3>
               <p className="text-[#cca332] text-[10px] font-bold flex items-center gap-1">
                 <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
               </p>
            </div>
            {language && (
              <button onClick={() => {setLanguage(null); setSelectedTopic(null);}} className="text-white/70 hover:text-white w-8 h-8 flex justify-center items-center">
                <i className="fa-solid fa-house text-sm"></i>
              </button>
            )}
          </div>

          <div className="flex-grow bg-[#f8f9fa] p-4 overflow-y-auto flex flex-col gap-4 pb-20">
            {!language ? (
              <div className="animate-fade-in flex flex-col gap-3">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-700">
                  <p className="font-bold text-[#3b0764]">Assalam-o-Alaikum!</p>
                  <p className="text-xs">Muntakhib karein / Select Language:</p>
                </div>
                <button onClick={() => handleLanguageSelect('en')} className="bg-[#3b0764] text-white py-3 px-4 rounded-xl flex justify-between items-center font-bold text-xs shadow-md">English <i className="fa-solid fa-arrow-right"></i></button>
                <button onClick={() => handleLanguageSelect('ur')} className="bg-[#cca332] text-white py-3 px-4 rounded-xl flex justify-between items-center font-bold text-xs shadow-md">اردو (Roman Urdu) <i className="fa-solid fa-arrow-right"></i></button>
              </div>
            ) : !selectedTopic ? (
              <div className="grid grid-cols-2 gap-2 animate-fade-in">
                <div className="col-span-2 bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-700 mb-2 font-medium">
                  {language === 'en' ? 'Choose a service:' : 'Service muntakhib karein:'}
                </div>
                {currentTopics.map((topic, idx) => (
                  <button key={idx} onClick={() => handleTopicSelect(topic)} className="bg-white border border-[#cca332] text-[#3b0764] py-2.5 px-1 rounded-lg text-[11px] font-bold shadow-sm hover:bg-[#cca332] hover:text-white transition-all">{topic}</button>
                ))}
              </div>
            ) : selectedTopic !== "AI_CHAT" ? (
              <div className="flex flex-col gap-3 animate-fade-in">
                <div className="bg-[#cca332] text-white p-2 px-3 rounded-2xl rounded-tr-none shadow-sm self-end text-[11px] font-medium">{selectedTopic}</div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-sm text-gray-700 leading-relaxed">
                  {topicResponses[language][selectedTopic]}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 animate-fade-in">
                {messages.length === 0 && (
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-[90%] text-sm text-gray-700">
                    {language === 'en' ? 'Ask me anything about Umrah, Packages, or Visas!' : 'Umrah, Packages ya Visa ke baaray mein kuch bhi poochiye!'}
                  </div>
                )}
                {messages.map((msg, index) => (
                  <div key={index} className={`max-w-[85%] p-3 text-xs font-medium ${msg.role === 'user' ? 'bg-[#cca332] text-white rounded-2xl rounded-tr-none self-end shadow-sm' : 'bg-white border border-gray-100 text-gray-700 rounded-2xl rounded-tl-none self-start shadow-sm'}`}>{msg.text}</div>
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
          </div>

          {language && (
            <div className="absolute bottom-0 left-0 w-full p-3 bg-white border-t z-20 shadow-inner">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder={language === 'en' ? "Type message..." : "Sawal likhein..."} className="flex-grow bg-gray-100 rounded-full px-4 py-2.5 text-xs outline-none focus:bg-white focus:border-[#cca332] border border-transparent transition-all shadow-inner" disabled={isTyping} />
                <button type="submit" disabled={isTyping} className={`bg-[#3b0764] text-white w-10 h-10 rounded-full flex justify-center items-center shadow-md transition-all ${isTyping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#cca332]'}`}><i className="fa-solid fa-paper-plane text-sm"></i></button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Chatbot;