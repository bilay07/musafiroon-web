import React from 'react';
import { Link } from 'react-router-dom';

// Logo SVG component completely removed

function Header({ currency, setCurrency }) {
  return (
    <>
      <div className="bg-[#1f0333] text-white py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-phone"></i>
            <span className="font-semibold tracking-wider">03112462949</span>
          </div>
          <div className="flex items-center space-x-5">
            <a href="#" className="hover:text-[#cca332] transition"><i className="fa-brands fa-whatsapp text-lg"></i></a>
            <a href="#" className="hover:text-[#cca332] transition"><i className="fa-brands fa-linkedin text-lg"></i></a>
            <a href="#" className="hover:text-[#cca332] transition"><i className="fa-brands fa-facebook text-lg"></i></a>
            <a href="#" className="hover:text-[#cca332] transition"><i className="fa-brands fa-instagram text-lg"></i></a>
            <a href="#" className="hover:text-[#cca332] transition"><i className="fa-brands fa-tiktok text-lg"></i></a>
          </div>
        </div>
      </div>

      <header className="bg-gradient-to-r from-[#5a189a] via-[#3b0764] to-[#1f0333] text-white py-4 shadow-lg sticky top-0 z-50 border-b border-[#cca332]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          
          {/* Logo ki jagah Simple Text aa gaya hai */}
          <Link to="/" className="flex items-center">
             <span className="text-2xl font-black tracking-[0.2em]">MUSAFIROON</span>
          </Link>

          <nav className="hidden md:flex space-x-8 items-center text-sm font-medium">
            <Link to="/premium-packages" className="hover:text-[#cca332] transition">Star Packages</Link>
            <Link to="/economy-packages" className="hover:text-[#cca332] transition">Economy Packages</Link>
            <Link to="/special-deals" className="hover:text-[#cca332] transition text-[#cca332]">Special Offer</Link>
            <Link to="/customize" className="hover:text-[#cca332] transition">Customize Packages</Link>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent text-white border border-[#cca332] rounded px-2 py-1 text-sm focus:outline-none focus:border-[#cca332] transition cursor-pointer"
            >
              <option value="USD" className="text-gray-900">USD ($)</option>
              <option value="PKR" className="text-gray-900">PKR (Rs)</option>
              <option value="SAR" className="text-gray-900">SAR (SR)</option>
            </select>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;