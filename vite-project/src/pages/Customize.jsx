import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './Customize.css';

const CURRENCY_SYMBOLS = { USD: '$', PKR: 'Rs', SAR: 'SR' };

function Customize({ currency, exchangeRates }) {
  const makkahHotels = [
    "ARAFAT GOLDEN (old Fakhir Kudai)", "FAKHIR AL AZIZIA", "QILA AJYAD",
    "AL KISWAH TOWERS", "TAJ FIDDI HOTEL", "MIAAD AL MAJD", "MELLA 1",
    "MELLA 2", "SAIF AL MAJD", "AREEJ AL ZAHBI", "SHAMS AL ZAHBI",
    "DHAIF HOTEL (Beside Shohada Hotel Ajyad)", "BADAR AL MASSA",
    "NAWARA SHAMS 3", "VOCO HOTEL", "THAT HOTEL", "DIWAN AL BAIT"
  ];

  const madinaHotels = [
    "REHAB AL MADAIN", "HALA TAIBAH", "MANAZIL MARJAN",
    "DIYAR AL SAFA (old Safa Center)", "WAHAT AL SHARK", "NUZUL AL FALAH",
    "HAMOUDA AL MASI", "BURJ MUKHTARA", "BIR AL EIMAN / WARDA SAFA",
    "TAIF NEBRAS", "MARJAN GOLDEN", "RAMA AL MADINAH"
  ];

  const airlinesList = [
    "SAUDI AIRLINE", "FLYNAS", "AIR BLUE", "AIR SIAL", "PIA",
    "FLY ADEAL", "FLY JINNAH", "AIR ARABIA", "EMIRATES", "EITHAD", "QATAR", "BRITISH AIRWAYS", "CUSTOM"
  ];

  const [form, setForm] = useState({
    makkahHotel: '', makkahRoom: 'Quad', makkahNights: 0,
    madinaHotel: '', madinaRoom: 'Quad', madinaNights: 0,
    airline: '-', customAirline: '', ticketType1: 'Direct', ticketType2: 'System Ticket',
    clientName: '', phone: '', passportStatus: 'Ready',
    adults: 1, children: 0, infants: 0, notes: ''
  });

  const [modalConfig, setModalConfig] = useState({ isOpen: false, message: '', type: 'error' });

  // --- Package price filter (left sidebar) ---
  const [packageData, setPackageData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [priceRange, setPriceRange] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch('https://musafiroon-web.onrender.com/api/packages')
      .then((res) => res.json())
      .then((data) => {
        setPackageData(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const rate = exchangeRates?.[currency] || 1;
  const symbol = CURRENCY_SYMBOLS[currency] || '$';

  const bounds = useMemo(() => {
    if (packageData.length === 0) return { min: 0, max: 1000 };
    const prices = packageData.map((p) => Math.round((p.price || 0) * rate));
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [packageData, rate]);

  useEffect(() => {
    setPriceRange([bounds.min, bounds.max]);
  }, [bounds.min, bounds.max]);

  const filteredPackages = useMemo(() => {
    if (!priceRange) return [];
    return packageData
      .filter((p) => {
        const price = Math.round((p.price || 0) * rate);
        return price >= priceRange[0] && price <= priceRange[1];
      })
      .sort((a, b) => (a.price || 0) - (b.price || 0));
  }, [packageData, priceRange, rate]);

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

    const finalAirline = form.airline === 'CUSTOM' ? form.customAirline : form.airline;

    const message = `*🌟 MOSAFIROON UMRAH INQUIRY 🌟*

*👤 Client Details*
Name: ${form.clientName}
Contact: ${form.phone || "N/A"}
Total Pax: ${form.adults} Adults, ${form.children} Children, ${form.infants} Infants
Passport Status: ${form.passportStatus}

*🕋 Makkah Stay*
Hotel: ${form.makkahHotel || "Not Selected"}
Room: ${form.makkahRoom}
Nights: ${form.makkahNights || 0}

*🕌 Madinah Stay*
Hotel: ${form.madinaHotel || "Not Selected"}
Room: ${form.madinaRoom}
Nights: ${form.madinaNights || 0}

*✈️ Flight Details*
Airline: ${finalAirline} (${form.ticketType1} | ${form.ticketType2})

*📝 Notes:* ${form.notes || "None"}`;

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

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start relative z-10">

        {/* --- LEFT: Price filter + compact package list --- */}
        <aside className="finder-sidebar animate-fade-in">
          <h3 className="finder-sidebar-title">
            <i className="fa-solid fa-sliders"></i> Filter by Budget
          </h3>

          {priceRange && (
            <>
              <div className="price-range-values">
                <span>{symbol} {priceRange[0].toLocaleString()}</span>
                <span>{symbol} {priceRange[1].toLocaleString()}</span>
              </div>

              <div className="price-slider-wrap">
                <div className="price-slider-track"></div>
                <div
                  className="price-slider-range"
                  style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
                ></div>
                <input type="range" min={bounds.min} max={bounds.max} value={priceRange[0]} onChange={handleMinSlider} className="price-slider-input" />
                <input type="range" min={bounds.min} max={bounds.max} value={priceRange[1]} onChange={handleMaxSlider} className="price-slider-input" />
              </div>
            </>
          )}

          <div className="finder-match-count">
            <i className="fa-solid fa-circle-check"></i>
            {isLoading ? 'Loading…' : `${filteredPackages.length} package${filteredPackages.length === 1 ? '' : 's'} match`}
          </div>

          <div className="package-list">
            {isLoading ? (
              <div className="package-list-empty"><i className="fa-solid fa-spinner fa-spin"></i></div>
            ) : filteredPackages.length === 0 ? (
              <div className="package-list-empty">No packages in this range.</div>
            ) : (
              filteredPackages.map((pkg) => (
                <Link key={pkg._id} to={`/?pkg=${pkg._id}`} className="package-list-item">
                  <span className="package-list-item-title">{pkg.title}</span>
                  <span className="package-list-item-price">{symbol} {Math.round((pkg.price || 0) * rate).toLocaleString()}</span>
                </Link>
              ))
            )}
          </div>

          <button type="button" className="finder-reset-btn" onClick={() => setPriceRange([bounds.min, bounds.max])}>
            Reset Range
          </button>
        </aside>

        {/* --- RIGHT: Original inquiry form box, premium polish --- */}
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-fade-in customize-form-box">

          <div className="bg-gradient-to-r from-[#4a0000] via-[#810000] to-[#c20000] py-8 px-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#f0ca00]"></div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">UMRAH INQUIRY FORM</h1>
            <p className="text-gray-300 mt-2 text-sm font-medium">Select your preferences and send us your inquiry instantly.</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 form-section-reveal" style={{ animationDelay: '80ms' }}>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#810000] border-l-4 border-[#f0ca00] pl-3 uppercase tracking-wider flex items-center gap-2.5"><i className="fa-solid fa-kaaba text-[#f0ca00] text-base"></i>Makkah Stay</h3>
                <div className="space-y-3">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1"><i className="fa-solid fa-hotel text-[#f0ca00]"></i>Hotel Name</label>
                    <select name="makkahHotel" value={form.makkahHotel} onChange={handleChange} className="w-full border border-gray-200 bg-gray-50/60 rounded-xl p-3 text-sm shadow-sm hover:border-[#f0ca00]/60 focus:bg-white focus:ring-2 focus:ring-[#f0ca00] focus:border-[#f0ca00] outline-none transition-all">
                      <option value="">Select Hotel</option>
                      {makkahHotels.map((hotel, idx) => <option key={idx} value={hotel}>{hotel}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1"><i className="fa-solid fa-bed text-[#f0ca00]"></i>Room Type</label>
                      <select name="makkahRoom" value={form.makkahRoom} onChange={handleChange} className="w-full border border-gray-200 bg-gray-50/60 rounded-xl p-3 text-sm shadow-sm hover:border-[#f0ca00]/60 focus:bg-white focus:ring-2 focus:ring-[#f0ca00] outline-none transition-all">
                        <option value="Sharing">Sharing</option><option value="Quint">Quint</option><option value="Quad">Quad</option><option value="Triple">Triple</option><option value="Double">Double</option>
                      </select>
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1"><i className="fa-solid fa-moon text-[#f0ca00]"></i>Nights</label>
                      <input type="number" name="makkahNights" min="0" value={form.makkahNights} onChange={handleChange} className="w-full border border-gray-200 bg-gray-50/60 rounded-xl p-3 text-sm shadow-sm hover:border-[#f0ca00]/60 focus:bg-white focus:ring-2 focus:ring-[#f0ca00] outline-none transition-all" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#810000] border-l-4 border-[#f0ca00] pl-3 uppercase tracking-wider flex items-center gap-2.5"><i className="fa-solid fa-mosque text-[#f0ca00] text-base"></i>Madinah Stay</h3>
                <div className="space-y-3">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1"><i className="fa-solid fa-hotel text-[#f0ca00]"></i>Hotel Name</label>
                    <select name="madinaHotel" value={form.madinaHotel} onChange={handleChange} className="w-full border border-gray-200 bg-gray-50/60 rounded-xl p-3 text-sm shadow-sm hover:border-[#f0ca00]/60 focus:bg-white focus:ring-2 focus:ring-[#f0ca00] outline-none transition-all">
                      <option value="">Select Hotel</option>
                      {madinaHotels.map((hotel, idx) => <option key={idx} value={hotel}>{hotel}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1"><i className="fa-solid fa-bed text-[#f0ca00]"></i>Room Type</label>
                      <select name="madinaRoom" value={form.madinaRoom} onChange={handleChange} className="w-full border border-gray-200 bg-gray-50/60 rounded-xl p-3 text-sm shadow-sm hover:border-[#f0ca00]/60 focus:bg-white focus:ring-2 focus:ring-[#f0ca00] outline-none transition-all">
                        <option value="Sharing">Sharing</option><option value="Quint">Quint</option><option value="Quad">Quad</option><option value="Triple">Triple</option><option value="Double">Double</option>
                      </select>
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1"><i className="fa-solid fa-moon text-[#f0ca00]"></i>Nights</label>
                      <input type="number" name="madinaNights" min="0" value={form.madinaNights} onChange={handleChange} className="w-full border border-gray-200 bg-gray-50/60 rounded-xl p-3 text-sm shadow-sm hover:border-[#f0ca00]/60 focus:bg-white focus:ring-2 focus:ring-[#f0ca00] outline-none transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div className="space-y-4 form-section-reveal" style={{ animationDelay: '160ms' }}>
              <h3 className="text-lg font-bold text-[#810000] border-l-4 border-[#f0ca00] pl-3 uppercase tracking-wider flex items-center gap-2.5"><i className="fa-solid fa-plane text-[#f0ca00] text-base"></i>Flight Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1"><i className="fa-solid fa-plane-departure text-[#f0ca00]"></i>Choose Airline</label>
                  <select name="airline" value={form.airline} onChange={handleChange} className="w-full border border-gray-200 bg-gray-50/60 rounded-xl p-3 text-sm shadow-sm hover:border-[#f0ca00]/60 focus:bg-white focus:ring-2 focus:ring-[#f0ca00] outline-none transition-all">
                    <option value="-">NONE</option>
                    {airlinesList.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  {form.airline === 'CUSTOM' && (
                    <input type="text" name="customAirline" placeholder="Enter Custom Airline Name" value={form.customAirline} onChange={handleChange} className="w-full border border-gray-200 bg-gray-50/60 rounded-xl p-3 text-sm shadow-sm hover:border-[#f0ca00]/60 focus:bg-white mt-2 focus:ring-2 focus:ring-[#f0ca00] outline-none transition-all" />
                  )}
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1"><i className="fa-solid fa-ticket text-[#f0ca00]"></i>Ticket Type 1</label>
                  <select name="ticketType1" value={form.ticketType1} onChange={handleChange} className="w-full border border-gray-200 bg-gray-50/60 rounded-xl p-3 text-sm shadow-sm hover:border-[#f0ca00]/60 focus:bg-white focus:ring-2 focus:ring-[#f0ca00] outline-none transition-all">
                    <option value="Direct">Direct</option><option value="Indirect">Indirect</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1"><i className="fa-solid fa-ticket text-[#f0ca00]"></i>Ticket Type 2</label>
                  <select name="ticketType2" value={form.ticketType2} onChange={handleChange} className="w-full border border-gray-200 bg-gray-50/60 rounded-xl p-3 text-sm shadow-sm hover:border-[#f0ca00]/60 focus:bg-white focus:ring-2 focus:ring-[#f0ca00] outline-none transition-all">
                    <option value="System Ticket">System Ticket</option><option value="Group Ticket">Group Ticket</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2 form-section-reveal" style={{ animationDelay: '220ms' }}>
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1"><i className="fa-solid fa-pen-to-square text-[#f0ca00]"></i>Additional Notes</label>
              <textarea name="notes" rows="2" placeholder="Any specific requirements..." value={form.notes} onChange={handleChange} className="w-full border border-gray-200 bg-gray-50/60 rounded-xl p-3 text-sm shadow-sm hover:border-[#f0ca00]/60 focus:bg-white focus:ring-2 focus:ring-[#f0ca00] outline-none transition-all"></textarea>
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
