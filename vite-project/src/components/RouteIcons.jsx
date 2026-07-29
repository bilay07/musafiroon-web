import React from 'react';

const LINE = '#1f2937';

export function AirportIcon({ className }) {
  const ribs = [30, 40, 50, 60, 70, 80, 90];
  const windows = [26, 34, 42, 58, 66, 74, 82, 90, 98];
  return (
    <svg viewBox="0 0 124 80" className={className}>
      <rect x="0" y="70" width="124" height="2.5" fill="#e5e7eb" />

      {/* antenna mast */}
      <line x1="20" y1="10" x2="20" y2="26" stroke={LINE} strokeWidth="1.4" />
      <circle cx="20" cy="8" r="2.6" fill={LINE} />

      {/* ribbed arched roof */}
      <path d="M18,42 Q62,14 106,42 L106,50 L18,50 Z" fill="#ffffff" stroke={LINE} strokeWidth="1.6" />
      {ribs.map((x) => (
        <line
          key={`rib-${x}`}
          x1={x}
          y1={42 - 14 * Math.sin(((x - 18) / 88) * Math.PI)}
          x2={x}
          y2="50"
          stroke={LINE}
          strokeWidth="1"
        />
      ))}

      {/* terminal base */}
      <rect x="14" y="50" width="96" height="20" fill="#ffffff" stroke={LINE} strokeWidth="1.6" />
      {windows.map((x, i) => (
        <rect key={`w-${i}`} x={x - 3} y="57" width="6" height="9" fill={LINE} />
      ))}
      <rect x="14" y="66" width="96" height="4" fill={LINE} />
    </svg>
  );
}

export function CarIcon({ className }) {
  return (
    <svg viewBox="0 0 120 62" className={className}>
      <rect x="4" y="48" width="112" height="2" fill="#e5e7eb" />

      <path
        d="M12,48 Q9,48 9,43 L9,35 Q9,29 16,26 L29,17 Q34,13 42,13 L82,13 Q91,13 96,21 L103,32 Q111,33 111,41 L111,48 Z"
        fill="#ffffff"
        stroke={LINE}
        strokeWidth="1.8"
      />

      <path
        d="M33,16 Q37,15 42,15 L80,15 Q86,15 90,20 L95,27 L29,27 Z"
        fill="#f0ca00"
        stroke={LINE}
        strokeWidth="1.4"
      />
      <line x1="61" y1="15.3" x2="61" y2="27" stroke={LINE} strokeWidth="1.2" />

      <rect x="9" y="40" width="102" height="5" fill="#4a0000" />

      <circle cx="30" cy="49" r="9.5" fill={LINE} />
      <circle cx="30" cy="49" r="4" fill="#cbd5e1" />
      <circle cx="90" cy="49" r="9.5" fill={LINE} />
      <circle cx="90" cy="49" r="4" fill="#cbd5e1" />
    </svg>
  );
}

function ConeTree({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-1.3" y="14" width="2.6" height="8" fill="#78350f" />
      <polygon points="0,-4 9,16 -9,16" fill="#3f6b4f" />
      <polygon points="0,3 7,16 -7,16" fill="#4d7c5f" />
    </g>
  );
}

export function HotelIcon({ className }) {
  const cols = [40, 54];
  const rows = [26, 37, 48, 59];
  return (
    <svg viewBox="0 0 100 82" className={className}>
      <rect x="0" y="72" width="100" height="2.5" fill="#e5e7eb" />

      {/* small dark ornament box beside building */}
      <polygon points="10,58 18,54 26,58 26,68 18,72 10,68" fill="#111827" />

      <ConeTree x={78} y={40} scale={0.85} />

      {/* building */}
      <rect x="32" y="14" width="36" height="58" fill="#ffffff" stroke={LINE} strokeWidth="1.6" />
      <rect x="32" y="14" width="36" height="5" fill={LINE} />
      {rows.map((y) =>
        cols.map((x) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" fill="#a9c3d6" stroke={LINE} strokeWidth="0.8" />
        ))
      )}
      <path d="M44,72 L44,60 Q50,55 56,60 L56,72 Z" fill="#4a0000" />
    </svg>
  );
}

export function LandmarkIcon({ className }) {
  return (
    <svg viewBox="0 0 100 82" className={className}>
      <rect x="0" y="72" width="100" height="2.5" fill="#e5e7eb" />

      {/* faint skyline behind */}
      <g opacity="0.35" fill="#9ca3af">
        <rect x="4" y="46" width="10" height="26" />
        <rect x="16" y="38" width="10" height="34" />
        <rect x="74" y="42" width="10" height="30" />
        <rect x="86" y="50" width="10" height="22" />
      </g>

      <ConeTree x={20} y={44} scale={0.8} />
      <ConeTree x={28} y={52} scale={0.6} />
      <ConeTree x={76} y={48} scale={0.75} />

      {/* building with dome */}
      <rect x="38" y="24" width="24" height="48" fill="#ffffff" stroke={LINE} strokeWidth="1.6" />
      <rect x="38" y="24" width="24" height="4.5" fill={LINE} />
      <rect x="43" y="33" width="6" height="7" fill="#a9c3d6" stroke={LINE} strokeWidth="0.7" />
      <rect x="51" y="33" width="6" height="7" fill="#a9c3d6" stroke={LINE} strokeWidth="0.7" />
      <rect x="43" y="46" width="6" height="7" fill="#a9c3d6" stroke={LINE} strokeWidth="0.7" />
      <rect x="51" y="46" width="6" height="7" fill="#a9c3d6" stroke={LINE} strokeWidth="0.7" />
      <path d="M46,72 L46,62 Q50,58 54,62 L54,72 Z" fill="#4a0000" />

      <ellipse cx="50" cy="18" rx="9" ry="7" fill="#4a0000" stroke={LINE} strokeWidth="1.2" />
      <rect x="48.5" y="8" width="3" height="8" fill="#f0ca00" />
      <circle cx="50" cy="7" r="2.2" fill="#f0ca00" />
    </svg>
  );
}
