import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import './EconomyPackages.css';

function EconomyPackages({ currency, exchangeRates }) {
  const [economyData, setEconomyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    window.scrollTo(0, 0);

    fetch('https://musafiroon-web.onrender.com/api/economy')
      .then(response => response.json())
      .then(data => {
        setEconomyData(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setEconomyData([]);
        setIsLoading(false);
      });
  }, []);

  const currencySymbols = { USD: "$", PKR: "Rs", SAR: "SR" };

  return (
    <main className="eco-wrapper">
      <div className="eco-container">

        <div className="eco-header-box animate-fade-in">
          <h1 className="eco-title">Economy Packages</h1>
          <p className="eco-subtitle">Affordable and comfortable spiritual journeys without compromising on essential services.</p>
        </div>

        {isLoading ? (
          <div className="eco-loader-box">
            <i className="fa-solid fa-spinner eco-loader-icon"></i>
            <p className="eco-loader-text">Loading Economy Packages...</p>
          </div>
        ) : (
          <div className="eco-grid animate-fade-in">
            {economyData.map((pkg) => {
              const rate = exchangeRates && exchangeRates[currency] ? exchangeRates[currency] : 1;
              const convertedPrice = (pkg.price || 0) * rate;

              const favKey = pkg._id || pkg.id;
              return (
                <div key={pkg._id || pkg.id} className="eco-card">
                  <div className="eco-image-wrap">
                    {pkg.image ? (
                      <img src={pkg.image} alt={pkg.title} className="eco-image" />
                    ) : (
                      <div className="eco-image-placeholder">
                        <i className="fa-solid fa-mosque"></i>
                      </div>
                    )}
                    <button
                      type="button"
                      aria-label="Save"
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(favKey); }}
                      className={`eco-fav-btn ${isFavorite(favKey) ? 'is-active' : ''}`}
                    >
                      <i className={isFavorite(favKey) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                    </button>
                    <span className="eco-month-badge">{pkg.month || 'All Months*'}</span>
                  </div>
                  <div className="eco-card-content">
                    <div className="eco-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i key={star} className={`fa-solid fa-star ${star <= (pkg.rating || 5) ? 'eco-star-filled' : 'eco-star-empty'}`}></i>
                      ))}
                    </div>
                    <h3 className="eco-card-title">{pkg.title}</h3>

                    <div className="eco-route-info">
                      {pkg.route && pkg.route.map((city, cIndex) => (
                        <span key={cIndex} className="eco-route-city">
                          {city} {cIndex < pkg.route.length - 1 && <i className="fa-solid fa-arrow-right eco-route-arrow"></i>}
                        </span>
                      ))}
                    </div>

                    {pkg.roomType && (
                      <div className="eco-roomtype-row">
                        <span className="eco-roomtype-pill">
                          <i className="fa-solid fa-bed"></i> {pkg.roomType}
                        </span>
                      </div>
                    )}

                    <div className="eco-distance-box">
                      <div className="eco-dist-row">
                        <span className="eco-dist-label">Makkah Distance:</span>
                        <span className="eco-dist-val">{pkg.distances?.makkah || 'N/A'}</span>
                      </div>
                      <div className="eco-dist-row">
                        <span className="eco-dist-label">Madinah Distance:</span>
                        <span className="eco-dist-val">{pkg.distances?.madinah || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="eco-card-footer">
                      <div>
                        <p className="eco-price-label">Starting from</p>
                        <p className="eco-price-val">{currencySymbols[currency] || '$'} {Math.round(convertedPrice).toLocaleString()}</p>
                      </div>
                      <Link to={`/?pkg=${pkg._id || pkg.id}`} className="eco-btn-view">View Details</Link>
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

export default EconomyPackages;