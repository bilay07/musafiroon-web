import React, { useEffect, useState } from 'react';

// Placeholder offer + deadline — tell us the real discount and end date and we'll swap these in.
const OFFER_TITLE = 'Umrah Season 2026 — Early Bird Offer';
const OFFER_SUBTITLE = 'Book now and lock in early-bird pricing before rates go up';
const OFFER_END_DATE = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000);

function getTimeLeft() {
  const diff = OFFER_END_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function OfferCountdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds },
  ];

  return (
    <section className="offer-banner">
      <div className="offer-banner-inner">
        <div className="offer-text">
          <span className="offer-tag">Limited Time</span>
          <h3 className="offer-title">{OFFER_TITLE}</h3>
          <p className="offer-subtitle">{OFFER_SUBTITLE}</p>
        </div>

        <div className="offer-countdown">
          {units.map((unit) => (
            <div key={unit.label} className="offer-countdown-unit">
              <span className="offer-countdown-value">{String(unit.value).padStart(2, '0')}</span>
              <span className="offer-countdown-label">{unit.label}</span>
            </div>
          ))}
        </div>

        <a href="https://wa.me/923112462949" target="_blank" rel="noreferrer" className="offer-cta">
          Claim Offer
        </a>
      </div>
    </section>
  );
}

export default OfferCountdown;
