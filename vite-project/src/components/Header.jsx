import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom'; // NavLink import kiya

function Header({ currency, setCurrency }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Active link ke liye style helper
  const activeStyle = ({ isActive }) => 
    isActive ? "text-[#cca332] border-b-2 border-[#cca332] pb-1 transition-all duration-300" : "hover:text-[#cca332] transition-all duration-300 pb-1 border-b-2 border-transparent";

  return (
    <>
      <div className="bg-[#1f0333] text-white py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-phone"></i>
            <span className="font-semibold tracking-wider">03112462949</span>
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
          
          <button onClick={toggleMenu} className="md:hidden text-2xl focus:outline-none hover:text-[#cca332] transition">
            <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>

          <Link to="/" className="flex items-center">
             <span className="text-xl md:text-2xl font-black tracking-[0.2em]">MOSAFIROON</span>
          </Link>

          {/* Desktop Nav with Underline Logic */}
          <nav className="hidden md:flex space-x-8 items-center text-sm font-medium">
            <NavLink to="/premium-packages" className={activeStyle}>Star Packages</NavLink>
            <NavLink to="/economy-packages" className={activeStyle}>Economy Packages</NavLink>
            <NavLink to="/special-deals" className={activeStyle}>Special Offer</NavLink>
            <NavLink to="/customize" className={activeStyle}>Customize Packages</NavLink>
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

        {/* Mobile Menu (Same as before) */}
        <div className={`fixed inset-0 bg-black/50 transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={toggleMenu}></div>
        <div className={`fixed top-0 left-0 h-full w-64 bg-[#1f0333] shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden z-[60] ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-10">
              <span className="font-black text-lg tracking-widest text-[#cca332]">MENU</span>
              <button onClick={toggleMenu} className="text-2xl"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <nav className="flex flex-col space-y-6 text-lg font-semibold">
              <Link to="/premium-packages" onClick={toggleMenu} className="hover:text-[#cca332] flex items-center gap-3">Star Packages</Link>
              <Link to="/economy-packages" onClick={toggleMenu} className="hover:text-[#cca332] flex items-center gap-3">Economy Packages</Link>
              <Link to="/special-deals" onClick={toggleMenu} className="text-[#cca332] flex items-center gap-3">Special Offer</Link>
              <Link to="/customize" onClick={toggleMenu} className="hover:text-[#cca332] flex items-center gap-3">Customize</Link>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;