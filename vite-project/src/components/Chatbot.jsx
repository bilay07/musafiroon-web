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
    setMessages([
      { role: 'bot', text: topicResponses[language][topic] }
    ]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setInputText('');
    
    const chatHistory = messages.map(msg => ({
      role: msg.role === 'bot' ? 'assistant' : 'user',
      content: msg.text
    }));

    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const isGeneralChat = selectedTopic.includes("AI");

    // 👇 AI KO AB BILKUL NATURAL AUR LOGICAL KAR DIYA HAI
    const systemPrompt = `You are a smart, polite, and logical MALE travel assistant for 'Mosafiroon' in Pakistan.
    
    LANGUAGE: Speak ONLY in natural, everyday Pakistani Roman Urdu (e.g., use words like "sahulat", "theek hai", "shukriya", "masla"). NO pure Hindi words at all.

    BEHAVIOR & LOGIC:
    1. Read the conversation history carefully and reply LOGICALLY to the user's exact question.
    2. Keep your answers natural, friendly, and very short (1 to 2 lines).
    3. DO NOT repeat greetings like "Assalam-o-Alaikum". Start answering directly.
    4. You are currently discussing: "${selectedTopic}". 

    PRICING & CONTACT LOGIC:
    - Never guess prices. If they ask for a rate/price, say: "Prices dates aur hotels par depend karti hain. Agar aap kahen toh main apni booking team ka number de doon?"
    - ONLY give the number (+92 311 2462949) if the user says "yes", "haan", "de do", or explicitly asks to talk to someone.

    DATA TO USE:
    - Umrah: 14 and 21 days premium packages.
    - Visa: 24-48 hours fast processing.
    - Transport & Ziarat available.`;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", 
          messages: [
            { role: "system", content: systemPrompt },
            ...chatHistory,
            { role: "user", content: userMsg }
          ],
          max_tokens: 300,
          temperature: 0.4
        })
      });

      const data = await response.json();
      
      if (data.error) throw new Error(data.error.message);

      const aiText = data.choices[0].message.content;
      setMessages(prev => [...prev, { role: 'bot', text: aiText }]);
      
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: `Error: ${error.message}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  const topicsEn = ["Umrah Packages", "Ziarat", "Transport", "Tickets", "Accommodation", "Visa", "Insurance", "Other Inquiries (AI)"];
  const topicsUr = ["Umrah Packages", "Ziarat", "Transport", "Tickets", "Accommodation", "Visa", "Insurance", "Deegar Sawalat (AI)"];
  const currentTopics = language === 'ur' ? topicsUr : topicsEn;

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
            ) : (
              <div className="flex flex-col gap-3 animate-fade-in">
                <div className="bg-[#cca332] text-white p-2 px-3 rounded-2xl rounded-tr-none shadow-sm self-end text-[11px] font-medium opacity-80">{selectedTopic}</div>
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

          {language && selectedTopic && (
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