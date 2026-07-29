import React from 'react';
import './Logo.css';

const PLANE_GLYPH = String.fromCharCode(0xf072); // fa-plane (solid)

const SWOOSH_PATH = `M 122,28
  C 184,-8 260,2 340,26
  C 360,32 378,46 390,62
  C 397,68 413,73.3 413,85
  C 413,96.7 402.7,108 390,108
  C 377.3,108 367,96.7 367,85
  C 367,73.3 377.3,62 390,62
  C 398,54 406,50 414,48`;

function Logo({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 560 130"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      <text fontFamily="Poppins, Arial, sans-serif" fontWeight="900" fontSize="64" letterSpacing="2" fill="#ffffff">
        <tspan x="4" y="108">MOSAFIRO</tspan>
        <tspan x="416.656" y="108">N</tspan>
      </text>

      {/* single continuous swoosh + round loop (the second 'O'), starting above the first 'O' next to the M */}
      <path
        d={SWOOSH_PATH}
        fill="none" stroke="#f0ca00" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* traveling shine glint along the same path */}
      <path
        className="logo-shine"
        d={SWOOSH_PATH}
        pathLength="1"
        fill="none" stroke="#fff3d6" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="0.05 1"
      />

      {/* plane: mirrored so the nose points away and the tail feeds the swoosh */}
      <text
        x="196" y="54"
        fontFamily="'Font Awesome 6 Free'" fontWeight="900" fontSize="56"
        fill="#f0ca00" transform="translate(324,0) scale(-1,1) rotate(24 213 41)"
      >
        {PLANE_GLYPH}
      </text>
    </svg>
  );
}

export default Logo;
