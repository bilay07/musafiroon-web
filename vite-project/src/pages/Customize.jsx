import React, { useState, useEffect } from 'react';
import './Customize.css'; 

function Customize({ currency, exchangeRates }) {
  const makkahHotels = [
    { id: 1, name: "Abraj Al Bait (Clock Tower)", rate: 550 },
    { id: 2, name: "Pullman ZamZam", rate: 400 },
    { id: 3, name: "Swissotel Makkah", rate: 350 },
    { id: 4, name: "Anjum Hotel", rate: 250 },
  ];

  const madinaHotels = [
    { id: 1, name: "Oberoi Madina", rate: 600 },
    { id: 2, name: "Anwar Al Madinah Movenpick", rate: 380 },
    { id: 3, name: "Shaza Al Madina", rate: 320 },
    { id: 4, name: "Pullman Zamzam Madina", rate: 300 },
  ];

  const transports = [
    { id: 'bus', name: "Shared Bus (Totally Free)", rate: 0 },
    { id: 'car', name: "Private Sedan (Max 4 Persons)", rate: 450 },
    { id: 'suv', name: "GMC / SUV (Max 7 Persons)", rate: 850 },
  ];

  const bankDetails = [
    { bankName: "HBL (Habib Bank Limited)", title: "Bin Aziz Tourism", accountNo: "1234-5678901-23", iban: "PK30 HABB 1234 5678 9012 3" },
    { bankName: "Meezan Bank", title: "Bin Aziz Tourism", accountNo: "0987-6543210-98", iban: "PK50 MEZN 0987 6543 2109 8" }
  ];

  const visaRateSAR = 685;
  const ziyaratRateSAR = 250; 
  const profitPKR = 15000; 

  const [makkahStay, setMakkahStay] = useState({ hotelId: '', nights: 1, rate: 0 });
  const [madinaStay, setMadinaStay] = useState({ hotelId: '', nights: 1, rate: 0 });
  const [transportRate, setTransportRate] = useState(0);
  const [includeZiyarat, setIncludeZiyarat] = useState(false);
  const [grandTotal, setGrandTotal] = useState(0);
  const [showBankDetails, setShowBankDetails] = useState(false);

  const currencySymbols = { USD: "$", PKR: "Rs", SAR: "SR" };

  const convertCurrency = (amount, fromCurrency) => {
    if (!exchangeRates || !exchangeRates[fromCurrency] || !exchangeRates[currency]) return 0;
    const amountInUSD = amount / exchangeRates[fromCurrency];
    return amountInUSD * exchangeRates[currency];
  };

  useEffect(() => {
    const makkahCostSAR = makkahStay.rate * makkahStay.nights;
    const madinaCostSAR = madinaStay.rate * madinaStay.nights;
    const zRateSAR = includeZiyarat ? ziyaratRateSAR : 0;

    const totalSAR = makkahCostSAR + madinaCostSAR + transportRate + zRateSAR + visaRateSAR;
    
    const convertedTotalFromSAR = convertCurrency(totalSAR, 'SAR');
    const convertedProfit = convertCurrency(profitPKR, 'PKR');

    setGrandTotal(Math.round(convertedTotalFromSAR + convertedProfit));
  }, [makkahStay, madinaStay, transportRate, includeZiyarat, currency, exchangeRates]);

  const handleMakkahChange = (e) => {
    const id = parseInt(e.target.value);
    const hotel = makkahHotels.find(h => h.id === id);
    setMakkahStay({ ...makkahStay, hotelId: id, rate: hotel ? hotel.rate : 0 });
    setShowBankDetails(false);
  };

  const handleMadinaChange = (e) => {
    const id = parseInt(e.target.value);
    const hotel = madinaHotels.find(h => h.id === id);
    setMadinaStay({ ...madinaStay, hotelId: id, rate: hotel ? hotel.rate : 0 });
    setShowBankDetails(false);
  };

  const handleTransportChange = (e) => {
    const selectedId = e.target.value;
    const selectedTransport = transports.find(t => t.id === selectedId);
    setTransportRate(selectedTransport ? selectedTransport.rate : 0);
    setShowBankDetails(false);
  };

  return (
    <div className="customize-container">
      <div className="customize-wrapper">
        <h2 className="calc-title">Build Your Own Umrah</h2>
        <p className="calc-subtitle">Design your spiritual journey exactly the way you want.</p>

        <div className="layout-grid">
          
          <div className="left-column">
            
            <div className="section-block">
              <div className="section-header">
                <span>🕋</span> Accommodations
              </div>
              <div className="section-body inner-grid">
                <div>
                  <div className="form-group">
                    <label>Makkah Hotel</label>
                    <select className="calc-select" onChange={handleMakkahChange} value={makkahStay.hotelId}>
                      <option value="">-- Choose Makkah Hotel --</option>
                      {makkahHotels.map(h => (
                        <option key={h.id} value={h.id}>{h.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Nights</label>
                    <input 
                      type="number" 
                      min="1" 
                      className="calc-input"
                      value={makkahStay.nights}
                      onChange={(e) => {
                        setMakkahStay({...makkahStay, nights: parseInt(e.target.value) || 0});
                        setShowBankDetails(false);
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="form-group">
                    <label>Madinah Hotel</label>
                    <select className="calc-select" onChange={handleMadinaChange} value={madinaStay.hotelId}>
                      <option value="">-- Choose Madinah Hotel --</option>
                      {madinaHotels.map(h => (
                        <option key={h.id} value={h.id}>{h.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Nights</label>
                    <input 
                      type="number" 
                      min="1" 
                      className="calc-input"
                      value={madinaStay.nights}
                      onChange={(e) => {
                        setMadinaStay({...madinaStay, nights: parseInt(e.target.value) || 0});
                        setShowBankDetails(false);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="section-block">
              <div className="section-header">
                <span>🚌</span> Transport & Additional Services
              </div>
              <div className="section-body inner-grid">
                
                <div className="form-group">
                  <label>Select Ground Transport</label>
                  <select className="calc-select" onChange={handleTransportChange}>
                    <option value="">-- No Transport Required --</option>
                    {transports.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Holy Sites Visit (Ziyarat)</label>
                  <div className="checkbox-group" onClick={() => {
                    setIncludeZiyarat(!includeZiyarat);
                    setShowBankDetails(false);
                  }}>
                    <input 
                      type="checkbox" 
                      checked={includeZiyarat}
                      readOnly 
                    />
                    <label>Include Makkah & Madinah Ziyarat</label>
                  </div>
                </div>

              </div>
            </div>

          </div>

          <div className="right-column">
            <div className="sticky-summary">
              <h3 className="summary-title">Final Summary</h3>
              
              <div className="grand-total">
                <span>Grand Total</span>
                <span>{currencySymbols[currency]} {grandTotal.toLocaleString()}</span>
              </div>
              
              <p className="summary-disclaimer">
                *This price includes E-Visa processing, service charges, and all selected options. Rates change dynamically based on your selections.
              </p>

              {!showBankDetails && (
                <button className="book-btn" onClick={() => setShowBankDetails(true)}>
                  Proceed to Checkout
                </button>
              )}

              {showBankDetails && (
                <div className="bank-details-section">
                  <h3 className="bank-title">Transfer Details</h3>
                  <div className="bank-cards">
                    {bankDetails.map((bank, index) => (
                      <div key={index} className="bank-card">
                        <h4>{bank.bankName}</h4>
                        <p><strong>Title:</strong> {bank.title}</p>
                        <p><strong>A/C:</strong> {bank.accountNo}</p>
                        <p><strong>IBAN:</strong> {bank.iban}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Customize;