import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TRANSPORT_ROUTES, VEHICLES, TRANSPORT_TERMS, convertFromSAR } from '../data/transportRates';
import './TransportPage.css';

const CURRENCY_SYMBOLS = { SAR: 'SR', PKR: 'Rs', USD: '$' };

function TransportPage({ exchangeRates }) {
  const [searchParams] = useSearchParams();
  const initialRoute = searchParams.get('route');
  const [selectedRouteIds, setSelectedRouteIds] = useState(initialRoute ? [initialRoute] : []);
  const [selectedVehicle, setSelectedVehicle] = useState(searchParams.get('vehicle') || '');
  const [sectionCurrency, setSectionCurrency] = useState('SAR');
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleRoute = (routeId) => {
    setSelectedRouteIds((prev) =>
      prev.includes(routeId) ? prev.filter((id) => id !== routeId) : [...prev, routeId]
    );
  };

  const selectedRoutes = TRANSPORT_ROUTES.filter((r) => selectedRouteIds.includes(r.id));
  const lineItems = selectedVehicle
    ? selectedRoutes.map((route) => {
        const priceSAR = route.rates[selectedVehicle];
        return {
          route,
          priceSAR,
          displayPrice: Math.round(convertFromSAR(priceSAR, sectionCurrency, exchangeRates)),
        };
      })
    : [];
  const totalDisplayPrice = lineItems.reduce((sum, item) => sum + item.displayPrice, 0);

  const handleBookViaWhatsApp = () => {
    const lines = lineItems
      .map((item) => `- ${item.route.label}: ${CURRENCY_SYMBOLS[sectionCurrency]} ${item.displayPrice.toLocaleString()}`)
      .join('\n');
    const message = `*🚐 MOSAFIROON TRANSPORT BOOKING*\n\n*Vehicle:* ${selectedVehicle}\n\n*Routes:*\n${lines}\n\n*Total:* ${CURRENCY_SYMBOLS[sectionCurrency]} ${totalDisplayPrice.toLocaleString()}\n\nPlease confirm availability for this transport.`;
    window.open(`https://wa.me/923112462949?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <main className="transport-page-wrapper">
      <div className="transport-page-container">
        <div className="transport-header-box animate-fade-in">
          <span className="transport-eyebrow">B2B Verified Rates</span>
          <h1 className="transport-title">Transport Rate Finder</h1>
          <p className="transport-subtitle">Select one or more routes and a vehicle to see the exact fare, instantly</p>
        </div>

        {/* Step 1: Route (multi-select) */}
        <div className="mb-8 animate-fade-in">
          <p className="text-[#f0ca00] text-xs font-bold uppercase tracking-widest mb-3">
            1. Select Route(s) {selectedRouteIds.length > 0 && `(${selectedRouteIds.length} selected)`}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TRANSPORT_ROUTES.map((route) => {
              const isActive = selectedRouteIds.includes(route.id);
              return (
                <button
                  key={route.id}
                  type="button"
                  onClick={() => toggleRoute(route.id)}
                  className={`transport-route-card ${isActive ? 'transport-route-card-active' : ''}`}
                >
                  <i className={`fa-solid ${isActive ? 'fa-circle-check' : route.icon}`}></i>
                  <span>{route.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Vehicle */}
        <div className="mb-10 animate-fade-in">
          <p className="text-[#f0ca00] text-xs font-bold uppercase tracking-widest mb-3">2. Select Vehicle</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {VEHICLES.map((v) => (
              <button
                key={v.key}
                type="button"
                onClick={() => setSelectedVehicle(v.key)}
                className={`transport-vehicle-card ${selectedVehicle === v.key ? 'transport-vehicle-card-active' : ''}`}
              >
                <i className={`fa-solid ${v.icon} text-2xl mb-2`}></i>
                <span className="font-bold">{v.label}</span>
                <span className="text-[11px] opacity-70">{v.capacity}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Result */}
        {lineItems.length > 0 ? (
          <div className="transport-result-card animate-fade-in">
            <div className="flex justify-center gap-1.5 mb-5">
              {Object.keys(CURRENCY_SYMBOLS).map((cur) => (
                <button
                  key={cur}
                  type="button"
                  onClick={() => setSectionCurrency(cur)}
                  className={`transport-currency-pill ${sectionCurrency === cur ? 'transport-currency-pill-active' : ''}`}
                >
                  {cur}
                </button>
              ))}
            </div>

            <div className="space-y-2 mb-5">
              {lineItems.map((item) => (
                <div key={item.route.id} className="flex items-center justify-between text-sm border-b border-white/10 pb-2">
                  <span className="text-gray-300">
                    <i className={`fa-solid ${item.route.icon} text-[#f0ca00] mr-2`}></i>
                    {item.route.label}
                  </span>
                  <span className="text-white font-bold">
                    {CURRENCY_SYMBOLS[sectionCurrency]} {item.displayPrice.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <p className="text-white font-bold text-lg">
                  <i className={`fa-solid ${VEHICLES.find((v) => v.key === selectedVehicle)?.icon} text-[#f0ca00] mr-2`}></i>
                  {selectedVehicle}
                </p>
              </div>

              <div className="text-center">
                <p className="text-4xl font-black text-[#f0ca00]">
                  {CURRENCY_SYMBOLS[sectionCurrency]} {totalDisplayPrice.toLocaleString()}
                </p>
                <p className="text-gray-400 text-xs mt-1">Total for {lineItems.length} route{lineItems.length > 1 ? 's' : ''}</p>
              </div>

              <button
                type="button"
                onClick={handleBookViaWhatsApp}
                className="bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold py-3.5 px-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <i className="fa-brands fa-whatsapp text-xl"></i> Book via WhatsApp
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 text-sm py-6 border border-dashed border-white/15 rounded-2xl animate-fade-in">
            Select at least one route and a vehicle above to see the fare.
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setShowTerms(!showTerms)}
            className="text-gray-300 text-xs font-semibold uppercase tracking-wider hover:text-[#f0ca00] transition inline-flex items-center gap-2"
          >
            Terms &amp; Conditions
            <i className={`fa-solid fa-chevron-down transition-transform duration-300 ${showTerms ? 'rotate-180' : ''}`}></i>
          </button>
          <div className={`faq-panel ${showTerms ? 'faq-panel-open' : ''}`}>
            <ul className="text-gray-400 text-xs leading-relaxed max-w-2xl mx-auto mt-4 space-y-1.5 text-left list-disc list-inside">
              {TRANSPORT_TERMS.map((term) => (
                <li key={term}>{term}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

export default TransportPage;
