import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Header({ currency, setCurrency }) {
  // Mobile menu ki state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Top Bar (Mobiles par text center kar diya) */}
      <div className="bg-[#1f0333] text-white py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-phone"></i>
            <span className="font-semibold tracking-wider">03112462949</span>
          </div>
          <div className="flex items-center space-x-5">
            <a href="#" className="hover:text-[#cca332] transition"><i className="fa-brands fa-whatsapp text-lg"></i></a>
            <a href="#" className="hover:text-[#cca332] transition"><i className="fa-brands fa-instagram text-lg"></i></a>
            {/* Baqi icons space bachane ke liye mobile pe chahay toh kam kar dena */}
          </div>
        </div>
      </div>

      <header className="bg-gradient-to-r from-[#5a189a] via-[#3b0764] to-[#1f0333] text-white py-4 shadow-lg sticky top-0 z-50 border-b border-[#cca332]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          
          {/* LEFT: Hamburger Menu Button (Sirf Mobiles ke liye) */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden text-2xl focus:outline-none hover:text-[#cca332] transition"
          >
            <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>

          {/* CENTER: Logo (Mobiles pe thora chota aur center) */}
          <Link to="/" className="flex items-center">
             <span className="text-xl md:text-2xl font-black tracking-[0.2em]">MUSAFIROON</span>
          </Link>

          {/* RIGHT: Desktop Nav & Currency (Mobiles pe sirf currency dikhegi) */}
          <nav className="hidden md:flex space-x-8 items-center text-sm font-medium">
            <Link to="/premium-packages" className="hover:text-[#cca332] transition">Star Packages</Link>
            <Link to="/economy-packages" className="hover:text-[#cca332] transition">Economy Packages</Link>
            <Link to="/special-deals" className="hover:text-[#cca332] transition text-[#cca332]">Special Offer</Link>
            <Link to="/customize" className="hover:text-[#cca332] transition">Customize Packages</Link>
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
        <div className={`fixed top-0 left-0 h-full w-64 bg-[#1f0333] shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden z-[60] ${isMenuOpen ? 'translate-x-0' : '-translate-x-0'} ${!isMenuOpen && '-translate-x-full'}`}>
          <div className="p-6">
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
              <Link to="/special-deals" onClick={toggleMenu} className="text-[#cca332] flex items-center gap-3">
                <i className="fa-solid fa-fire text-sm"></i> Special Offer
              </Link>
              <Link to="/customize" onClick={toggleMenu} className="hover:text-[#cca332] flex items-center gap-3">
                <i className="fa-solid fa-sliders text-sm text-[#cca332]"></i> Customize
              </Link>
            </nav>

            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-xs text-gray-400 mb-4 uppercase tracking-widest">Contact Us</p>
              <div className="flex items-center gap-3 text-[#cca332]">
                <i className="fa-solid fa-phone"></i>
                <span className="text-white font-bold">03112462949</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;