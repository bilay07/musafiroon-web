import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const CURRENCIES = ['USD', 'PKR', 'SAR'];

function Header({ currency, setCurrency }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const currencyRef = useRef(null);
  const location = useLocation();

  const dropdownRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const openCurrencyDropdown = () => {
    if (currencyRef.current) {
      const rect = currencyRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 8, left: rect.right, width: rect.width });
    }
    setIsCurrencyOpen((o) => !o);
  };

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedButton = currencyRef.current && currencyRef.current.contains(e.target);
      const clickedList = dropdownRef.current && dropdownRef.current.contains(e.target);
      if (!clickedButton && !clickedList) {
        setIsCurrencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNavLinkClass = (path) => {
    const isActive = location.pathname === path;
    const baseClass = "relative py-1 transition-colors duration-300 hover:text-[#f0ca00] " +
                      "after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-[#f0ca00] " +
                      "after:origin-left after:transition-transform after:duration-300 ";
    
    if (isActive) {
      return baseClass + "text-[#f0ca00] after:scale-x-100";
    } else {
      return baseClass + "after:scale-x-0 hover:after:scale-x-100";
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#c20000] text-white py-2 text-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-phone"></i>
            <span className="font-semibold tracking-wider">+92 3112462949</span>
          </div>
          <div className="flex items-center space-x-5">
            <a href="https://wa.me/923112462949" target="_blank" rel="noreferrer" className="hover:text-[#f0ca00] transition"><i className="fa-brands fa-whatsapp text-lg"></i></a>
            <a href="https://www.facebook.com/profile.php?id=100088573880681" target="_blank" rel="noreferrer" className="hover:text-[#f0ca00] transition"><i className="fa-brands fa-facebook text-lg"></i></a>
            <a href="https://www.instagram.com/mosafiroon1/" target="_blank" rel="noreferrer" className="hover:text-[#f0ca00] transition"><i className="fa-brands fa-instagram text-lg"></i></a>
          </div>
        </div>
      </div>

      <header className="site-header-gradient relative text-white py-4 shadow-lg sticky top-0 z-50 border-b border-[#f0ca00]/20 overflow-hidden">
        <div className="header-pattern-overlay"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex justify-between items-center">
          
          <button onClick={toggleMenu} className="md:hidden text-2xl focus:outline-none hover:text-[#f0ca00] transition">
            <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>

          <Link to="/" className="flex flex-col justify-center items-center md:items-start">
             <img src="/mosafiroon-logo-header.png" alt="Mosafiroon" className="h-10 md:h-14 w-auto object-contain" />
             <span className="text-[9px] md:text-[10px] italic font-bold text-[#f0ca00] tracking-widest -mt-0.5">By Bin Aziz Group</span>
          </Link>

          <nav className="hidden md:flex space-x-8 items-center text-sm font-medium">
            <Link to="/" className={getNavLinkClass("/")}>Home</Link>
            <Link to="/premium-packages" className={getNavLinkClass("/premium-packages")}>Star Packages</Link>
            <Link to="/economy-packages" className={getNavLinkClass("/economy-packages")}>Economy Packages</Link>
            <Link to="/customize" className={getNavLinkClass("/customize")}>Customize Packages</Link>
            <Link to="/transport-rates" className={getNavLinkClass("/transport-rates")}>Transport</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div ref={currencyRef} className="relative">
              <button
                type="button"
                onClick={openCurrencyDropdown}
                className="currency-select-gold text-xs md:text-sm"
              >
                {currency}
              </button>
              {isCurrencyOpen && createPortal(
                <ul
                  ref={dropdownRef}
                  className="currency-dropdown-list"
                  style={{ top: dropdownPos.top, left: dropdownPos.left - dropdownPos.width, minWidth: dropdownPos.width }}
                >
                  {CURRENCIES.map((cur) => (
                    <li key={cur}>
                      <button
                        type="button"
                        onClick={() => { setCurrency(cur); setIsCurrencyOpen(false); }}
                        className={`currency-option ${currency === cur ? 'active' : ''}`}
                      >
                        {cur}
                      </button>
                    </li>
                  ))}
                </ul>,
                document.body
              )}
            </div>
          </div>
        </div>

        <div className={`fixed inset-0 bg-black/50 transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={toggleMenu}></div>
        
        <div className={`fixed top-0 left-0 h-[100dvh] w-64 bg-[#c20000] shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden z-[60] flex flex-col overflow-hidden ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="header-pattern-overlay"></div>
          <div className="relative z-10 p-6 flex-1 flex flex-col overflow-y-auto">
            <div>
              <div className="flex justify-between items-center mb-10">
                <span className="font-black text-lg tracking-widest text-[#f0ca00]">MENU</span>
                <button onClick={toggleMenu} className="text-2xl"><i className="fa-solid fa-xmark"></i></button>
              </div>
              
              <nav className="flex flex-col space-y-6 text-lg font-semibold">
                <Link to="/" onClick={toggleMenu} className="hover:text-[#f0ca00] flex items-center gap-3">
                  <i className="fa-solid fa-house text-sm text-[#f0ca00]"></i> Home
                </Link>
                <Link to="/premium-packages" onClick={toggleMenu} className="hover:text-[#f0ca00] flex items-center gap-3">
                  <i className="fa-solid fa-star text-sm text-[#f0ca00]"></i> Star Packages
                </Link>
                <Link to="/economy-packages" onClick={toggleMenu} className="hover:text-[#f0ca00] flex items-center gap-3">
                  <i className="fa-solid fa-wallet text-sm text-[#f0ca00]"></i> Economy Packages
                </Link>
                <Link to="/customize" onClick={toggleMenu} className="hover:text-[#f0ca00] flex items-center gap-3">
                  <i className="fa-solid fa-sliders text-sm text-[#f0ca00]"></i> Customize
                </Link>
                <Link to="/transport-rates" onClick={toggleMenu} className="hover:text-[#f0ca00] flex items-center gap-3">
                  <i className="fa-solid fa-van-shuttle text-sm text-[#f0ca00]"></i> Transport
                </Link>
              </nav>
            </div>

            <div className="mt-auto pt-8 border-t border-white/10 pb-20">
              <p className="text-xs text-gray-400 mb-4 uppercase tracking-widest">Contact Info</p>
              <div className="flex flex-col gap-4 text-[#f0ca00]">
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