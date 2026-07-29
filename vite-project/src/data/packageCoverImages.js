import { GALLERY_HOTELS, getHotelImages } from './galleryHotels';

const MAKKAH_HOTEL_MATCHERS = [
  { id: 'voco-makkah', keywords: ['voco'] },
  { id: 'kiswah-towers', keywords: ['kiswah'] },
  { id: 'le-meridian-makkah', keywords: ['le meridian'] },
  { id: 'makkah-tower', keywords: ['makkah tower'] },
];

const MADINAH_HOTEL_MATCHERS = [
  { id: 'safat-al-madina', keywords: ['safwat', 'safat'] },
  { id: 'burj-mouadda', keywords: ['burj mouadda'] },
  { id: 'rama-al-madina', keywords: ['rama al madina'] },
];

function findHotelImages(title, matchers) {
  const t = title.toLowerCase();
  const match = matchers.find(({ keywords }) => keywords.some((k) => t.includes(k)));
  if (!match) return [];
  const hotel = GALLERY_HOTELS.find((h) => h.id === match.id);
  if (!hotel) return [];
  return getHotelImages(hotel).map((src) => ({ src, hotelName: hotel.name }));
}

// Matches a package title against the hotels we already have real photos
// for (see galleryHotels.js) and returns every uploaded photo for the
// matched Makkah hotel + every uploaded photo for the matched Madinah
// hotel — interleaved (Makkah, Madinah, Makkah, Madinah...) so the card's
// rotation shows both sides instead of running through one hotel first.
export function getPackageCoverImages(title) {
  const makkahImages = findHotelImages(title, MAKKAH_HOTEL_MATCHERS);
  const madinahImages = findHotelImages(title, MADINAH_HOTEL_MATCHERS);

  const images = [];
  const maxLen = Math.max(makkahImages.length, madinahImages.length);
  for (let i = 0; i < maxLen; i += 1) {
    if (makkahImages[i]) images.push(makkahImages[i]);
    if (madinahImages[i]) images.push(madinahImages[i]);
  }
  return images;
}
