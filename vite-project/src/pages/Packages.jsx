import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PackageDetails from './PackageDetails';
import PackageVariantList from './PackageVariantList';
import HeroBanner from '../components/HeroBanner';
import OfferCountdown from '../components/OfferCountdown';
import UmrahGuide from '../components/UmrahGuide';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';
import Gallery from '../components/Gallery';
import FAQ from '../components/FAQ';
import { TRANSPORT_ROUTES, VEHICLES } from '../data/transportRates';
import { getPackageCoverImages } from '../data/packageCoverImages';
import PackageCoverImage from '../components/PackageCoverImage';
import { useFavorites } from '../hooks/useFavorites';
import './Packages.css';

// Packages that share the same title are treated as room-type variants
// (Quad/Triple/Double) of the same hotel pairing, grouped into one card.
function groupPackagesByTitle(list) {
  const map = new Map();
  list.forEach((pkg) => {
    if (!map.has(pkg.title)) map.set(pkg.title, []);
    map.get(pkg.title).push(pkg);
  });
  return Array.from(map.values()).map((docs) => {
    // De-dupe by room type (keep the cheapest of each) in case the same
    // title/room-type combo was seeded more than once.
    const byRoomType = new Map();
    docs.forEach((pkg) => {
      const key = pkg.roomType || 'Double';
      const existing = byRoomType.get(key);
      if (!existing || (pkg.price || 0) < (existing.price || 0)) byRoomType.set(key, pkg);
    });
    const sorted = Array.from(byRoomType.values()).sort((a, b) => (a.price || 0) - (b.price || 0));
    return { title: sorted[0].title, variants: sorted, cheapest: sorted[0] };
  });
}

function Packages({ currency, exchangeRates }) {
  const [activeTab, setActiveTab] = useState('packages');
  const [pilgrims, setPilgrims] = useState(4);
  const [selectedMonth, setSelectedMonth] = useState('All Months*');
  const [selectedRoomType, setSelectedRoomType] = useState('Any');
  const [searchResults, setSearchResults] = useState(null);
  const [hotelLocation, setHotelLocation] = useState('Makkah');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [transportRoute, setTransportRoute] = useState('');
  const [transportVehicle, setTransportVehicle] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [packageData, setPackageData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const packagesListRef = useRef(null);
  const { isFavorite, toggleFavorite } = useFavorites();

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

  // Filter dropdown options are derived from the actual package data so a
  // month/room type only appears if a package for it really exists.
  const roomTypeOrder = { Quad: 0, Triple: 1, Double: 2, Single: 3, Quint: 4, Hexa: 5 };
  const availableMonths = useMemo(
    () => Array.from(new Set(packageData.map((p) => p.month || 'All Months*'))).sort(),
    [packageData]
  );
  const availableRoomTypes = useMemo(
    () => Array.from(new Set(packageData.map((p) => p.roomType || 'Double')))
      .sort((a, b) => (roomTypeOrder[a] ?? 9) - (roomTypeOrder[b] ?? 9)),
    [packageData]
  );

  const selectedPkgId = searchParams.get('pkg');
  const selectedPackage = packageData.find(p => p?._id?.toString() === selectedPkgId);
  const selectedGroupTitle = !selectedPackage ? searchParams.get('group') : null;
  const popularGroups = groupPackagesByTitle(packageData.filter(p => p.category === 'popular')).slice(0, 3);
  const searchResultGroups = searchResults ? groupPackagesByTitle(searchResults) : null;
  const selectedGroup = selectedGroupTitle
    ? groupPackagesByTitle(packageData).find(g => g.title === selectedGroupTitle)
    : null;

  // Scroll back to the top whenever the view switches (grid <-> room-type
  // list <-> details) so it never lands mid-page or on the footer.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedPkgId, selectedGroupTitle]);

  const handleSearchScroll = () => {
    if (packagesListRef.current) {
      packagesListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleTransportSearch = () => {
    const params = new URLSearchParams();
    if (transportRoute) params.set('route', transportRoute);
    if (transportVehicle) params.set('vehicle', transportVehicle);
    navigate(`/transport-rates?${params.toString()}`);
  };

  const handlePackageSearch = () => {
    const filtered = packageData.filter((pkg) => {
      const monthMatch = selectedMonth === 'All Months*' || (pkg.month || 'All Months*') === selectedMonth;
      const roomMatch = selectedRoomType === 'Any' || (pkg.roomType || '').toLowerCase() === selectedRoomType.toLowerCase();
      return monthMatch && roomMatch;
    });
    setSearchResults(filtered);
    handleSearchScroll();
  };

  const handleWhatsAppBooking = (pkgName, totalAmount) => {
    const waNumber = "923112462949"; 
    
    const monthText = selectedMonth !== 'All Months*' ? `\n*Desired Month:* ${selectedMonth}` : '';
    const message = `Salam! Main Umrah package book karna chahta hoon.\n\n*Company:* Mosafiroon\n*Package:* ${pkgName}\n*Persons:* ${pilgrims}${monthText}\n*Total Price:* ${currency} ${totalAmount.toLocaleString()}`;
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank'); 
  };

  return (
    <main className="flex-grow flex flex-col w-full bg-gray-50 packages-main-wrapper">
        {!selectedPackage && !selectedGroup && <HeroBanner />}
        {!selectedPackage && !selectedGroup && (
        <div id="packages-search" className="packages-header-bg pt-8 pb-10 w-full border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">

                {/* 🔥 VIP FLOATING TABS (Jazz Musafir Style) */}
                <div className="flex justify-center relative z-20 translate-y-1/2">
                    <div className="bg-white p-2 rounded-full shadow-xl flex gap-2 md:gap-3 border border-gray-100">

                        <button
                            onClick={() => setActiveTab('packages')}
                            className={`flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full transition-all duration-300 text-black ${
                                activeTab === 'packages'
                                ? 'toggle-gold-shine shadow-lg transform scale-105'
                                : 'bg-white hover:bg-purple-50'
                            }`}
                        >
                            <i className="fa-solid fa-box-open text-xl md:text-2xl mb-1.5 text-black"></i>
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-black">Packages</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('hotels')}
                            className={`flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full transition-all duration-300 text-black ${
                                activeTab === 'hotels'
                                ? 'toggle-gold-shine shadow-lg transform scale-105'
                                : 'bg-white hover:bg-purple-50'
                            }`}
                        >
                            <i className="fa-solid fa-bed text-xl md:text-2xl mb-1.5 text-black"></i>
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-black">Hotels</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('transport')}
                            className={`flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full transition-all duration-300 text-black ${
                                activeTab === 'transport'
                                ? 'toggle-gold-shine shadow-lg transform scale-105'
                                : 'bg-white hover:bg-purple-50'
                            }`}
                        >
                            <i className="fa-solid fa-car text-xl md:text-2xl mb-1.5 text-black"></i>
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-black">Transport</span>
                        </button>

                    </div>
                </div>

                {/* 🔥 MAIN SEARCH CONTAINER */}
                <div className="bg-white rounded-[2rem] p-5 md:p-6 shadow-2xl w-full pt-12 md:pt-14 relative z-10 border border-gray-100">
                    
                    {activeTab === 'packages' && (
                        <div className="flex flex-col md:flex-row gap-4 items-end animate-fade-in">
                            <div className="flex-1 w-full">
                                <label className="block text-theme-purple font-bold text-[13px] mb-1.5">Month</label>
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="custom-input luxury-select w-full rounded-lg p-3 text-gray-700 cursor-pointer h-[48px]"
                                >
                                    <option value="All Months*">All Months*</option>
                                    {availableMonths.filter((m) => m !== 'All Months*').map((m) => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1 w-full">
                                <label className="block text-theme-purple font-bold text-[13px] mb-1.5">Room Type</label>
                                <select
                                    value={selectedRoomType}
                                    onChange={(e) => setSelectedRoomType(e.target.value)}
                                    className="custom-input luxury-select w-full rounded-lg p-3 text-gray-700 cursor-pointer h-[48px]"
                                >
                                    <option value="Any">Any</option>
                                    {availableRoomTypes.map((r) => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-full md:w-auto">
                                <button onClick={handlePackageSearch} className="btn-gold w-full md:w-36 font-bold py-3 px-6 rounded-lg shadow-md h-[48px]">Search</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'hotels' && (
                        <div className="flex flex-col md:flex-row gap-4 items-end animate-fade-in">
                            <div className="flex-1 w-full">
                                <label className="block text-theme-purple font-bold text-[13px] mb-1.5">Location</label>
                                <div className="flex border border-gray-300 rounded-lg overflow-hidden h-[48px]">
                                    <button onClick={() => setHotelLocation('Makkah')} className={`flex-1 font-bold transition ${hotelLocation === 'Makkah' ? 'toggle-gold-shine text-black' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Makkah</button>
                                    <button onClick={() => setHotelLocation('Madinah')} className={`flex-1 font-bold transition border-l border-gray-300 ${hotelLocation === 'Madinah' ? 'toggle-gold-shine text-black' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Madinah</button>
                                </div>
                            </div>
                            <div className="flex-1 w-full">
                                <label className="block text-theme-purple font-bold text-[13px] mb-1.5">Check-in - Check-out</label>
                                <div className="flex items-center border border-gray-300 rounded-lg h-[48px] px-2 bg-white focus-within:border-[#f0ca00] transition-colors">
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
                                <select
                                    value={transportRoute}
                                    onChange={(e) => setTransportRoute(e.target.value)}
                                    className="custom-input luxury-select w-full rounded-lg p-3 text-gray-700 cursor-pointer h-[48px]"
                                >
                                    <option value="">Select Route</option>
                                    {TRANSPORT_ROUTES.map((route) => (
                                        <option key={route.id} value={route.id}>{route.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1 w-full">
                                <label className="block text-theme-purple font-bold text-[13px] mb-1.5">Vehicle</label>
                                <select
                                    value={transportVehicle}
                                    onChange={(e) => setTransportVehicle(e.target.value)}
                                    className="custom-input luxury-select w-full rounded-lg p-3 text-gray-700 cursor-pointer h-[48px]"
                                >
                                    <option value="">Select Vehicle</option>
                                    {VEHICLES.map((v) => (
                                        <option key={v.key} value={v.key}>{v.label} ({v.capacity})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-full md:w-auto">
                                <button onClick={handleTransportSearch} className="btn-gold w-full md:w-36 font-bold py-3 px-6 rounded-lg shadow-md h-[48px]">Search</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        )}

        {/* ... Baqi neechay wala code wese hi hai ... */}
        <div ref={packagesListRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full pt-16">
            {isLoading ? (
                <div className="text-center py-20">
                    <i className="fa-solid fa-spinner fa-spin text-4xl text-theme-purple"></i>
                    <p className="mt-4 text-gray-500 font-medium">Loading packages from server...</p>
                </div>
            ) : selectedGroup ? (
                <PackageVariantList
                    group={selectedGroup}
                    pilgrims={pilgrims}
                    currency={currency}
                    exchangeRates={exchangeRates}
                    currencySymbols={currencySymbols}
                    setSearchParams={setSearchParams}
                />
            ) : !selectedPackage ? (
                <>
                    <div className="text-center mb-12 animate-fade-in">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-theme-purple mb-3">
                            {searchResults ? 'Search Results' : 'Popular Packages'}
                        </h2>
                        <p className="text-gray-500 text-lg">
                            {searchResults
                                ? `${searchResults.length} package${searchResults.length === 1 ? '' : 's'} found`
                                : 'Explore our most booked and highly recommended Umrah packages'}
                        </p>
                        {searchResults && (
                            <button
                                onClick={() => setSearchResults(null)}
                                className="mt-4 text-sm font-semibold text-theme-purple underline hover:text-[#f0ca00] transition"
                            >
                                Clear Filter
                            </button>
                        )}
                    </div>

                    {searchResults && searchResults.length === 0 ? (
                        <div className="text-center py-16 text-gray-500">
                            <i className="fa-solid fa-circle-info text-3xl mb-4 text-[#f0ca00]"></i>
                            <p>Is Month/Room Type ke liye koi package nahi mila.</p>
                        </div>
                    ) : (
                    <div className="packages-cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch animate-fade-in">
                        {(searchResultGroups || popularGroups).map((group, index) => {
                            const pkg = group.cheapest;
                            const hasVariants = group.variants.length > 1;
                            const convertedPrice = (pkg.price || 0) * exchangeRates[currency];
                            const totalPrice = pilgrims * convertedPrice;
                            return (
                                <div key={group.title} className="relative bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition flex flex-col h-full">
                                    <div className="relative w-full h-44 rounded-t-xl overflow-hidden bg-gradient-to-br from-[#4a0000] via-[#810000] to-[#c20000]">
                                        {pkg.category === 'popular' && (
                                            <div className="hot-flame">
                                                <span className="flame-edge flame-edge-left"><span className="flame-glow flame-glow-left"></span></span>
                                                <span className="flame-edge flame-edge-top"><span className="flame-glow flame-glow-top"></span></span>
                                                <span className="flame-edge flame-edge-right"><span className="flame-glow flame-glow-right"></span></span>
                                            </div>
                                        )}
                                        {pkg.image ? (
                                            <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                                        ) : getPackageCoverImages(pkg.title).length ? (
                                            <PackageCoverImage images={getPackageCoverImages(pkg.title)} alt={pkg.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <i className="fa-solid fa-mosque text-4xl text-white/40"></i>
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            aria-label="Save"
                                            onClick={(e) => { e.stopPropagation(); toggleFavorite(group.title); }}
                                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:scale-110 transition"
                                        >
                                            <i className={`${isFavorite(group.title) ? 'fa-solid text-red-500' : 'fa-regular text-gray-600'} fa-heart`}></i>
                                        </button>
                                        <span className="absolute top-3 left-3 badge-gold-shine text-black text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow">{pkg.month || 'All Months*'}</span>
                                    </div>
                                    <div className="p-5 flex-grow flex flex-col luxury-card-pattern">
                                        <div className="flex justify-center items-center gap-1.5 mb-1.5">
                                            <span className="text-sm font-bold text-gray-800">{(pkg.rating || 5).toFixed(1)}</span>
                                            <span className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <i key={star} className={`fa-solid fa-star text-xs ${star <= Math.round(pkg.rating || 5) ? 'text-[#f0ca00]' : 'text-gray-200'}`}></i>
                                                ))}
                                            </span>
                                            <span className="text-[11px] text-gray-400">({pkg.reviewCount || 0} reviews)</span>
                                        </div>
                                        <h3 className="font-bold text-gray-800 text-center mb-1">{pkg.title}</h3>
                                        <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider text-center flex items-center justify-center gap-1">
                                            {pkg.route && pkg.route.map((city, cIndex) => (
                                                <span key={cIndex} className="flex items-center">
                                                    {city} {cIndex < pkg.route.length - 1 && <i className="fa-solid fa-arrow-right text-[10px] mx-1 text-gray-400"></i>}
                                                </span>
                                            ))}
                                        </div>
                                        {!hasVariants && pkg.roomType && (
                                            <div className="flex justify-center mb-4">
                                                <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-600 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                                                    <i className="fa-solid fa-bed text-[#f0ca00]"></i> {pkg.roomType}
                                                </span>
                                            </div>
                                        )}
                                        {hasVariants && (
                                            <div className="flex justify-center gap-1.5 mb-4">
                                                {group.variants.map((v) => (
                                                    <span key={v._id} className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 text-gray-600 text-[10px] font-semibold px-2 py-1 rounded-full">
                                                        {v.roomType}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <hr className="border-gray-200 my-4 mt-auto" />
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">
                                                    {hasVariants ? 'Starting from' : `${currencySymbols[currency]} ${Math.round(convertedPrice).toLocaleString()} / Pilgrim`}
                                                </p>
                                                <p className="text-2xl font-bold text-theme-purple">{currencySymbols[currency]} {Math.round(totalPrice).toLocaleString()}</p>
                                            </div>
                                            <button
                                                onClick={() => hasVariants ? setSearchParams({ group: group.title }) : setSearchParams({ pkg: pkg._id })}
                                                className="btn-gold px-5 py-2.5 rounded-md font-semibold text-black"
                                            >
                                                More Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    )}
                </>
            ) : (
                <PackageDetails
                    selectedPackage={selectedPackage}
                    pilgrims={pilgrims}
                    setPilgrims={setPilgrims}
                    currency={currency}
                    exchangeRates={exchangeRates}
                    currencySymbols={currencySymbols}
                    setSearchParams={setSearchParams}
                    handleWhatsAppBooking={handleWhatsAppBooking}
                />
            )}
        </div>

        {!selectedPackage && !selectedGroup && (
            <>
                <OfferCountdown />
                <WhyChooseUs />
                <Testimonials />
                <UmrahGuide />
                <Gallery />
                <FAQ />
            </>
        )}
    </main>
  );
}

export default Packages;