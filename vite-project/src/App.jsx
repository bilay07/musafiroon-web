import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Packages from './pages/Packages.jsx';
import PremiumPackages from './pages/PremiumPackages.jsx';
import EconomyPackages from './pages/EconomyPackages.jsx';
import Customize from './pages/Customize.jsx';
import TransportPage from './pages/TransportPage.jsx';
import Admin from './Admin.jsx';
import PlaneLoader from './components/PlaneLoader.jsx';
import Chatbot from './components/Chatbot.jsx';
import './components/WhatsAppFloat.css';
import './styles/goldShine.css';
import './styles/luxuryPattern.css';

function LayoutWrapper({ children, currency, setCurrency }) {
  const location = useLocation();
  const isAdminPage = location.pathname.toLowerCase().includes('/admin');

  return (
    <>
      <div className="bg-gray-50 text-gray-800 font-sans min-h-screen flex flex-col relative">
        {!isAdminPage && <Header currency={currency} setCurrency={setCurrency} />}
        <main className="flex-grow flex flex-col">{children}</main>
        {!isAdminPage && <Footer />}
      </div>

      {!isAdminPage && (
        <>
          <a href="https://wa.me/923112462949" target="_blank" rel="noreferrer" className="wa-float" aria-label="Chat on WhatsApp">
            <span className="wa-float-halo"></span>
            <span className="wa-float-orb">
              <i className="fa-brands fa-whatsapp"></i>
            </span>
          </a>
          
          {/* CHATBOT COMPONENT YAHAN LAGA DIYA */}
          <Chatbot /> 
        </>
      )}
    </>
  );
}

function App() {
  const [currency, setCurrency] = useState('PKR');
  const [isLoading, setIsLoading] = useState(true);
  const [exchangeRates, setExchangeRates] = useState({ USD: 1, PKR: 278, SAR: 3.75 });

  useEffect(() => {
    // PKR is pinned to 278 (not fetched live) because all package prices were
    // entered in PKR by the team using that exact rate — a fluctuating live
    // rate would make the displayed PKR price drift away from the quoted price.
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => res.json())
      .then(data => {
        if (data?.rates) setExchangeRates({ USD: 1, PKR: 278, SAR: data.rates.SAR || 3.75 });
      }).catch(err => console.error("API Error:", err));
  }, []);

  // Stable reference — an inline arrow here would change identity on every
  // App re-render (e.g. when the exchange-rate fetch resolves), which was
  // resetting PlaneLoader's finish timer and making the loader run longer
  // than intended.
  const handleLoaderFinished = useCallback(() => setIsLoading(false), []);

  return (
    <>
      {isLoading ? <PlaneLoader onFinished={handleLoaderFinished} /> : (
        <Router>
          <LayoutWrapper currency={currency} setCurrency={setCurrency}>
            <Routes>
              <Route path="/" element={<Packages currency={currency} exchangeRates={exchangeRates} />} />
              <Route path="/premium-packages" element={<PremiumPackages currency={currency} exchangeRates={exchangeRates} />} />
              <Route path="/economy-packages" element={<EconomyPackages currency={currency} exchangeRates={exchangeRates} />} />
              <Route path="/customize" element={<Customize currency={currency} exchangeRates={exchangeRates} />} />
              <Route path="/transport-rates" element={<TransportPage exchangeRates={exchangeRates} />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </LayoutWrapper>
        </Router>
      )}
    </>
  );
}

export default App;