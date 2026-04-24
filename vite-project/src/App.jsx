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
import Chatbot from './components/Chatbot.jsx'; 

function LayoutWrapper({ children, currency, setCurrency }) {
  const location = useLocation();
  const isAdminPage = location.pathname.toLowerCase().includes('/admin');

  return (
    <>
      <div className="bg-gray-50 text-gray-800 font-sans min-h-screen flex flex-col animate-fade-in relative">
        {!isAdminPage && <Header currency={currency} setCurrency={setCurrency} />}
        <main className="flex-grow flex flex-col">{children}</main>
        {!isAdminPage && <Footer />}
      </div>

      {!isAdminPage && (
        <>
          <a href="https://wa.me/923112462949" target="_blank" rel="noreferrer" className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-[99999] bg-[#25D366] text-white w-14 h-14 md:w-16 md:h-16 rounded-full flex justify-center items-center text-3xl md:text-4xl shadow-[0_10px_20px_rgba(37,211,102,0.4)] hover:scale-110 hover:-translate-y-2 transition-all duration-300">
            <i className="fa-brands fa-whatsapp animate-pulse"></i>
          </a>
          
          {/* CHATBOT COMPONENT YAHAN LAGA DIYA */}
          <Chatbot /> 
        </>
      )}
    </>
  );
}

function App() {
  const [currency, setCurrency] = useState('USD');
  const [isLoading, setIsLoading] = useState(true);
  const [exchangeRates, setExchangeRates] = useState({ USD: 1, PKR: 278, SAR: 3.75 });

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => res.json())
      .then(data => {
        if (data?.rates) setExchangeRates({ USD: 1, PKR: data.rates.PKR || 278, SAR: data.rates.SAR || 3.75 });
      }).catch(err => console.error("API Error:", err));
  }, []);

  return (
    <>
      {isLoading ? <PlaneLoader onFinished={() => setIsLoading(false)} /> : (
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