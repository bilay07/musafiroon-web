import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import PackageDetails from './PackageDetails';
import './Packages.css';

function Packages({ currency, exchangeRates }) {
  const [activeTab, setActiveTab] = useState('packages'); 
  const [pilgrims, setPilgrims] = useState(4);
  const [selectedMonth, setSelectedMonth] = useState('All Months*'); // Naya Month Filter
  const [hotelLocation, setHotelLocation] = useState('Makkah');
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const [packageData, setPackageData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Smooth scroll ke liye ref
  const packagesListRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    fetch('https://musafiroon-web.onrender.com/api/packages')
      .then(response => response.json())
      .then(data => {
        setPackageData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setIsLoading(false);
      });
  }, [searchParams]);

  const currencySymbols = { USD: "$", PKR: "Rs", SAR: "SR" };

  const selectedPkgId = searchParams.get('pkg');
  
  const selectedPackage = packageData.find(p => p?._id?.toString() === selectedPkgId);

  const popularPackagesList = packageData.filter(p => p.category === 'popular').slice(0, 3);

  // Smooth scroll function
  const handleSearchScroll = () => {
    if (packagesListRef.current) {
      packagesListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleWhatsAppBooking = (pkgName, totalAmount) => {
    const waNumber = "923184376511"; 
    // WhatsApp message mein Month bhej rahe hain
    const monthText = selectedMonth !== 'All Months*' ? `\n*Desired Month:* ${selectedMonth}` : '';
    const message = `Salam! Main Umrah package book karna chahta hoon.\n\n*Company:* Musafiroon\n*Package:* ${pkgName}\n*Persons:* ${pilgrims}${monthText}\n*Total Price:* ${currency} ${totalAmount.toLocaleString()}`;
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank'); 
  };

  return (
    <main className="flex-grow flex flex-col w-full bg-gray-50 packages-main-wrapper">
        <div className="packages-header-bg pt-8 pb-14 w-full border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center space-x-8 md:space-x-16 mb-6 text-sm font-medium">
                    <button 
                        onClick={() => setActiveTab('packages')}
                        className={`flex items-center pb-2 px-1 transition ${activeTab === 'packages' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <i className="fa-solid fa-box-open mr-2"></i> Packages
                    </button>
                    <button 
                        onClick={() => setActiveTab('hotels')}
                        className={`flex items-center pb-2 px-1 transition ${activeTab === 'hotels' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <i className="fa-solid fa-bed mr-2"></i> Hotels
                    </button>
                    <button 
                        onClick={() => setActiveTab('transport')}
                        className={`flex items-center pb-2 px-1 transition ${activeTab === 'transport' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <i className="fa-solid fa-car mr-2"></i> Transport
                    </button>
                </div>

                <div className="bg-white rounded-2xl p-4 md:p-6 shadow-xl w-full">
                    {activeTab === 'packages' && (
                        <div className="flex flex-col md:flex-row gap-4 items-end animate-fade-in">
                            <div className="flex-1 w-full">
                                <label className="block text-theme-purple font-bold text-[13px] mb-1.5">Month</label>
                                {/* Month wala dropdown */}
                                <select 
                                    value={selectedMonth} 
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="custom-input w-full rounded-lg p-3 text-gray-700 cursor-pointer h-[48px]"
                                >
                                    <option value="All Months*">All Months*</option>
                                    <option value="June">June</option>
                                    <option value="July">July</option>
                                    <option value="August">August</option>
                                    <option value="September">September</option>
                                </select>
                            </div>
                            <div className="flex-1 w-full">
                                <label className="block text-theme-purple font-bold text-[13px] mb-1.5">No. of Person's</label>
                                <select 
                                    value={pilgrims} onChange={(e) => setPilgrims(Number(e.target.value))}
                                    className="custom-input w-full rounded-lg p-3 text-gray-700 cursor-pointer h-[48px]"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => <option key={num} value={num}>{num} Person's</option>)}
                                </select>
                            </div>
                            <div className="w-full md:w-auto">
                                {/* Search Button Scroll */}
                                <button onClick={handleSearchScroll} className="btn-gold w-full md:w-36 font-bold py-3 px-6 rounded-lg shadow-md h-[48px]">Search</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'hotels' && (
                        <div className="flex flex-col md:flex-row gap-4 items-end animate-fade-in">
                            <div className="flex-1 w-full">
                                <label className="block text-theme-purple font-bold text-[13px] mb-1.5">Location</label>
                                <div className="flex border border-gray-300 rounded-lg overflow-hidden h-[48px]">
                                    <button onClick={() => setHotelLocation('Makkah')} className={`flex-1 font-bold transition ${hotelLocation === 'Makkah' ? 'btn-gold' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Makkah</button>
                                    <button onClick={() => setHotelLocation('Madinah')} className={`flex-1 font-bold transition border-l border-gray-300 ${hotelLocation === 'Madinah' ? 'btn-gold' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Madinah</button>
                                </div>
                            </div>
                            <div className="flex-1 w-full">
                                <label className="block text-theme-purple font-bold text-[13px] mb-1.5">Check-in - Check-out</label>
                                <div className="flex items-center border border-gray-300 rounded-lg h-[48px] px-2 bg-white focus-within:border-[#cca332] transition-colors">
                                    <input type="date" className="w-full text-gray-700 outline-none text-xs bg-transparent cursor-pointer" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                                    <span className="mx-1 text-gray-400">|</span>
                                    <input type="date" className="w-full text-gray-700 outline-none text-xs bg-transparent cursor-pointer" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                                </div>
                            </div>
                            <div className="flex-1 w-full">
                                <label className="block text-theme-purple font-bold text-[13px] mb-1.5">Pilgrims | Rooms</label>
                                <input type="text" defaultValue="2 Adult - 1 Room" className="custom-input w-full rounded-lg p-3 text-gray-700 italic h-[48px] text-sm" />
                            </div>
                            <div className="w-full md:w-auto">
                                <button onClick={handleSearchScroll} className="btn-gold w-full md:w-36 font-bold py-3 px-6 rounded-lg shadow-md h-[48px]">SEARCH</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'transport' && (
                        <div className="flex flex-col md:flex-row gap-4 items-end animate-fade-in">
                            <div className="flex-1 w-full">
                                <label className="block text-theme-purple font-bold text-[13px] mb-1.5">Route</label>
                                <select className="custom-input w-full rounded-lg p-3 text-gray-700 cursor-pointer h-[48px]">
                                    <option>Select Route</option>
                                    <option>Jeddah Airport to Makkah</option>
                                    <option>Makkah to Madinah</option>
                                    <option>Madinah to Airport</option>
                                </select>
                            </div>
                            <div className="flex-1 w-full">
                                <label className="block text-theme-purple font-bold text-[13px] mb-1.5">Vehicle</label>
                                <select className="custom-input w-full rounded-lg p-3 text-gray-700 cursor-pointer h-[48px]">
                                    <option>Select Vehicle</option>
                                    <option>Sedan (4 Seats)</option>
                                    <option>SUV (7 Seats)</option>
                                </select>
                            </div>
                            <div className="w-full md:w-auto">
                                <button onClick={handleSearchScroll} className="btn-gold w-full md:w-36 font-bold py-3 px-6 rounded-lg shadow-md h-[48px]">Search</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Ref yahan lagaya hai taake screen scroll ho kar yahan rukay */}
        <div ref={packagesListRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full pt-16">
            {isLoading ? (
                <div className="text-center py-20">
                    <i className="fa-solid fa-spinner fa-spin text-4xl text-theme-purple"></i>
                    <p className="mt-4 text-gray-500 font-medium">Loading packages from server...</p>
                </div>
            ) : !selectedPackage ? (
                <>
                    <div className="text-center mb-12 animate-fade-in">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-theme-purple mb-3">Popular Packages</h2>
                        <p className="text-gray-500 text-lg">Explore our most booked and highly recommended Umrah packages</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch animate-fade-in">
                        {popularPackagesList.map((pkg, index) => {
                            const convertedPrice = (pkg.price || 0) * exchangeRates[currency];
                            const totalPrice = pilgrims * convertedPrice;
                            return (
                                <div key={pkg._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition flex flex-col h-full">
                                    <div className="bg-dark-purple text-white text-[13px] font-semibold p-4 text-center">{pkg.title}</div>
                                    <div className="p-5 flex-grow flex flex-col">
                                        <div className="text-xs text-gray-500 mb-6 font-medium uppercase tracking-wider text-center flex items-center justify-center gap-1">
                                            {pkg.route && pkg.route.map((city, cIndex) => (
                                                <span key={cIndex} className="flex items-center">
                                                    {city} {cIndex < pkg.route.length - 1 && <i className="fa-solid fa-arrow-right text-[10px] mx-1 text-gray-400"></i>}
                                                </span>
                                            ))}
                                        </div>
                                        <h3 className="font-semibold text-gray-700 mb-3 text-center">Inclusions:</h3>
                                        <div className="flex justify-center space-x-6 mb-8 min-h-[60px]">
                                            {pkg.inclusions && pkg.inclusions.includes("Visa") && (
                                                <div className="flex flex-col items-center text-gray-500">
                                                    <i className="fa-solid fa-passport text-xl mb-1 text-theme-gold"></i><span className="text-[11px]">Visa</span>
                                                </div>
                                            )}
                                            {pkg.inclusions && pkg.inclusions.includes("Hotel") && (
                                                <div className="flex flex-col items-center text-gray-500">
                                                    <i className="fa-solid fa-hotel text-xl mb-1 text-theme-gold"></i><span className="text-[11px]">Hotel</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="bg-[#f8f9fa] p-4 rounded-lg border border-gray-100 mt-auto">
                                            <div className="flex justify-between text-sm mb-2"><span className="text-gray-500">Makkah Distance:</span><span className="font-bold text-gray-900">{pkg.distances?.makkah || 'N/A'}</span></div>
                                            <div className="flex justify-between text-sm"><span className="text-gray-500">Madinah Distance:</span><span className="font-bold text-gray-900">{pkg.distances?.madinah || 'N/A'}</span></div>
                                        </div>
                                        <hr className="border-gray-200 my-4" />
                                        <div className="flex justify-between items-end mt-auto">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">{currencySymbols[currency]} {Math.round(convertedPrice).toLocaleString()} / Pilgrim</p>
                                                <p className="text-2xl font-bold text-theme-purple">{currencySymbols[currency]} {Math.round(totalPrice).toLocaleString()}</p>
                                            </div>
                                            <button onClick={() => setSearchParams({ pkg: pkg._id })} className="btn-gold px-5 py-2.5 rounded-md font-semibold">Book Now</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <PackageDetails 
                    selectedPackage={selectedPackage}
                    pilgrims={pilgrims}
                    currency={currency}
                    exchangeRates={exchangeRates}
                    currencySymbols={currencySymbols}
                    setSearchParams={setSearchParams}
                    handleWhatsAppBooking={handleWhatsAppBooking}
                />
            )}
        </div>
    </main>
  );
}

export default Packages;