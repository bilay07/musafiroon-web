import React from 'react';

function HeroBanner() {
  const scrollToPackages = () => {
    document.getElementById('packages-search')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="hero-banner">
      <video
        className="hero-banner-video"
        autoPlay
        muted
        loop
        playsInline
        poster="/hero/hero-poster.jpg"
      >
        <source src="/hero/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="hero-banner-overlay"></div>
      <div className="hero-banner-content">
        <span className="hero-eyebrow">Trusted Umrah Partner</span>
        <h1 className="hero-title">Your Journey to the Holy Cities, Perfected</h1>
        <p className="hero-subtitle">
          Handpicked hotels, verified transport, and 24/7 support — everything planned so you can focus on your Ibadah.
        </p>
        <div className="hero-cta-row">
          <button type="button" onClick={scrollToPackages} className="hero-cta-primary">
            Explore Packages
          </button>
          <a
            href="https://wa.me/923112462949"
            target="_blank"
            rel="noreferrer"
            className="hero-cta-secondary"
          >
            <i className="fa-brands fa-whatsapp"></i> Talk to Us
          </a>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
