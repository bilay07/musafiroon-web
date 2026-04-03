import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// 9 Premium Packages
const premiumPackages = [
  {
    id: 101,
    title: "10 Nights | Premium - T5 | Quad",
    route: ["JEDDAH", "MAKKAH", "MADINAH"],
    inclusions: ["Visa", "Hotel", "Transport"],
    distances: { makkah: "100 m", madinah: "50 m" },
    price: 507
  },
  {
    id: 102,
    title: "14 Nights | VIP Premium | Double",
    route: ["JEDDAH", "MAKKAH", "MADINAH"],
    inclusions: ["Visa", "Hotel", "Transport"],
    distances: { makkah: "0 m", madinah: "0 m" },
    price: 850
  },
  {
    id: 103,
    title: "07 Nights | Express Premium | Double",
    route: ["JEDDAH", "MAKKAH"],
    inclusions: ["Visa", "Hotel", "Transport"],
    distances: { makkah: "50 m", madinah: "N/A" },
    price: 700
  },
  {
    id: 104,
    title: "15 Nights | Executive | Triple",
    route: ["JEDDAH", "MAKKAH", "MADINAH"],
    inclusions: ["Visa", "Hotel", "Transport"],
    distances: { makkah: "150 m", madinah: "100 m" },
    price: 901
  },
  {
    id: 105,
    title: "20 Nights | Premium Plus | Quad",
    route: ["JEDDAH", "MAKKAH", "MADINAH"],
    inclusions: ["Visa", "Hotel", "Transport"],
    distances: { makkah: "200 m", madinah: "150 m" },
    price: 1100
  },
  {
    id: 106,
    title: "12 Nights | Royal Suite | Double",
    route: ["JEDDAH", "MAKKAH", "MADINAH"],
    inclusions: ["Visa", "Hotel", "Transport"],
    distances: { makkah: "0 m", madinah: "0 m" },
    price: 1500
  },
  {
    id: 107,
    title: "08 Nights | Short Premium | Triple",
    route: ["JEDDAH", "MAKKAH", "MADINAH"],
    inclusions: ["Visa", "Hotel", "Transport"],
    distances: { makkah: "100 m", madinah: "100 m" },
    price: 600
  },
  {
    id: 108,
    title: "21 Nights | Elite Package | Quad",
    route: ["JEDDAH", "MAKKAH", "MADINAH"],
    inclusions: ["Visa", "Hotel", "Transport"],
    distances: { makkah: "250 m", madinah: "200 m" },
    price: 1250
  },
  {
    id: 109,
    title: "10 Nights | Golden Class | Double",
    route: ["JEDDAH", "MAKKAH", "MADINAH"],
    inclusions: ["Visa", "Hotel", "Transport"],
    distances: { makkah: "50 m", madinah: "50 m" },
    price: 750
  }
];

// 12 Economy Packages
const economyPackages = [
  {
    id: 201,
    title: "14 Nights | Economy - T3 | Quad",
    route: ["JEDDAH", "MAKKAH", "MADINAH"],
    distances: { makkah: "800 m", madinah: "500 m" },
    price: 420
  },
  {
    id: 202,
    title: "21 Nights | Super Saver | Quint",
    route: ["JEDDAH", "MAKKAH", "MADINAH"],
    distances: { makkah: "1.2 KM", madinah: "800 m" },
    price: 380
  },
  {
    id: 203,
    title: "10 Nights | Budget Umrah | Triple",
    route: ["JEDDAH", "MAKKAH", "MADINAH"],
    distances: { makkah: "900 m", madinah: "600 m" },
    price: 350
  },
  {
    id: 204,
    title: "15 Nights | Standard Economy | Quad",
    route: ["JEDDAH", "MAKKAH", "MADINAH"],
    distances: { makkah: "750 m", madinah: "450 m" },
    price: 440
  },
  {
    id: 205,
    title: "07 Nights | Quick Economy | Double",
    route: ["JEDDAH", "MAKKAH"],
    distances: { makkah: "800 m", madinah: "N/A" },
    price: 300
  },
  {
    id: 206,
    title: "28 Nights | Ramzan Saver | Hexa",
    route: ["JEDDAH", "MAKKAH", "MADINAH"],
    distances: { makkah: "1.5 KM", madinah: "1 KM" },
    price: 490
  },
  {
    id: 207,
    title: "12 Nights | Economy Plus | Triple",
    route: ["JEDDAH", "MAKKAH", "MADINAH"],
    distances: { makkah: "600 m", madinah: "400 m" },
    price: 460
  },
  {
    id: 208,
    title: "20 Nights | Extended Stay | Quad",
    route: ["JEDDAH", "MAKKAH", "MADINAH"],
    distances: { makkah: "1 KM", madinah: "700 m" },
    price: 410
  },
  {
    id: 209,
    title: "14 Nights | Value Package | Double",
    route: ["JEDDAH", "MAKKAH", "MADINAH"],
    distances: { makkah: "900 m", madinah: "500 m" },
    price: 480
  },
  {
    id: 210,
    title: "10 Nights | Basic Economy | Quint",
    route: ["JEDDAH", "MAKKAH", "MADINAH"],
    distances: { makkah: "1.2 KM", madinah: "800 m" },
    price: 320
  },
  {
    id: 211,
    title: "08 Nights | Short Saver | Triple",
    route: ["JEDDAH", "MAKKAH", "MADINAH"],
    distances: { makkah: "850 m", madinah: "500 m" },
    price: 340
  },
  {
    id: 212,
    title: "15 Nights | Family Economy | Quad",
    route: ["JEDDAH", "MAKKAH", "MADINAH"],
    distances: { makkah: "700 m", madinah: "400 m" },
    price: 430
  }
];

const groupPackages = [
  {
    id: 301,
    title: "15 Days | Guided Group Tour",
    route: ["JEDDAH", "MAKKAH", "MADINAH"],
    features: ["Guided Ziyarat", "Scholars Included", "Bus Transport"],
    distances: { makkah: "900 m", madinah: "400 m" },
    price: 450
  },
  {
    id: 302,
    title: "20 Days | Family Group Pkg",
    route: ["JEDDAH", "MAKKAH", "MADINAH"],
    features: ["Private Bus", "Group Meals", "Dedicated Guide"],
    distances: { makkah: "1.5 KM", madinah: "600 m" },
    price: 490
  }
];

const popularPackages = [
  {
    id: 1,
    title: "10 Nights | Premium - T5 | Quad | Land Pkg",
    route: ["JEDDAH", "MAKKAH", "MADINAH"],
    inclusions: ["Visa", "Hotel"],
    distances: { makkah: "1.6 KM", madinah: "200 m" },
    basePrice: 507, 
    description: "Bin Aziz Tourism brings you a premium 10-night journey with top-tier accommodations in Makkah and Madinah."
  },
  {
    id: 2,
    title: "14 Nights | Economy - T3 | Quad | Land Pkg",
    route: ["JEDDAH", "MAKKAH", "MADINAH"],
    inclusions: ["Visa", "Hotel"],
    distances: { makkah: "800 m", madinah: "500 m" },
    basePrice: 420,
    description: "Enjoy comfortable stays within walking distance of the Haramain at an unbeatable value with our 14-night economy package."
  },
  {
    id: 3,
    title: "07 Nights | Express | Double | Flight Pkg",
    route: ["JEDDAH", "MAKKAH"],
    inclusions: ["Visa", "Hotel"],
    distances: { makkah: "100 m", madinah: "N/A" }, 
    basePrice: 850,
    description: "This 7-night express package by Bin Aziz Tourism focuses entirely on Makkah with premium double-sharing accommodations."
  }
];

app.get('/api/premium', (req, res) => {
  res.json(premiumPackages);
});

app.get('/api/economy', (req, res) => {
  res.json(economyPackages);
});

app.get('/api/group', (req, res) => {
  res.json(groupPackages);
});

app.get('/api/popular', (req, res) => {
  res.json(popularPackages);
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});