import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PackageDetails from './PackageDetails';
import PackageVariantList from './PackageVariantList';
import { getPackageCoverImages } from '../data/packageCoverImages';
import PackageCoverImage from '../components/PackageCoverImage';
import { useFavorites } from '../hooks/useFavorites';
import './PremiumPackages.css';

// Packages sharing the same title are room-type variants (Quad/Triple/Double)
// of the same hotel pairing — group them into a single card.
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

function PremiumPackages({ currency, exchangeRates }) {
  const [premiumData, setPremiumData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pilgrims, setPilgrims] = useState(4);
  const [searchParams, setSearchParams] = useSearchParams();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    window.scrollTo(0, 0);

    fetch('https://musafiroon-web.onrender.com/api/premium')
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

  const currencySymbols = { USD: "$", PKR: "Rs", SAR: "SR" };
  const premiumGroups = groupPackagesByTitle(premiumData);

  const selectedPkgId = searchParams.get('pkg');
  const selectedPackage = premiumData.find(p => p?._id?.toString() === selectedPkgId);
  const selectedGroupTitle = !selectedPackage ? searchParams.get('group') : null;
  const selectedGroup = selectedGroupTitle
    ? premiumGroups.find(g => g.title === selectedGroupTitle)
    : null;

  // Scroll back to the top whenever the view switches (grid <-> room-type
  // list <-> details) so it never lands mid-page or on the footer.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedPkgId, selectedGroupTitle]);

  const handleWhatsAppBooking = (pkgName, totalAmount) => {
    const waNumber = "923112462949";
    const message = `Salam! Main Umrah package book karna chahta hoon.\n\n*Company:* Mosafiroon\n*Package:* ${pkgName}\n*Persons:* ${pilgrims}\n*Total Price:* ${currency} ${totalAmount.toLocaleString()}`;
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <main className="premium-wrapper">
      <div className="premium-container">

        {!selectedPackage && !selectedGroup && (
          <div className="premium-header-box animate-fade-in-premium">
            <h1 className="premium-title">Star Packages</h1>
            <p className="premium-subtitle">Experience ultimate luxury and comfort with our top-tier accommodations right next to the Haramain.</p>
          </div>
        )}

        {isLoading ? (
          <div className="premium-loader-box">
            <i className="fa-solid fa-spinner premium-loader-icon"></i>
            <p className="premium-loader-text">Loading Star Packages...</p>
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
        ) : selectedPackage ? (
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
        ) : (
          <div className="premium-grid animate-fade-in-premium">
            {premiumGroups.map((group) => {
              const pkg = group.cheapest;
              const hasVariants = group.variants.length > 1;
              const convertedPrice = (pkg.price || 0) * exchangeRates[currency];
              return (
                <div key={group.title} className="premium-card">
                  <div className="premium-ribbon-bar">
                    <i className="fa-solid fa-crown"></i> Premium Selection
                  </div>
                  <div className="card-image-wrap">
                    {pkg.image ? (
                      <img src={pkg.image} alt={pkg.title} className="card-image" />
                    ) : getPackageCoverImages(pkg.title).length ? (
                      <PackageCoverImage images={getPackageCoverImages(pkg.title)} alt={pkg.title} className="card-image" />
                    ) : (
                      <div className="card-image-placeholder">
                        <i className="fa-solid fa-mosque"></i>
                      </div>
                    )}
                    <button
                      type="button"
                      aria-label="Save"
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(group.title); }}
                      className={`card-fav-btn ${isFavorite(group.title) ? 'is-active' : ''}`}
                    >
                      <i className={isFavorite(group.title) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                    </button>
                    <span className="card-month-badge">{pkg.month || 'All Months*'}</span>
                  </div>

                  <div className="card-content">
                    <div className="card-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i key={star} className={`fa-solid fa-star ${star <= (pkg.rating || 5) ? 'card-star-filled' : 'card-star-empty'}`}></i>
                      ))}
                    </div>
                    <h3 className="card-title">{pkg.title}</h3>
                    <div className="card-route">
                      {pkg.route && pkg.route.map((city, cIndex) => (
                        <span key={cIndex} style={{display: 'flex', alignItems: 'center'}}>
                          {city} {cIndex < pkg.route.length - 1 && <i className="fa-solid fa-arrow-right route-arrow-icon"></i>}
                        </span>
                      ))}
                    </div>

                    {hasVariants ? (
                      <div className="card-roomtype-row" style={{ gap: '0.4rem', flexWrap: 'wrap' }}>
                        {group.variants.map((v) => (
                          <span key={v._id} className="card-roomtype-pill">
                            <i className="fa-solid fa-bed"></i> {v.roomType}
                          </span>
                        ))}
                      </div>
                    ) : pkg.roomType && (
                      <div className="card-roomtype-row">
                        <span className="card-roomtype-pill">
                          <i className="fa-solid fa-bed"></i> {pkg.roomType}
                        </span>
                      </div>
                    )}

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
                      <button
                        type="button"
                        onClick={() => hasVariants ? setSearchParams({ group: group.title }) : setSearchParams({ pkg: pkg._id })}
                        className="premium-book-btn"
                      >
                        Book Now
                      </button>
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
