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

// --- Naya Layout Wrapper ---
// Ye component check karega ke Header/Footer dikhana hai ya nahi
function LayoutWrapper({ children, currency, setCurrency }) {
  const location = useLocation();
  // Agar path '/admin' hai to ye true ho jayega
  const isAdminPage = location.pathname === '/admin';

  return (
    <div className="bg-gray-50 text-gray-800 font-sans min-h-screen flex flex-col animate-fade-in">
      {/* Agar Admin page NAI hai, tabhi Header dikhao */}
      {!isAdminPage && <Header currency={currency} setCurrency={setCurrency} />}
      
      <main className="flex-grow flex flex-col">
        {children}
      </main>

      {/* Agar Admin page NAI hai, tabhi Footer dikhao */}
      {!isAdminPage && <Footer />}
    </div>
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
          {/* LayoutWrapper ko Router ke andar rakhna lazmi hai */}
          <LayoutWrapper currency={currency} setCurrency={setCurrency}>
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
              <Route 
                path="/admin" 
                element={<Admin />} 
              />
            </Routes>
          </LayoutWrapper>
        </Router>
      )}
    </>
  );
}

export default App;