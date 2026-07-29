import React from 'react';
import { AirportIcon, CarIcon, HotelIcon, LandmarkIcon } from '../components/RouteIcons';

const INCLUSION_ICONS = {
  Visa: 'fa-passport',
  Hotel: 'fa-hotel',
  Transport: 'fa-bus',
};

function PackageDetails({
  selectedPackage,
  pilgrims,
  setPilgrims,
  currency,
  exchangeRates,
  currencySymbols,
  setSearchParams,
  handleWhatsAppBooking
}) {
  const packagePrice = selectedPackage?.price || 0;
  const perPilgrimPrice = packagePrice * exchangeRates[currency];
  const totalPrice = pilgrims * perPilgrimPrice;
  const route = selectedPackage?.route || [];

  return (
    <div className="pkg-details-luxury-bg relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in">
      <div className="luxury-pattern-overlay"></div>
      <div className="luxury-glow-overlay"></div>
      {/* Back Button */}
      <div className="relative z-10 px-6 md:px-8 pt-6">
        <button
          onClick={() => setSearchParams({})}
          className="flex items-center text-gray-500 hover:text-[#810000] font-medium mb-4"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i> Back to Packages
        </button>
      </div>

      {/* Header: Title + Price Box */}
      <div className="relative z-10 flex flex-col md:flex-row">
        <div className="flex-1 px-6 md:px-8 pb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{selectedPackage?.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full">
              <i className="fa-solid fa-calendar text-[#f0ca00]"></i> {selectedPackage?.month || 'All Months*'}
            </span>
            {selectedPackage?.roomType && (
              <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                <i className="fa-solid fa-bed text-[#f0ca00]"></i> {selectedPackage.roomType}
              </span>
            )}
          </div>
          {route.length > 0 && (
            <>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Routes:</p>
              <p className="text-sm font-semibold text-gray-700 mb-5">{route.join(' - ')}</p>
            </>
          )}

          {/* Inclusion / Pilgrims / Distance row */}
          <div className="pkg-detail-strip grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#f0ca00]/20 border-t border-[#f0ca00]/25 pt-5">
            <div className="pb-5 sm:pr-6">
              <p className="pkg-detail-label">Inclusion</p>
              <div className="flex gap-6">
                {selectedPackage?.inclusions?.map((inc) => (
                  <div key={inc} className="flex flex-col items-center gap-2 text-[#4a0000]">
                    <span className="pkg-detail-icon">
                      <i className={`fa-solid ${INCLUSION_ICONS[inc] || 'fa-circle-check'}`}></i>
                    </span>
                    <span className="text-xs font-bold">{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="py-5 sm:py-0 sm:px-6">
              <p className="pkg-detail-label">Pilgrims</p>
              <div className="flex items-center gap-2.5 text-[#4a0000]">
                <span className="pkg-detail-icon">
                  <i className="fa-solid fa-user"></i>
                </span>
                <span className="font-bold">{pilgrims}</span>
              </div>
            </div>

            <div className="pt-5 sm:pt-0 sm:pl-6">
              <p className="pkg-detail-label">Distance</p>
              <div className="flex gap-6">
                <div className="flex items-center gap-2.5 text-[#4a0000]">
                  <span className="pkg-detail-icon">
                    <i className="fa-solid fa-kaaba"></i>
                  </span>
                  <span className="font-bold text-sm">{selectedPackage?.distances?.makkah || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#4a0000]">
                  <span className="pkg-detail-icon">
                    <i className="fa-solid fa-mosque"></i>
                  </span>
                  <span className="font-bold text-sm">{selectedPackage?.distances?.madinah || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pkg-price-box">
          <p className="pkg-price-currency">{currencySymbols[currency]}</p>
          <p className="pkg-price-amount">{Math.round(perPilgrimPrice).toLocaleString()}</p>
          <p className="pkg-price-per">per Pilgrim</p>

          <div className="pkg-pilgrims-row">
            <span>Pilgrims</span>
            <input
              type="number"
              min="1"
              value={pilgrims}
              onChange={(e) => setPilgrims && setPilgrims(Math.max(1, Number(e.target.value)))}
              className="pkg-pilgrims-input"
            />
            <span className="font-bold">{currencySymbols[currency]} {Math.round(totalPrice).toLocaleString()}</span>
          </div>

          <button
            onClick={() => handleWhatsAppBooking(selectedPackage?.title, totalPrice)}
            className="pkg-book-now-btn"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Route Strip Illustration */}
      {route.length > 0 && (
        <div className="relative z-10 pkg-route-strip">
          {route.map((city, i) => {
            const cityUpper = city.toUpperCase();
            const isMakkah = cityUpper.includes('MAKKAH');
            const isMadinah = cityUpper.includes('MADINAH');
            const isAirportCity = cityUpper.includes('JEDDAH') || isMadinah;
            const isEndpoint = (i === 0 || i === route.length - 1) && isAirportCity;
            const distance = isMakkah
              ? selectedPackage?.distances?.makkah
              : isMadinah
                ? selectedPackage?.distances?.madinah
                : null;
            const StopIcon = isEndpoint ? AirportIcon : (isMakkah || isMadinah) ? HotelIcon : LandmarkIcon;

            return (
              <React.Fragment key={`${city}-${i}`}>
                <div className="pkg-route-stop">
                  <span className="pkg-route-stop-label">{city}{isEndpoint ? ' Airport' : ''}</span>
                  <StopIcon className="pkg-route-stop-icon" />
                  {distance && <span className="pkg-route-stop-distance">{distance}</span>}
                </div>
                {i < route.length - 1 && (
                  <div className="pkg-route-connector">
                    <i className="fa-solid fa-chevron-right pkg-route-connector-arrow"></i>
                    <CarIcon className="pkg-route-connector-icon" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PackageDetails;
