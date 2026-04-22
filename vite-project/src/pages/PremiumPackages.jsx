import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './PremiumPackages.css';

function PremiumPackages({ currency }) {
  const [premiumData, setPremiumData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetch('http://localhost:5000/api/premium')
      .then(response => response.json())
      .then(data => {
        setPremiumData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setIsLoading(false);
      });
  }, []);

  const exchangeRates = { USD: 1, PKR: 278, SAR: 3.75 };
  const currencySymbols = { USD: "$", PKR: "Rs", SAR: "SR" };

  return (
    <main className="premium-wrapper">
      <div className="premium-container">
        
        <div className="premium-header-box animate-fade-in-premium">
          <h1 className="premium-title">Star Packages</h1>
          <p className="premium-subtitle">Experience ultimate luxury and comfort with our top-tier accommodations right next to the Haramain.</p>
        </div>

        {isLoading ? (
          <div className="premium-loader-box">
            <i className="fa-solid fa-spinner premium-loader-icon"></i>
            <p className="premium-loader-text">Loading Star Packages...</p>
          </div>
        ) : (
          <div className="premium-grid animate-fade-in-premium">
            {premiumData.map((pkg) => {
              // FIX: Price check
              const convertedPrice = (pkg.price || 0) * exchangeRates[currency];
              return (
                // FIX: id changed to _id
                <div key={pkg._id} className="premium-card">
                  <div className="card-top-bar">{pkg.title}</div>
                  
                  <div className="card-content">
                    <div className="card-route">
                      {/* FIX: Arrays check */}
                      {pkg.route && pkg.route.map((city, cIndex) => (
                        <span key={cIndex} style={{display: 'flex', alignItems: 'center'}}>
                          {city} {cIndex < pkg.route.length - 1 && <i className="fa-solid fa-arrow-right route-arrow-icon"></i>}
                        </span>
                      ))}
                    </div>
                    
                    <h3 className="inclusions-heading">Inclusions:</h3>
                    
                    <div className="inclusions-row">
                      {pkg.inclusions && pkg.inclusions.includes("Visa") && (
                        <div className="inclusion-box">
                          <i className="fa-solid fa-passport inclusion-ico"></i>
                          <span className="inclusion-lbl">Visa</span>
                        </div>
                      )}
                      {pkg.inclusions && pkg.inclusions.includes("Hotel") && (
                        <div className="inclusion-box">
                          <i className="fa-solid fa-hotel inclusion-ico"></i>
                          <span className="inclusion-lbl">Hotel</span>
                        </div>
                      )}
                      {pkg.inclusions && pkg.inclusions.includes("Transport") && (
                        <div className="inclusion-box">
                          <i className="fa-solid fa-bus inclusion-ico"></i>
                          <span className="inclusion-lbl">Transport</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="distance-info-box">
                      <div className="dist-row">
                        <span className="dist-label">Makkah Distance:</span>
                        {/* FIX: Object fields check */}
                        <span className="dist-val">{pkg.distances?.makkah || 'N/A'}</span>
                      </div>
                      <div className="dist-row">
                        <span className="dist-label">Madinah Distance:</span>
                        <span className="dist-val">{pkg.distances?.madinah || 'N/A'}</span>
                      </div>
                    </div>
                    
                    <hr className="premium-divider" />
                    
                    <div className="card-bottom-flex">
                      <div>
                        <p className="price-text-sm">Starting from</p>
                        <p className="price-text-lg">{currencySymbols[currency] || '$'} {Math.round(convertedPrice).toLocaleString()}</p>
                      </div>
                      {/* FIX: id changed to _id */}
                      <Link to={`/?pkg=${pkg._id}`} className="premium-book-btn">Book Now</Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default PremiumPackages;