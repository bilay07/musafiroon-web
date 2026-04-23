import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Packages from './pages/Packages.jsx';
import PremiumPackages from './pages/PremiumPackages.jsx';
import EconomyPackages from './pages/EconomyPackages.jsx';
import Customize from './pages/Customize.jsx'; 
import Admin from './Admin.jsx'; 
import PlaneLoader from './components/PlaneLoader.jsx'; 

// --- Layout Wrapper ---
function LayoutWrapper({ children, currency, setCurrency }) {
  const location = useLocation();
  const isAdminPage = location.pathname.toLowerCase().includes('/admin');

  return (
    <>
      {/* 1. Main Animated Website Content */}
      <div className="bg-gray-50 text-gray-800 font-sans min-h-screen flex flex-col animate-fade-in relative">
        {!isAdminPage && <Header currency={currency} setCurrency={setCurrency} />}
        
        <main className="flex-grow flex flex-col">
          {children}
        </main>

        {!isAdminPage && <Footer />}
      </div>

      {/* 2. GLOBAL FLOATING BUTTONS (Frontend Only) */}
      {!isAdminPage && (
        <>
          {/* WhatsApp Button */}
          <a 
            href="https://wa.me/923112462949" 
            target="_blank" 
            rel="noreferrer"
            className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-[99999] bg-[#25D366] text-white w-14 h-14 md:w-16 md:h-16 rounded-full flex justify-center items-center text-3xl md:text-4xl shadow-[0_10px_20px_rgba(37,211,102,0.4)] hover:scale-110 hover:-translate-y-2 transition-all duration-300"
          >
            <i className="fa-brands fa-whatsapp animate-pulse"></i>
          </a>

          {/* Chatbot Button - NO BORDER & LARGER SIZE (.png fix) */}
          <button 
            onClick={() => alert("Chatbot is coming soon!")} 
            className="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-[99999] w-16 h-16 md:w-24 md:h-24 transition-all duration-300 bg-transparent flex justify-center items-center group outline-none border-none shadow-none"
          >
            <img 
              src="/chatbot.png" 
              alt="Chatbot" 
              className="w-full h-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.2)] group-hover:scale-110 transition-transform duration-300" 
            />
          </button>
        </>
      )}
    </>
  );
}

function App() {
  const [currency, setCurrency] = useState('USD');
  const [isLoading, setIsLoading] = useState(true);
  
  const [exchangeRates, setExchangeRates] = useState({ 
    USD: 1, 
    PKR: 278, 
    SAR: 3.75 
  });

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(response => response.json())
      .then(data => {
        if (data && data.rates) {
          setExchangeRates({
            USD: 1,
            PKR: data.rates.PKR || 278,
            SAR: data.rates.SAR || 3.75
          });
        }
      })
      .catch(err => {
        console.error("Currency API Error:", err);
      });
  }, []);

  return (
    <>
      {isLoading ? (
        <PlaneLoader onFinished={() => setIsLoading(false)} />
      ) : (
        <Router>
          <LayoutWrapper currency={currency} setCurrency={setCurrency}>
            <Routes>
              <Route path="/" element={<Packages currency={currency} exchangeRates={exchangeRates} />} />
              <Route path="/premium-packages" element={<PremiumPackages currency={currency} exchangeRates={exchangeRates} />} />
              <Route path="/economy-packages" element={<EconomyPackages currency={currency} exchangeRates={exchangeRates} />} />
              <Route path="/customize" element={<Customize currency={currency} exchangeRates={exchangeRates} />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </LayoutWrapper>
        </Router>
      )}
    </>
  );
}

export default App;