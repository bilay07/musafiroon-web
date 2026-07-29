import React, { useEffect, useMemo, useState } from 'react';
import { GALLERY_HOTELS, getHotelImages } from '../data/galleryHotels';

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function allGalleryImages() {
  return GALLERY_HOTELS.flatMap((hotel) => {
    const images = getHotelImages(hotel);
    return images.map((src, i) => ({ src, hotelName: hotel.name, images, index: i }));
  });
}

function buildRandomPreview(pool) {
  return shuffle(pool).slice(0, 12);
}

// A fixed collage rhythm — wide/tall tiles mixed with normal ones so the
// grid reads like a real photo collage instead of a flat uniform grid.
const TILE_LAYOUT = ['wide', 'normal', 'tall', 'normal', 'normal', 'tall', 'wide', 'normal', 'normal', 'tall', 'normal', 'wide'];

function ImageTile({ src, alt, size, delay, fading, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`gallery-tile ${size === 'wide' ? 'gallery-tile-wide' : ''} ${size === 'tall' ? 'gallery-tile-tall' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <img src={src} alt={alt} className={`gallery-tile-img ${fading ? 'gallery-tile-img-fading' : ''}`} />
      <div className="gallery-tile-overlay">
        <span className="gallery-tile-caption">{alt}</span>
        <i className="fa-solid fa-expand gallery-tile-icon"></i>
      </div>
    </button>
  );
}

function HotelNameCard({ hotel, onOpen }) {
  const coverImage = getHotelImages(hotel)[0];
  return (
    <button type="button" onClick={onOpen} className="hotel-name-card animate-fade-in">
      {coverImage ? (
        <img src={coverImage} alt={hotel.name} className="hotel-name-card-img" />
      ) : (
        <div className="hotel-name-card-img flex items-center justify-center bg-gray-800">
          <i className="fa-solid fa-mosque text-4xl text-white/40"></i>
        </div>
      )}
      <div className="hotel-name-card-overlay">
        <span className="hotel-gallery-badge mb-2">{hotel.city}</span>
        <h3 className="hotel-name-card-title">{hotel.name}</h3>
        <span className="hotel-name-card-cta">View Photos <i className="fa-solid fa-arrow-right"></i></span>
      </div>
    </button>
  );
}

function Gallery() {
  const cities = useMemo(() => ['All', ...new Set(GALLERY_HOTELS.map((h) => h.city))], []);
  const imagePool = useMemo(() => allGalleryImages(), []);
  const [activeFilter, setActiveFilter] = useState('All');
  const [openHotelId, setOpenHotelId] = useState(null);
  const [randomPreview, setRandomPreview] = useState(() => buildRandomPreview(imagePool));
  const [fadingIndex, setFadingIndex] = useState(null);
  const [lightbox, setLightbox] = useState(null); // { images, index, title }

  const handleFilterClick = (city) => {
    setActiveFilter(city);
    setOpenHotelId(null);
    if (city === 'All') setRandomPreview(buildRandomPreview(imagePool));
  };

  // Every few seconds, cross-fade one random tile into a different photo —
  // keeps the "All" collage feeling alive instead of a static grid.
  useEffect(() => {
    if (activeFilter !== 'All') return undefined;
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * TILE_LAYOUT.length);
      setFadingIndex(idx);
      setTimeout(() => {
        setRandomPreview((prev) => {
          const usedSrcs = new Set(prev.map((t) => t.src));
          const candidates = imagePool.filter((p) => !usedSrcs.has(p.src));
          const pick = candidates.length
            ? candidates[Math.floor(Math.random() * candidates.length)]
            : imagePool[Math.floor(Math.random() * imagePool.length)];
          const next = [...prev];
          next[idx] = pick;
          return next;
        });
        setFadingIndex(null);
      }, 450);
    }, 3200);
    return () => clearInterval(interval);
  }, [activeFilter, imagePool]);

  const cityHotels = activeFilter === 'All' ? [] : GALLERY_HOTELS.filter((h) => h.city === activeFilter);
  const openHotel = GALLERY_HOTELS.find((h) => h.id === openHotelId);

  const openLightbox = (images, index, title) => setLightbox({ images, index, title });
  const closeLightbox = () => setLightbox(null);
  const showNext = () => setLightbox((lb) => ({ ...lb, index: (lb.index + 1) % lb.images.length }));
  const showPrev = () => setLightbox((lb) => ({ ...lb, index: (lb.index - 1 + lb.images.length) % lb.images.length }));

  useEffect(() => {
    if (!lightbox) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightbox]);

  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  return (
    <section className="w-full gallery-section-bg py-16">
      <div className="gallery-section-pattern"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Hotel Gallery</h2>
          <p className="text-gray-300 text-lg">A closer look at where you'll be staying</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10 animate-fade-in">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => handleFilterClick(city)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold uppercase tracking-wide transition-all duration-300 ${
                activeFilter === city
                  ? 'toggle-gold-shine text-black shadow-md scale-105'
                  : 'bg-white/5 text-gray-300 border border-white/15 hover:border-[#f0ca00] hover:text-[#f0ca00]'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {activeFilter === 'All' && (
          <div className="gallery-grid">
            {randomPreview.map((item, i) => (
              <ImageTile
                key={i}
                src={item.src}
                alt={item.hotelName}
                size={TILE_LAYOUT[i % TILE_LAYOUT.length]}
                delay={i * 70}
                fading={fadingIndex === i}
                onClick={() => openLightbox(item.images, item.index, item.hotelName)}
              />
            ))}
          </div>
        )}

        {activeFilter !== 'All' && !openHotel && (
          <div className="hotel-name-grid">
            {cityHotels.map((hotel) => (
              <HotelNameCard key={hotel.id} hotel={hotel} onOpen={() => setOpenHotelId(hotel.id)} />
            ))}
          </div>
        )}

        {activeFilter !== 'All' && openHotel && (
          <div>
            <button
              type="button"
              onClick={() => setOpenHotelId(null)}
              className="text-gray-300 text-xs font-semibold uppercase tracking-wider hover:text-[#f0ca00] transition inline-flex items-center gap-2 mb-5"
            >
              <i className="fa-solid fa-arrow-left"></i> Back to {activeFilter} Hotels
            </button>
            <div className="flex items-center gap-3 mb-5 animate-fade-in">
              <span className="hotel-gallery-badge">{openHotel.city}</span>
              <h3 className="text-xl md:text-2xl font-bold text-white">{openHotel.name}</h3>
            </div>
            <div className="gallery-grid">
              {getHotelImages(openHotel).map((src, i) => (
                <ImageTile
                  key={src}
                  src={src}
                  alt={`${openHotel.name} ${i + 1}`}
                  size={i === 0 ? 'wide' : 'normal'}
                  delay={i * 70}
                  onClick={() => openLightbox(getHotelImages(openHotel), i, openHotel.name)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {lightbox && (
        <div className="gallery-lightbox" onClick={closeLightbox}>
          <button type="button" className="gallery-lightbox-close" onClick={closeLightbox} aria-label="Close">
            <i className="fa-solid fa-xmark"></i>
          </button>
          <button
            type="button"
            className="gallery-lightbox-nav gallery-lightbox-prev"
            onClick={(e) => { e.stopPropagation(); showPrev(); }}
            aria-label="Previous"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          <div className="gallery-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.images[lightbox.index]} alt={lightbox.title} className="gallery-lightbox-img" />
            <p className="gallery-lightbox-caption">{lightbox.title}</p>
          </div>

          <button
            type="button"
            className="gallery-lightbox-nav gallery-lightbox-next"
            onClick={(e) => { e.stopPropagation(); showNext(); }}
            aria-label="Next"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      )}
    </section>
  );
}

export default Gallery;
