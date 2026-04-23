import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; 

function Footer() {
  return (
    <footer className="custom-footer">
      {/* Wave SVG (Top Border) */}
      <div className="wave-divider">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Mosafiroon Text Moved Outside and Made Smaller */}
        <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-white tracking-widest uppercase">Mosafiroon</h2>
        </div>
        
        {/* Grid layout updated to 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          {/* Column 1: Info Container */}
          <div className="footer-info-card">
            <p className="text-sm text-gray-200 leading-relaxed mb-6">
              We're travel experts with a passion for bringing spiritual journeys to life. By leveraging a unique, consultative process and an agile service approach, we translate your travel needs into seamless Umrah experiences.
            </p>
            
            {/* Social Icons Updated from Header */}
            <div className="flex space-x-3">
              <a href="https://wa.me/923112462949" target="_blank" rel="noreferrer" className="social-icon-btn"><i className="fa-brands fa-whatsapp"></i></a>
              <a href="https://www.facebook.com/profile.php?id=100088573880681" target="_blank" rel="noreferrer" className="social-icon-btn"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="https://www.instagram.com/mosafiroon1/" target="_blank" rel="noreferrer" className="social-icon-btn"><i className="fa-brands fa-instagram"></i></a>
            </div>
          </div>

          {/* Column 2: Services Container */}
          <div className="footer-info-card">
            <h3 className="text-white font-bold text-xl mb-6 tracking-wide">Services</h3>
            <ul className="footer-links-list space-y-3">
              <li><Link to="/premium-packages">Star Packages</Link></li>
              <li><Link to="/economy-packages">Economy Packages</Link></li>
              <li><Link to="/customize">Customized Umrah</Link></li>
              <li><Link to="/">Ziyarat Tours</Link></li>
              <li><Link to="/">Hotel Booking</Link></li>
              <li><Link to="/">Transport Services</Link></li>
            </ul>
          </div>

          {/* Column 3: Get In Touch (Map) Container */}
          <div className="footer-info-card">
            <h3 className="text-white font-bold text-xl mb-4 tracking-wide">Get In Touch</h3>
            <p className="text-sm text-gray-200 mb-5 leading-relaxed">
              Know where to find us? Let's take a look and get in touch!
            </p>
            
            {/* Clickable Map Location Box */}
            <a 
              href="https://maps.google.com/?q=Abbas+Trade+Center,+Main+PIA+Main+Blvd,+near+Javaid+Nehari,+Lahore" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-white/5 hover:bg-white/10 transition duration-300 p-4 rounded-xl mb-6 border border-white/10 group cursor-pointer shadow-sm"
            >
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-map-location-dot text-[#cca332] text-2xl mt-1 group-hover:scale-110 transition-transform"></i>
                <div>
                  <p className="text-sm text-white font-bold mb-1">Mosafiroon</p>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Office No. M1 - M3, 1st Floor, Abbas Trade Center, Main PIA Main Blvd, near Javaid Nehari, Lahore
                  </p>
                  <span className="text-[#cca332] text-xs font-semibold mt-2 inline-flex items-center gap-1 group-hover:underline">
                    View on Google Maps <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </span>
                </div>
              </div>
            </a>

            <ul className="contact-list">
              <li>
                <i className="fa-solid fa-phone text-[#cca332]"></i>
                <span>+92 311 2462949</span>
              </li>
              <li>
                <i className="fa-solid fa-envelope text-[#cca332]"></i>
                <span>info@mosafiroon.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright Bar */}
        <div className="border-t border-white/20 pt-6 pb-2 text-sm text-gray-300 text-center md:text-left">
          <p>Copyright © 2026 Mosafiroon Tourism. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;