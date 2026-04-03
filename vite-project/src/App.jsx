import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Packages from './pages/Packages.jsx';
import PremiumPackages from './pages/PremiumPackages.jsx';
import EconomyPackages from './pages/EconomyPackages.jsx';
import Customize from './pages/Customize.jsx'; 
// Naya Loader Import kiya hai
import PlaneLoader from './components/PlaneLoader.jsx'; 

function App() {
  const [currency, setCurrency] = useState('USD');
  // Loading state jo Plane animation control karegi
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
      {/* Agar isLoading true hai to sirf Loader dikhao */}
      {isLoading ? (
        <PlaneLoader onFinished={() => setIsLoading(false)} />
      ) : (
        <Router>
          <div className="bg-gray-50 text-gray-800 font-sans min-h-screen flex flex-col animate-fade-in">
            
            <Header currency={currency} setCurrency={setCurrency} />
            
            <main className="flex-grow flex flex-col">
              <Routes>
                <Route 
                  path="/" 
                  element={<Packages currency={currency} exchangeRates={exchangeRates} />} 
                />

                <Route 
                  path="/premium-packages" 
                  element={<PremiumPackages currency={currency} exchangeRates={exchangeRates} />} 
                />

                <Route 
                  path="/economy-packages" 
                  element={<EconomyPackages currency={currency} exchangeRates={exchangeRates} />} 
                />
                
                <Route 
                  path="/customize" 
                  element={<Customize currency={currency} exchangeRates={exchangeRates} />} 
                />
              </Routes>
            </main>

            <Footer />
            
          </div>
        </Router>
      )}
    </>
  );
}

export default App;