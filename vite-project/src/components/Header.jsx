import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header({ currency, setCurrency }) {
  // Mobile menu ki state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Current page pata karne ke liye
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Scroll Lock jab menu open ho
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Desktop links ke liye animation aur active state ki class banani ka function
  const getNavLinkClass = (path) => {
    const isActive = location.pathname === path;
    // Base classes jis mein left-to-right underline animation hai
    const baseClass = "relative py-1 transition-colors duration-300 hover:text-[#cca332] " +
                      "after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-[#cca332] " +
                      "after:origin-left after:transition-transform after:duration-300 ";
    
    if (isActive) {
      // Agar page active hai toh line poori dikhao (scale-x-100)
      return baseClass + "text-[#cca332] after:scale-x-100";
    } else {
      // Agar active nahi hai toh line chupa do (scale-x-0) aur hover pe dikhao
      return baseClass + "after:scale-x-0 hover:after:scale-x-100";
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#1f0333] text-white py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-phone"></i>
            <span className="font-semibold tracking-wider">+92 3112462949</span>
          </div>
          <div className="flex items-center space-x-5">
            <a href="https://wa.me/923112462949" target="_blank" rel="noreferrer" className="hover:text-[#cca332] transition"><i className="fa-brands fa-whatsapp text-lg"></i></a>
            <a href="https://www.facebook.com/profile.php?id=100088573880681" target="_blank" rel="noreferrer" className="hover:text-[#cca332] transition"><i className="fa-brands fa-facebook text-lg"></i></a>
            <a href="https://www.instagram.com/mosafiroon1/" target="_blank" rel="noreferrer" className="hover:text-[#cca332] transition"><i className="fa-brands fa-instagram text-lg"></i></a>
          </div>
        </div>
      </div>

      <header className="bg-gradient-to-r from-[#5a189a] via-[#3b0764] to-[#1f0333] text-white py-4 shadow-lg sticky top-0 z-50 border-b border-[#cca332]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          
          {/* LEFT: Hamburger Button (Mobile Only) */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden text-2xl focus:outline-none hover:text-[#cca332] transition"
          >
            <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>

          {/* CENTER: Logo */}
          <Link to="/" className="flex items-center">
             <span className="text-xl md:text-2xl font-black tracking-[0.2em]">MOSAFIROON</span>
          </Link>

          {/* RIGHT: Desktop Nav */}
          <nav className="hidden md:flex space-x-8 items-center text-sm font-medium">
            <Link to="/premium-packages" className={getNavLinkClass("/premium-packages")}>Star Packages</Link>
            <Link to="/economy-packages" className={getNavLinkClass("/economy-packages")}>Economy Packages</Link>
            <Link to="/customize" className={getNavLinkClass("/customize")}>Customize Packages</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent text-white border border-[#cca332] rounded px-2 py-1 text-xs md:text-sm focus:outline-none focus:border-[#cca332] transition cursor-pointer"
            >
              <option value="USD" className="text-gray-900">USD</option>
              <option value="PKR" className="text-gray-900">PKR</option>
              <option value="SAR" className="text-gray-900">SAR</option>
            </select>
          </div>
        </div>

        {/* MOBILE SIDEBAR MENU (Overlay) */}
        <div className={`fixed inset-0 bg-black/50 transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={toggleMenu}></div>
        
        {/* MOBILE SIDEBAR CONTENT */}
        <div className={`fixed top-0 left-0 h-[100dvh] w-64 bg-[#1f0333] shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden z-[60] flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 flex-1 flex flex-col overflow-y-auto">
            <div>
              <div className="flex justify-between items-center mb-10">
                <span className="font-black text-lg tracking-widest text-[#cca332]">MENU</span>
                <button onClick={toggleMenu} className="text-2xl"><i className="fa-solid fa-xmark"></i></button>
              </div>
              
              <nav className="flex flex-col space-y-6 text-lg font-semibold">
                <Link to="/premium-packages" onClick={toggleMenu} className="hover:text-[#cca332] flex items-center gap-3">
                  <i className="fa-solid fa-star text-sm text-[#cca332]"></i> Star Packages
                </Link>
                <Link to="/economy-packages" onClick={toggleMenu} className="hover:text-[#cca332] flex items-center gap-3">
                  <i className="fa-solid fa-wallet text-sm text-[#cca332]"></i> Economy Packages
                </Link>
                <Link to="/customize" onClick={toggleMenu} className="hover:text-[#cca332] flex items-center gap-3">
                  <i className="fa-solid fa-sliders text-sm text-[#cca332]"></i> Customize
                </Link>
              </nav>
            </div>

            {/* Bottom Contact Section */}
            <div className="mt-auto pt-8 border-t border-white/10 pb-4">
              <p className="text-xs text-gray-400 mb-4 uppercase tracking-widest">Contact Info</p>
              <div className="flex flex-col gap-4 text-[#cca332]">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-phone"></i>
                  <span className="text-white font-bold">+92 3112462949</span>
                </div>
                <div className="flex gap-4 mt-2">
                  <a href="https://wa.me/923112462949" target="_blank" rel="noreferrer"><i className="fa-brands fa-whatsapp text-xl"></i></a>
                  <a href="https://www.facebook.com/profile.php?id=100088573880681" target="_blank" rel="noreferrer"><i className="fa-brands fa-facebook text-xl"></i></a>
                  <a href="https://www.instagram.com/mosafiroon1/" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram text-xl"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;