import React, { useEffect, useMemo, useState } from 'react';
import './Customize.css';

const CURRENCY_SYMBOLS = { USD: '$', PKR: 'Rs', SAR: 'SR' };

function Customize({ currency, exchangeRates }) {
  const packageTypes = ["Star", "Economy", "Group", "Standard"];

  const [form, setForm] = useState({
    packageType: '', makkahNights: 0, madinaNights: 0, totalNights: 0,
    clientName: '', phone: '', departureCity: '', passportStatus: 'Ready',
    adults: 1, children: 0, infants: 0
  });

  const [modalConfig, setModalConfig] = useState({ isOpen: false, message: '', type: 'error' });

  // --- Budget filter (moved into the form, replacing Flight/Notes) ---
  // Fixed Rs 250,000 – Rs 700,000 budget range, quoted in PKR (pegged to the
  // same 278 rate used site-wide) and converted for whichever currency is selected.
  const BUDGET_MIN_PKR = 250000;
  const BUDGET_MAX_PKR = 700000;
  const PKR_PEG_RATE = 278;
  const [priceRange, setPriceRange] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const rate = exchangeRates?.[currency] || 1;
  const symbol = CURRENCY_SYMBOLS[currency] || '$';

  const bounds = useMemo(() => ({
    min: Math.round((BUDGET_MIN_PKR / PKR_PEG_RATE) * rate),
    max: Math.round((BUDGET_MAX_PKR / PKR_PEG_RATE) * rate),
  }), [rate]);

  useEffect(() => {
    setPriceRange([bounds.min, bounds.max]);
  }, [bounds.min, bounds.max]);

  const showAlert = (message, type = 'error') => {
    setModalConfig({ isOpen: true, message, type });
  };
  const closeModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleMinSlider = (e) => {
    const val = Math.min(Number(e.target.value), priceRange[1] - 1);
    setPriceRange([val, priceRange[1]]);
  };
  const handleMaxSlider = (e) => {
    const val = Math.max(Number(e.target.value), priceRange[0] + 1);
    setPriceRange([priceRange[0], val]);
  };

  const sendToWhatsApp = () => {
    if (!form.clientName || form.adults < 1) {
      showAlert("Please enter Client Name and at least 1 Adult to proceed!", "error");
      return;
    }

    const message = `*🌟 MOSAFIROON UMRAH INQUIRY 🌟*

*👤 Client Details*
Name: ${form.clientName}
Contact: ${form.phone || "N/A"}
Departure City: ${form.departureCity || "N/A"}
Total Pax: ${form.adults} Adults, ${form.children} Children, ${form.infants} Infants
Passport Status: ${form.passportStatus}
Total Nights: ${form.totalNights || 0}

*🏨 Hotel Details*
Package Type: ${form.packageType || "Not Selected"}
Makkah Nights: ${form.makkahNights || 0}
Madinah Nights: ${form.madinaNights || 0}

*💰 Budget Range*
${priceRange ? `${symbol} ${priceRange[0].toLocaleString()} - ${symbol} ${priceRange[1].toLocaleString()}` : "N/A"}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/923112462949?text=${encodedMessage}`, '_blank');
  };

  const minPercent = priceRange ? ((priceRange[0] - bounds.min) / (bounds.max - bounds.min || 1)) * 100 : 0;
  const maxPercent = priceRange ? ((priceRange[1] - bounds.min) / (bounds.max - bounds.min || 1)) * 100 : 100;

  return (
    <div className="customize-ambient min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans relative">
      <div className="customize-ambient-pattern"></div>

      {modalConfig.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[10000] p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
            <div className="p-6 text-center bg-[#c20000] border-b-4 border-[#f0ca00]">
               <i className={`fa-solid ${modalConfig.type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'} text-[#f0ca00] text-5xl mb-3`}></i>
               <h3 className="text-xl font-black text-white uppercase tracking-widest">
                 {modalConfig.type === 'error' ? 'Attention!' : 'Success!'}
               </h3>
            </div>
            <div className="p-8 text-center space-y-6 bg-gray-50">
              <p className="text-gray-700 font-medium text-sm leading-relaxed">{modalConfig.message}</p>
              <button
                onClick={closeModal}
                className="w-full gold-shine-bg text-black font-black py-4 rounded-xl hover:bg-[#c20000] hover:text-white hover:shadow-lg transition-all duration-300 tracking-wider"
              >
                GOT IT
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="trust-strip animate-fade-in">
          <span><i className="fa-solid fa-shield-halved"></i> IATA Certified</span>
          <span><i className="fa-solid fa-users"></i> 10,000+ Pilgrims Served</span>
          <span><i className="fa-solid fa-headset"></i> 24/7 Support</span>
          <span><i className="fa-solid fa-star"></i> Trusted Since Day One</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto flex justify-center relative z-10">

        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-fade-in customize-form-box">

          <div className="bg-gradient-to-r from-[#4a0000] via-[#810000] to-[#c20000] py-8 px-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#f0ca00]"></div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">UMRAH INQUIRY FORM</h1>
            <p className="text-gray-300 mt-2 text-sm font-medium">Select your preferences and send us your inquiry instantly.</p>
            <p className="text-[#f0ca00] mt-1.5 text-2xl md:text-3xl font-black tracking-wide">Bin Aziz Group</p>
          </div>

          <div className="p-8 md:p-10 space-y-8">

            {/* Passenger Details — moved to the top */}
            <div className="space-y-4 form-section-reveal" style={{ animationDelay: '0ms' }}>
              <h3 className="text-lg font-bold text-[#810000] border-l-4 border-[#f0ca00] pl-3 uppercase tracking-wider flex items-center gap-2.5"><i className="fa-solid fa-users text-[#f0ca00] text-base"></i>Passenger Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1"><i className="fa-solid fa-user text-[#f0ca00]"></i>Family Head Name</label>
                      <input type="text" name="clientName" placeholder="Head Name" value={form.clientName} onChange={handleChange} className="w-full border border-gray-200 bg-gray-50/60 rounded-xl p-3 text-sm shadow-sm hover:border-[#f0ca00]/60 focus:bg-white focus:ring-2 focus:ring-[#f0ca00] outline-none transition-all" />
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1"><i className="fa-solid fa-phone text-[#f0ca00]"></i>Contact No</label>
                      <input type="text" name="phone" placeholder="03xx-xxxxxxx" value={form.phone} onChange={handleChange} className="w-full border border-gray-200 bg-gray-50/60 rounded-xl p-3 text-sm shadow-sm hover:border-[#f0ca00]/60 focus:bg-white focus:ring-2 focus:ring-[#f0ca00] outline-none transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1"><i className="fa-solid fa-plane-departure text-[#f0ca00]"></i>Departure City</label>
                        <input type="text" name="departureCity" placeholder="e.g. Lahore" value={form.departureCity} onChange={handleChange} className="w-full border border-gray-200 bg-gray-50/60 rounded-xl p-3 text-sm shadow-sm hover:border-[#f0ca00]/60 focus:bg-white focus:ring-2 focus:ring-[#f0ca00] outline-none transition-all" />
                      </div>
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1"><i className="fa-solid fa-moon text-[#f0ca00]"></i>Total Nights</label>
                        <input type="number" name="totalNights" min="0" value={form.totalNights} onChange={handleChange} className="w-full border border-gray-200 bg-gray-50/60 rounded-xl p-3 text-sm shadow-sm hover:border-[#f0ca00]/60 focus:bg-white focus:ring-2 focus:ring-[#f0ca00] outline-none transition-all" />
                      </div>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1"><i className="fa-solid fa-user text-[#f0ca00]"></i>Adults</label>
                        <input type="number" name="adults" min="1" value={form.adults} onChange={handleChange} className="w-full border border-gray-200 bg-gray-50/60 rounded-xl p-3 text-sm shadow-sm hover:border-[#f0ca00]/60 focus:bg-white focus:ring-2 focus:ring-[#f0ca00] outline-none transition-all" />
                      </div>
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1"><i className="fa-solid fa-child text-[#f0ca00]"></i>Children</label>
                        <input type="number" name="children" min="0" value={form.children} onChange={handleChange} className="w-full border border-gray-200 bg-gray-50/60 rounded-xl p-3 text-sm shadow-sm hover:border-[#f0ca00]/60 focus:bg-white focus:ring-2 focus:ring-[#f0ca00] outline-none transition-all" />
                      </div>
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1"><i className="fa-solid fa-baby text-[#f0ca00]"></i>Infants</label>
                        <input type="number" name="infants" min="0" value={form.infants} onChange={handleChange} className="w-full border border-gray-200 bg-gray-50/60 rounded-xl p-3 text-sm shadow-sm hover:border-[#f0ca00]/60 focus:bg-white focus:ring-2 focus:ring-[#f0ca00] outline-none transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1"><i className="fa-solid fa-passport text-[#f0ca00]"></i>Passport Status</label>
                      <select name="passportStatus" value={form.passportStatus} onChange={handleChange} className="w-full border border-gray-200 bg-gray-50/60 rounded-xl p-3 text-sm shadow-sm hover:border-[#f0ca00]/60 focus:bg-white focus:ring-2 focus:ring-[#f0ca00] outline-none transition-all">
                        <option value="Ready">Ready</option>
                        <option value="Not Ready">Not Ready</option>
                      </select>
                    </div>
                 </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div className="space-y-4 form-section-reveal" style={{ animationDelay: '80ms' }}>
              <h3 className="text-lg font-bold text-[#810000] border-l-4 border-[#f0ca00] pl-3 uppercase tracking-wider flex items-center gap-2.5"><i className="fa-solid fa-hotel text-[#f0ca00] text-base"></i>Hotel Details</h3>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1"><i className="fa-solid fa-ranking-star text-[#f0ca00]"></i>Package Type</label>
                <select name="packageType" value={form.packageType} onChange={handleChange} className="w-full border border-gray-200 bg-gray-50/60 rounded-xl p-3 text-sm shadow-sm hover:border-[#f0ca00]/60 focus:bg-white focus:ring-2 focus:ring-[#f0ca00] focus:border-[#f0ca00] outline-none transition-all">
                  <option value="">Select Package Type</option>
                  {packageTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1"><i className="fa-solid fa-kaaba text-[#f0ca00]"></i>Makkah Nights</label>
                  <input type="number" name="makkahNights" min="0" value={form.makkahNights} onChange={handleChange} className="w-full border border-gray-200 bg-gray-50/60 rounded-xl p-3 text-sm shadow-sm hover:border-[#f0ca00]/60 focus:bg-white focus:ring-2 focus:ring-[#f0ca00] outline-none transition-all" />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1"><i className="fa-solid fa-mosque text-[#f0ca00]"></i>Madinah Nights</label>
                  <input type="number" name="madinaNights" min="0" value={form.madinaNights} onChange={handleChange} className="w-full border border-gray-200 bg-gray-50/60 rounded-xl p-3 text-sm shadow-sm hover:border-[#f0ca00]/60 focus:bg-white focus:ring-2 focus:ring-[#f0ca00] outline-none transition-all" />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div className="space-y-4 form-section-reveal" style={{ animationDelay: '160ms' }}>
              <h3 className="text-lg font-bold text-[#810000] border-l-4 border-[#f0ca00] pl-3 uppercase tracking-wider flex items-center gap-2.5"><i className="fa-solid fa-sliders text-[#f0ca00] text-base"></i>Filter by Budget</h3>

              {priceRange && (
                <div className="price-slider-wrap">
                  <span className="price-slider-bubble" style={{ left: `${minPercent}%` }}>{symbol} {priceRange[0].toLocaleString()}</span>
                  <span className="price-slider-bubble" style={{ left: `${maxPercent}%` }}>{symbol} {priceRange[1].toLocaleString()}</span>
                  <div className="price-slider-track"></div>
                  <div
                    className="price-slider-range"
                    style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
                  ></div>
                  <input type="range" min={bounds.min} max={bounds.max} value={priceRange[0]} onChange={handleMinSlider} className="price-slider-input" />
                  <input type="range" min={bounds.min} max={bounds.max} value={priceRange[1]} onChange={handleMaxSlider} className="price-slider-input" />
                </div>
              )}
            </div>

          </div>

          <div className="whatsapp-cta-band relative overflow-hidden p-6 md:p-8 flex justify-center items-center">
            <div className="luxury-pattern-overlay"></div>
            <button
              onClick={sendToWhatsApp}
              className="whatsapp-cta-glow relative z-10 w-full md:w-2/3 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold py-3 md:py-4 px-4 md:px-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 text-base md:text-xl tracking-wider"
            >
              <i className="fa-brands fa-whatsapp text-xl md:text-2xl"></i>
              SEND INQUIRY VIA WHATSAPP
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Customize;
