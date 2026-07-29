// Each hotel gets its own gallery section on the homepage.
// Drop image files into public/gallery/<hotel-id>/1.<ext>, 2.<ext>, ... matching `imageCount`.
// If uploaded files have mixed formats, list each file's extension in order via `exts` instead of a single `ext`.
export const GALLERY_HOTELS = [
  {
    id: 'kiswah-towers',
    name: 'Kiswah Towers',
    city: 'Makkah',
    imageCount: 7,
    ext: 'jpg',
  },
  {
    id: 'voco-makkah',
    name: 'Voco Makkah',
    city: 'Makkah',
    imageCount: 7,
    ext: 'png',
  },
  {
    id: 'safat-al-madina',
    name: 'Safat Al Madina',
    city: 'Madinah',
    imageCount: 6,
    ext: 'jpg',
  },
  {
    id: 'le-meridian-makkah',
    name: 'Le Meridian Makkah',
    city: 'Makkah',
    imageCount: 5,
    exts: ['jpeg', 'jpg', 'webp', 'jpeg', 'webp'],
  },
  {
    id: 'makkah-tower',
    name: 'Makkah Tower',
    city: 'Makkah',
    imageCount: 6,
    exts: ['webp', 'jpeg', 'jpeg', 'jpg', 'jpeg', 'avif'],
  },
  {
    id: 'burj-mouadda',
    name: 'Burj Mouadda',
    city: 'Madinah',
    imageCount: 4,
    exts: ['jpg', 'jpeg', 'png', 'avif'],
  },
  {
    id: 'rama-al-madina',
    name: 'Rama Al Madina',
    city: 'Madinah',
    imageCount: 5,
    exts: ['jpg', 'jpeg', 'jpg', 'jpeg', 'jpeg'],
  },
];

export function getHotelImages(hotel) {
  return Array.from({ length: hotel.imageCount }, (_, i) => {
    const ext = hotel.exts ? hotel.exts[i] : hotel.ext;
    return `/gallery/${hotel.id}/${i + 1}.${ext}`;
  });
}
