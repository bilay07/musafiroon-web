import React, { useEffect, useRef, useState } from 'react';
import './PlaneLoader.css';

const PlaneLoader = ({ onFinished }) => {
  // Check karte hain ke kya hum admin page par hain?
  const isAdminRoute = window.location.pathname.toLowerCase().includes('admin');

  // Agar admin page hai toh animation ko shuru se hi 'false' rakho
  const [isAnimating, setIsAnimating] = useState(!isAdminRoute);

  // Ref rakhte hain taake parent ke re-render par onFinished ki identity
  // badalne se ye effect dobara na chale aur timer restart na ho.
  const onFinishedRef = useRef(onFinished);
  onFinishedRef.current = onFinished;

  useEffect(() => {
    // Agar admin page hai, toh fauran onFinished call kar do taake login screen dikh jaye
    if (isAdminRoute) {
      if (onFinishedRef.current) onFinishedRef.current();
      return; // Aage ka timer code mat chalao
    }

    // Plane top se gayab (planeFlyBy khatam) aur panels open (openLeftPanel/
    // openRightPanel) dono ~4.5s par khatam hote hain — website usi waqt khul jaye.
    const timer = setTimeout(() => {
      setIsAnimating(false);
      if (onFinishedRef.current) onFinishedRef.current();
    }, 4500);

    return () => clearTimeout(timer);
  }, [isAdminRoute]);

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
      
      {/* MOSAFIROON Text with 'Presented by Bin Aziz' */}
      <h2 className="loader-musafiroon-text flex flex-col items-center justify-center">
        <span>MOSAFIROON</span>
        {/* 🔥 YAHAN TEXT KA COLOR YELLOW/GOLD (#f0ca00) KAR DIYA HAI */}
        <span className="text-[12px] md:text-[14px] italic text-[#f0ca00] font-bold tracking-widest mt-[-2px] md:mt-[-4px]" style={{ fontFamily: 'sans-serif' }}>
          Presented by Bin Aziz
        </span>
      </h2>
    </div>
  );
};

export default PlaneLoader;