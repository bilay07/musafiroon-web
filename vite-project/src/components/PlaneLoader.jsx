import React, { useEffect, useState } from 'react';
import './PlaneLoader.css';

const PlaneLoader = ({ onFinished }) => {
  // Check karte hain ke kya hum admin page par hain?
  const isAdminRoute = window.location.pathname.toLowerCase().includes('admin');
  
  // Agar admin page hai toh animation ko shuru se hi 'false' rakho
  const [isAnimating, setIsAnimating] = useState(!isAdminRoute);

  useEffect(() => {
    // Agar admin page hai, toh fauran onFinished call kar do taake login screen dikh jaye
    if (isAdminRoute) {
      if (onFinished) onFinished();
      return; // Aage ka timer code mat chalao
    }

    // 6.5 seconds delay taake end pe white screen (flash) na aaye
    const timer = setTimeout(() => {
      setIsAnimating(false);
      if (onFinished) onFinished();
    }, 6500);

    return () => clearTimeout(timer);
  }, [onFinished, isAdminRoute]);

  // Agar animation nahi chalni (jaise admin page par), toh kuch mat dikhao (null)
  if (!isAnimating) return null;

  return (
    <div className="plane-loader-main-wrapper">
      
      {/* Background Curtains / Panels */}
      <div className="loader-panel left-panel"></div>
      <div className="loader-panel right-panel"></div>

      {/* Dashed Zip Line */}
      <div className="dynamic-zip-dashed-line"></div>

      {/* Airplane Container */}
      <div className="airplane-flight-wrapper">
        <i className="fa-solid fa-plane-up a380-plane-icon"></i>
      </div>
      
      {/* MUSAFIROON Text */}
      <h2 className="loader-musafiroon-text">MOSAFIROON</h2>
    </div>
  );
};

export default PlaneLoader;