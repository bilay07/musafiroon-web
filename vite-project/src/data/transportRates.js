// B2B transport rates (NST Transport) — base currency is SAR.
export const VEHICLES = [
  { key: 'Car', label: 'Car', icon: 'fa-car', capacity: '1-3 pax' },
  { key: 'Staria', label: 'Staria', icon: 'fa-van-shuttle', capacity: '4-6 pax' },
  { key: 'Hi-Ace', label: 'Hi-Ace', icon: 'fa-shuttle-van', capacity: '7-11 pax' },
  { key: 'MP4', label: 'MP4', icon: 'fa-bus', capacity: '12+ pax' },
];

// Ordered to follow the most common Umrah journey sequence first:
// Jeddah Airport -> Makkah -> Madinah -> Makkah -> Jeddah Airport,
// then each route's own variants/alternatives right after it.
export const TRANSPORT_ROUTES = [
  // 1. Arrival: Jeddah Airport -> Makkah Hotel
  {
    id: 'jed-mak',
    label: 'Jeddah Airport → Makkah Hotel',
    icon: 'fa-plane-arrival',
    rates: { Car: 200, Staria: 250, 'Hi-Ace': 300, MP4: 230 },
  },
  {
    id: 'jed-t1-mak',
    label: 'Jeddah Airport (Terminal 1, North) → Makkah Hotel',
    icon: 'fa-plane-arrival',
    rates: { Car: 275, Staria: 300, 'Hi-Ace': 350, MP4: 275 },
  },
  // 2. Makkah -> Madinah
  {
    id: 'mak-mad',
    label: 'Makkah → Madinah',
    icon: 'fa-route',
    rates: { Car: 400, Staria: 475, 'Hi-Ace': 575, MP4: 430 },
  },
  {
    id: 'mak-mad-badar',
    label: 'Makkah → Madinah (via Badar)',
    icon: 'fa-route',
    rates: { Car: 510, Staria: 585, 'Hi-Ace': 685, MP4: 540 },
  },
  // 3. Madinah -> Makkah
  {
    id: 'mad-mak',
    label: 'Madinah → Makkah',
    icon: 'fa-route',
    rates: { Car: 400, Staria: 475, 'Hi-Ace': 575, MP4: 430 },
  },
  {
    id: 'mad-mak-badar',
    label: 'Madinah → Makkah (via Badar)',
    icon: 'fa-route',
    rates: { Car: 510, Staria: 585, 'Hi-Ace': 685, MP4: 540 },
  },
  // 4. Departure: Makkah Hotel -> Jeddah Airport
  {
    id: 'mak-jed',
    label: 'Makkah Hotel → Jeddah Airport',
    icon: 'fa-plane-departure',
    rates: { Car: 200, Staria: 250, 'Hi-Ace': 300, MP4: 230 },
  },
  {
    id: 'mak-jed-t1',
    label: 'Makkah Hotel → Jeddah Airport (Terminal 1, North)',
    icon: 'fa-plane-departure',
    rates: { Car: 275, Staria: 300, 'Hi-Ace': 350, MP4: 275 },
  },
  // Alternative flow: flying directly in/out of Madinah instead of Jeddah
  {
    id: 'jed-mad',
    label: 'Jeddah → Madinah',
    icon: 'fa-route',
    rates: { Car: 450, Staria: 500, 'Hi-Ace': 600, MP4: 475 },
  },
  {
    id: 'mad-jed',
    label: 'Madinah → Jeddah',
    icon: 'fa-route',
    rates: { Car: 400, Staria: 475, 'Hi-Ace': 550, MP4: 450 },
  },
  {
    id: 'mad-airport-hotel',
    label: 'Madinah Airport → Madinah Hotel',
    icon: 'fa-plane-arrival',
    rates: { Car: 200, Staria: 250, 'Hi-Ace': 300, MP4: 250 },
  },
  {
    id: 'mad-hotel-airport',
    label: 'Madinah Hotel → Madinah Airport',
    icon: 'fa-plane-departure',
    rates: { Car: 170, Staria: 200, 'Hi-Ace': 250, MP4: 200 },
  },
  // Ziyarat
  {
    id: 'ziyarat-makkah',
    label: 'Ziyarat in Makkah',
    icon: 'fa-person-praying',
    rates: { Car: 220, Staria: 250, 'Hi-Ace': 300, MP4: 225 },
  },
  {
    id: 'ziyarat-madinah',
    label: 'Ziyarat in Madinah',
    icon: 'fa-person-praying',
    rates: { Car: 220, Staria: 250, 'Hi-Ace': 300, MP4: 225 },
  },
];

export const TRANSPORT_TERMS = [
  'Makkah → Madinah departure time 09:00 AM, Madinah → Makkah departure time 14:00 to 15:00.',
  'Arrivals from Jeddah and Madinah airports get a 2-hour waiting window; after that 100 SAR/hour charges apply.',
  'If the passenger does not arrive or cannot be contacted, full charges will apply.',
  "The driver's contact number will be shared 12-24 hours before pickup.",
  '24/7 booking, service, and helpline available.',
];

export function convertFromSAR(amountSAR, targetCurrency, exchangeRates) {
  if (targetCurrency === 'SAR') return amountSAR;
  const usdEquivalent = amountSAR / exchangeRates.SAR;
  return usdEquivalent * exchangeRates[targetCurrency];
}
