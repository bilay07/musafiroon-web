import React, { useEffect, useState } from 'react';

// Cycles through the given { src, hotelName } photos every few seconds
// (fading between them), same idea as the homepage gallery's auto-rotating
// tiles — with a small label showing which hotel the current photo is of.
function PackageCoverImage({ images, alt, className }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return undefined;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (!images.length) return null;

  const current = images[index];

  return (
    <>
      <img
        key={current.src}
        src={current.src}
        alt={alt}
        className={className}
        style={{ animation: 'fadeIn 0.6s ease-out forwards' }}
      />
      {current.hotelName && (
        <span key={`label-${current.src}`} className="package-cover-hotel-label">
          {current.hotelName}
        </span>
      )}
    </>
  );
}

export default PackageCoverImage;
