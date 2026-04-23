import React, { useState, useEffect } from 'react';

function Customize() {
  // --- DATA ARRAYS ---
  const makkahHotels = [
    { id: 1, name: "Abraj Al Bait (Clock Tower)", rate: 5500 },
    { id: 2, name: "Pullman ZamZam", rate: 4000 },
    { id: 3, name: "Swissotel Makkah", rate: 3500 },
    { id: 4, name: "Anjum Hotel", rate: 2500 },
  ];

  const madinaHotels = [
    { id: 1, name: "Oberoi Madina", rate: 6000 },
    { id: 2, name: "Anwar Al Madinah Movenpick", rate: 3800 },
    { id: 3, name: "Shaza Al Madina", rate: 3200 },
    { id: 4, name: "Pullman Zamzam Madina", rate: 3000 },
  ];

  const airlinesList = [
    "SAUDI AIRLINE", "FLYNAS", "AIR BLUE", "AIR SIAL", "PIA", 
    "FLY ADEAL", "FLY JINNAH", "AIR ARABIA", "EMIRATES", "EITHAD", "QATAR", "BRITISH AIRWAYS", "CUSTOM"
  ];

  const roomMultipliers = { 'Sharing': 0.8, 'Quint': 0.9, 'Quad': 1.0, 'Triple': 1.2, 'Double': 1.5 };

  // --- STATE MANAGEMENT ---
  const [form, setForm] = useState({
    makkahHotel: '', makkahRoom: 'Quad', makkahNights: 0,
    madinaHotel: '', madinaRoom: 'Quad', madinaNights: 0,
    ticketPrice: 0, airline: '-', customAirline: '', ticketType1: 'Direct', ticketType2: 'System Ticket',
    clientName: '', adults: 1, children: 0, infants: 0,
    childPrice: 0, infantPrice: 0, phone: '', notes: ''
  });

  const [grandTotal, setGrandTotal] = useState(0);
  const [adultPerHead, setAdultPerHead] = useState(0);
  
  // NAYA CODE: Custom Modal State
  const [modalConfig, setModalConfig] = useState({ isOpen: false, message: '', type: 'error' });

  // NAYA CODE: Modal Show/Hide Functions
  const showAlert = (message, type = 'error') => {
    setModalConfig({ isOpen: true, message, type });
  };
  const closeModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  // --- REAL-TIME FAST CALCULATION ---
  useEffect(() => {
    const mHotel = makkahHotels.find(h => h.id === parseInt(form.makkahHotel));
    const mRate = mHotel ? mHotel.rate : 0;
    const mCost = mRate * roomMultipliers[form.makkahRoom] * (parseInt(form.makkahNights) || 0);

    const dHotel = madinaHotels.find(h => h.id === parseInt(form.madinaHotel));
    const dRate = dHotel ? dHotel.rate : 0;
    const dCost = dRate * roomMultipliers[form.madinaRoom] * (parseInt(form.madinaNights) || 0);

    const tktPrice = parseFloat(form.ticketPrice) || 0;
    const perAdult = mCost + dCost + tktPrice;
    
    const totalAdults = perAdult * (parseInt(form.adults) || 1);
    const totalChildren = (parseFloat(form.childPrice) || 0) * (parseInt(form.children) || 0);
    const totalInfants = (parseFloat(form.infantPrice) || 0) * (parseInt(form.infants) || 0);

    setAdultPerHead(Math.round(perAdult));
    setGrandTotal(Math.round(totalAdults + totalChildren + totalInfants));
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // --- WHATSAPP INQUIRY GENERATOR ---
  const sendToWhatsApp = () => {
    if (!form.clientName || form.adults < 1) {
      // Yahan standard alert ko nikal kar Custom Alert call kar diya hai
      showAlert("Please enter Client Name and at least 1 Adult to proceed!", "error");
      return;
    }

    const mHotelName = makkahHotels.find(h => h.id === parseInt(form.makkahHotel))?.name || "Not Selected";
    const dHotelName = madinaHotels.find(h => h.id === parseInt(form.madinaHotel))?.name || "Not Selected";
    const finalAirline = form.airline === 'CUSTOM' ? form.customAirline : form.airline;

    const message = `*🌟 MOSAFIROON UMRAH INQUIRY 🌟*

*👤 Client Details*
Name: ${form.clientName}
Contact: ${form.phone || "N/A"}
Total Pax: ${form.adults} Adults, ${form.children} Children, ${form.infants} Infants

*🕋 Makkah Stay*
Hotel: ${mHotelName}
Room: ${form.makkahRoom}
Nights: ${form.makkahNights || 0}

*🕌 Madinah Stay*
Hotel: ${dHotelName}
Room: ${form.madinaRoom}
Nights: ${form.madinaNights || 0}

*✈️ Flight Details*
Airline: ${finalAirline} (${form.ticketType1} | ${form.ticketType2})
Ticket Price: ${form.ticketPrice || 0} PKR

*💰 Pricing Breakdown*
Adults: ${form.adults} x ${adultPerHead.toLocaleString()} PKR
Children: ${form.children} x ${(form.childPrice || 0).toLocaleString()} PKR
Infants: ${form.infants} x ${(form.infantPrice || 0).toLocaleString()} PKR

*📝 Notes:* ${form.notes || "None"}

*🛑 GRAND TOTAL: ${grandTotal.toLocaleString()} PKR*`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/923112462949?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans relative">
      
      {/* --- NAYA CODE: Custom Beautiful Popup Modal --- */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[10000] p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
            <div className="p-6 text-center bg-[#1f0333] border-b-4 border-[#cca332]">
               <i className={`fa-solid ${modalConfig.type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'} text-[#cca332] text-5xl mb-3`}></i>
               <h3 className="text-xl font-black text-white uppercase tracking-widest">
                 {modalConfig.type === 'error' ? 'Attention!' : 'Success!'}
               </h3>
            </div>
            <div className="p-8 text-center space-y-6 bg-gray-50">
              <p className="text-gray-700 font-medium text-sm leading-relaxed">{modalConfig.message}</p>
              <button 
                onClick={closeModal}
                className="w-full bg-[#cca332] text-white font-black py-4 rounded-xl hover:bg-[#1f0333] hover:shadow-lg transition-all duration-300 tracking-wider"
              >
                GOT IT
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-fade-in">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#5a189a] via-[#3b0764] to-[#1f0333] py-8 px-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#cca332]"></div>
          <h2 className="text-sm font-black text-[#cca332] tracking-[0.3em] uppercase mb-2">Mosafiroon</h2>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">UMRAH CALCULATOR</h1>
          <p className="text-gray-300 mt-2 text-sm font-medium">Design & Calculate Your Custom Package Instantly</p>
        </div>

        <div className="p-8 md:p-10 space-y-8">
          
          {/* --- SECTION 1: HOTELS --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#3b0764] border-l-4 border-[#cca332] pl-3 uppercase tracking-wider">Makkah Stay</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Hotel Name</label>
                  <select name="makkahHotel" value={form.makkahHotel} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#cca332] focus:border-[#cca332] outline-none transition-all">
                    <option value="">Select Hotel</option>
                    {makkahHotels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Room Type</label>
                    <select name="makkahRoom" value={form.makkahRoom} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#cca332] outline-none transition-all">
                      <option value="Sharing">Sharing</option><option value="Quint">Quint</option><option value="Quad">Quad</option><option value="Triple">Triple</option><option value="Double">Double</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Nights</label>
                    <input type="number" name="makkahNights" min="0" value={form.makkahNights} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#cca332] outline-none transition-all" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#3b0764] border-l-4 border-[#cca332] pl-3 uppercase tracking-wider">Madinah Stay</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Hotel Name</label>
                  <select name="madinaHotel" value={form.madinaHotel} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#cca332] outline-none transition-all">
                    <option value="">Select Hotel</option>
                    {madinaHotels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Room Type</label>
                    <select name="madinaRoom" value={form.madinaRoom} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#cca332] outline-none transition-all">
                      <option value="Sharing">Sharing</option><option value="Quint">Quint</option><option value="Quad">Quad</option><option value="Triple">Triple</option><option value="Double">Double</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Nights</label>
                    <input type="number" name="madinaNights" min="0" value={form.madinaNights} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#cca332] outline-none transition-all" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* --- SECTION 2: FLIGHTS --- */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#3b0764] border-l-4 border-[#cca332] pl-3 uppercase tracking-wider">Flight Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-600 mb-1">Choose Airline</label>
                <select name="airline" value={form.airline} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#cca332] outline-none transition-all">
                  <option value="-">NONE</option>
                  {airlinesList.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                {form.airline === 'CUSTOM' && (
                  <input type="text" name="customAirline" placeholder="Enter Custom Airline Name" value={form.customAirline} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm mt-2 focus:ring-2 focus:ring-[#cca332] outline-none transition-all" />
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Ticket Type 1</label>
                <select name="ticketType1" value={form.ticketType1} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#cca332] outline-none transition-all">
                  <option value="Direct">Direct</option><option value="Indirect">Indirect</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Ticket Type 2</label>
                <select name="ticketType2" value={form.ticketType2} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#cca332] outline-none transition-all">
                  <option value="System Ticket">System Ticket</option><option value="Group Ticket">Group Ticket</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* --- SECTION 3: PAX & PRICING --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#3b0764] border-l-4 border-[#cca332] pl-3 uppercase tracking-wider">Passengers Details</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                   <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Client Name</label>
                      <input type="text" name="clientName" placeholder="Head Name" value={form.clientName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#cca332] outline-none transition-all" />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Contact No</label>
                      <input type="text" name="phone" placeholder="03xx-xxxxxxx" value={form.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#cca332] outline-none transition-all" />
                   </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Adults</label>
                    <input type="number" name="adults" min="1" value={form.adults} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#cca332] outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Children</label>
                    <input type="number" name="children" min="0" value={form.children} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#cca332] outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Infants</label>
                    <input type="number" name="infants" min="0" value={form.infants} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#cca332] outline-none transition-all" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#3b0764] border-l-4 border-[#cca332] pl-3 uppercase tracking-wider">Prices (PKR)</h3>
              <div className="space-y-3">
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Ticket Price (Per Adult)</label>
                    <input type="number" name="ticketPrice" min="0" value={form.ticketPrice} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm font-bold text-[#3b0764] focus:ring-2 focus:ring-[#cca332] outline-none transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Child Price Total</label>
                    <input type="number" name="childPrice" min="0" value={form.childPrice} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#cca332] outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Infant Price Total</label>
                    <input type="number" name="infantPrice" min="0" value={form.infantPrice} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#cca332] outline-none transition-all" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-600 mb-1">Additional Notes</label>
            <textarea name="notes" rows="2" placeholder="Any specific requirements..." value={form.notes} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#cca332] outline-none transition-all"></textarea>
          </div>

        </div>

        {/* --- BOTTOM SUMMARY & WHATSAPP BUTTON --- */}
        <div className="bg-[#1f0333] p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-[#cca332] font-bold text-sm tracking-widest mb-1 uppercase">Estimated Grand Total</p>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
              {grandTotal.toLocaleString()} <span className="text-xl text-gray-400 font-medium">PKR</span>
            </h2>
          </div>
          
          <button 
            onClick={sendToWhatsApp}
            className="w-full md:w-auto bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 text-lg"
          >
            <i className="fa-brands fa-whatsapp text-2xl"></i>
            SEND INQUIRY
          </button>
        </div>

      </div>
    </div>
  );
}

export default Customize;