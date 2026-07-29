import React from 'react';

function PackageVariantList({ group, pilgrims, currency, exchangeRates, currencySymbols, setSearchParams }) {
  const sortOrder = { Double: 0, Triple: 1, Quad: 2 };
  const variants = [...group.variants].sort(
    (a, b) => (sortOrder[a.roomType] ?? 9) - (sortOrder[b.roomType] ?? 9)
  );

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <button
        onClick={() => setSearchParams({})}
        className="flex items-center text-gray-500 hover:text-[#810000] font-medium mb-6"
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Back to Packages
      </button>

      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-theme-purple mb-2">{group.title}</h2>
        <p className="text-gray-500">Choose a room type to see full package details</p>
      </div>

      <div className="flex flex-col gap-4">
        {variants.map((variant) => {
          const convertedPrice = (variant.price || 0) * exchangeRates[currency];
          const totalPrice = pilgrims * convertedPrice;
          return (
            <button
              key={variant._id}
              onClick={() => setSearchParams({ pkg: variant._id })}
              className="variant-row-card"
            >
              <span className="variant-row-icon">
                <i className="fa-solid fa-bed"></i>
              </span>
              <span className="variant-row-roomtype">{variant.roomType}</span>
              <span className="variant-row-prices">
                <span className="variant-row-per-pilgrim">
                  {currencySymbols[currency]} {Math.round(convertedPrice).toLocaleString()} / Pilgrim
                </span>
                <span className="variant-row-total">
                  {currencySymbols[currency]} {Math.round(totalPrice).toLocaleString()}
                </span>
              </span>
              <i className="fa-solid fa-chevron-right variant-row-chevron"></i>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PackageVariantList;
