import React from 'react';

function PackageDetails({ 
  selectedPackage, 
  pilgrims, 
  currency, 
  exchangeRates, 
  currencySymbols, 
  setSearchParams, 
  handleWhatsAppBooking 
}) {
  
  // FIX 1: basePrice ko price kar diya, aur agar price na ho to 0 assume karega
  const packagePrice = selectedPackage?.price || 0;
  const totalPrice = pilgrims * packagePrice * exchangeRates[currency];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-10 animate-fade-in flex-grow flex flex-col">
      {/* Back Button */}
      <button 
        onClick={() => setSearchParams({})} 
        className="flex items-center text-gray-500 hover:text-[#0a4232] font-medium mb-8"
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Back to Packages
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 flex-grow">
        {/* Package Title & Description */}
        <div className="col-span-1 lg:col-span-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedPackage?.title}</h1>
          {/* FIX 2: Agar DB mein description na ho, to ye default line dikha dega */}
          <p className="text-gray-600 leading-relaxed mb-8">
            {selectedPackage?.description || "Experience a spiritually enriching journey with this carefully crafted Umrah package. Designed to provide comfort, convenience, and peace of mind."}
          </p>
        </div>

        {/* Booking Summary Box */}
        <div className="bg-[#f8f9fa] p-6 rounded-xl border border-gray-200 h-fit shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-4 mb-4">
            Booking Summary
          </h3>
          <div className="flex justify-between items-end mb-8">
            <span className="text-gray-800 font-bold">Total Amount:</span>
            <span className="text-3xl font-bold text-[#0f5132]">
              {currencySymbols[currency]} {Math.round(totalPrice).toLocaleString()}
            </span>
          </div>
          {/* FIX 3: WhatsApp button mein bhi basePrice ki jagah packagePrice (totalPrice) */}
          <button 
            onClick={() => handleWhatsAppBooking(selectedPackage?.title, totalPrice)} 
            className="w-full bg-[#cca332] text-white py-3 rounded-lg font-bold text-lg hover:bg-yellow-600 transition flex items-center justify-center"
          >
            <i className="fa-brands fa-whatsapp text-2xl mr-2"></i> Inquire on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

export default PackageDetails;