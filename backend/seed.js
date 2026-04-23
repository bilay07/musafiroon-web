import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Package from './models/Package.js';
import Admin from './models/Admin.js'; 

dotenv.config();

const packages = [
  // --- PREMIUM PACKAGES (9) ---
  { title: "10 Nights | Premium - T5 | Quad", route: ["JEDDAH", "MAKKAH", "MADINAH"], inclusions: ["Visa", "Hotel", "Transport"], distances: { makkah: "100 m", madinah: "50 m" }, price: 507, category: "premium" },
  { title: "14 Nights | VIP Premium | Double", route: ["JEDDAH", "MAKKAH", "MADINAH"], inclusions: ["Visa", "Hotel", "Transport"], distances: { makkah: "0 m", madinah: "0 m" }, price: 850, category: "premium" },
  { title: "07 Nights | Express Premium | Double", route: ["JEDDAH", "MAKKAH"], inclusions: ["Visa", "Hotel", "Transport"], distances: { makkah: "50 m", madinah: "N/A" }, price: 700, category: "premium" },
  { title: "15 Nights | Executive | Triple", route: ["JEDDAH", "MAKKAH", "MADINAH"], inclusions: ["Visa", "Hotel", "Transport"], distances: { makkah: "150 m", madinah: "100 m" }, price: 901, category: "premium" },
  { title: "20 Nights | Premium Plus | Quad", route: ["JEDDAH", "MAKKAH", "MADINAH"], inclusions: ["Visa", "Hotel", "Transport"], distances: { makkah: "200 m", madinah: "150 m" }, price: 1100, category: "premium" },
  { title: "12 Nights | Royal Suite | Double", route: ["JEDDAH", "MAKKAH", "MADINAH"], inclusions: ["Visa", "Hotel", "Transport"], distances: { makkah: "0 m", madinah: "0 m" }, price: 1500, category: "premium" },
  { title: "08 Nights | Short Premium | Triple", route: ["JEDDAH", "MAKKAH", "MADINAH"], inclusions: ["Visa", "Hotel", "Transport"], distances: { makkah: "100 m", madinah: "100 m" }, price: 600, category: "premium" },
  { title: "21 Nights | Elite Package | Quad", route: ["JEDDAH", "MAKKAH", "MADINAH"], inclusions: ["Visa", "Hotel", "Transport"], distances: { makkah: "250 m", madinah: "200 m" }, price: 1250, category: "premium" },
  { title: "10 Nights | Golden Class | Double", route: ["JEDDAH", "MAKKAH", "MADINAH"], inclusions: ["Visa", "Hotel", "Transport"], distances: { makkah: "50 m", madinah: "50 m" }, price: 750, category: "premium" },

  // --- ECONOMY PACKAGES (12) ---
  { title: "14 Nights | Economy - T3 | Quad", route: ["JEDDAH", "MAKKAH", "MADINAH"], inclusions: ["Visa", "Hotel", "Transport"], distances: { makkah: "800 m", madinah: "500 m" }, price: 420, category: "economy" },
  { title: "21 Nights | Super Saver | Quint", route: ["JEDDAH", "MAKKAH", "MADINAH"], inclusions: ["Visa", "Hotel", "Transport"], distances: { makkah: "1.2 KM", madinah: "800 m" }, price: 380, category: "economy" },
  { title: "10 Nights | Budget Umrah | Triple", route: ["JEDDAH", "MAKKAH", "MADINAH"], inclusions: ["Visa", "Hotel", "Transport"], distances: { makkah: "900 m", madinah: "600 m" }, price: 350, category: "economy" },
  { title: "15 Nights | Standard Economy | Quad", route: ["JEDDAH", "MAKKAH", "MADINAH"], inclusions: ["Visa", "Hotel", "Transport"], distances: { makkah: "750 m", madinah: "450 m" }, price: 440, category: "economy" },
  { title: "07 Nights | Quick Economy | Double", route: ["JEDDAH", "MAKKAH"], inclusions: ["Visa", "Hotel", "Transport"], distances: { makkah: "800 m", madinah: "N/A" }, price: 300, category: "economy" },
  { title: "28 Nights | Ramzan Saver | Hexa", route: ["JEDDAH", "MAKKAH", "MADINAH"], inclusions: ["Visa", "Hotel", "Transport"], distances: { makkah: "1.5 KM", madinah: "1 KM" }, price: 490, category: "economy" },
  { title: "12 Nights | Economy Plus | Triple", route: ["JEDDAH", "MAKKAH", "MADINAH"], inclusions: ["Visa", "Hotel", "Transport"], distances: { makkah: "600 m", madinah: "400 m" }, price: 460, category: "economy" },
  { title: "20 Nights | Extended Stay | Quad", route: ["JEDDAH", "MAKKAH", "MADINAH"], inclusions: ["Visa", "Hotel", "Transport"], distances: { makkah: "1 KM", madinah: "700 m" }, price: 410, category: "economy" },
  { title: "14 Nights | Value Package | Double", route: ["JEDDAH", "MAKKAH", "MADINAH"], inclusions: ["Visa", "Hotel", "Transport"], distances: { makkah: "900 m", madinah: "500 m" }, price: 480, category: "economy" },
  { title: "10 Nights | Basic Economy | Quint", route: ["JEDDAH", "MAKKAH", "MADINAH"], inclusions: ["Visa", "Hotel", "Transport"], distances: { makkah: "1.2 KM", madinah: "800 m" }, price: 320, category: "economy" },
  { title: "08 Nights | Short Saver | Triple", route: ["JEDDAH", "MAKKAH", "MADINAH"], inclusions: ["Visa", "Hotel", "Transport"], distances: { makkah: "850 m", madinah: "500 m" }, price: 340, category: "economy" },
  { title: "15 Nights | Family Economy | Quad", route: ["JEDDAH", "MAKKAH", "MADINAH"], inclusions: ["Visa", "Hotel", "Transport"], distances: { makkah: "700 m", madinah: "400 m" }, price: 430, category: "economy" },

  // --- GROUP PACKAGES (2) ---
  { title: "15 Days | Guided Group Tour", route: ["JEDDAH", "MAKKAH", "MADINAH"], inclusions: ["Guided Ziyarat", "Scholars Included"], distances: { makkah: "900 m", madinah: "400 m" }, price: 450, category: "group" },
  { title: "20 Days | Family Group Pkg", route: ["JEDDAH", "MAKKAH", "MADINAH"], inclusions: ["Private Bus", "Group Meals"], distances: { makkah: "1.5 KM", madinah: "600 m" }, price: 490, category: "group" },

  // --- POPULAR PACKAGES (3) ---
  { title: "10 Nights | Premium - T5 | Quad", route: ["JEDDAH", "MAKKAH", "MADINAH"], price: 507, inclusions: ["Visa", "Hotel", "Transport"], distances: { makkah: "1.6 KM", madinah: "200 m" }, category: "popular" },
  { title: "14 Nights | Economy - T3 | Quad", route: ["JEDDAH", "MAKKAH", "MADINAH"], price: 420, inclusions: ["Visa", "Hotel", "Transport"], distances: { makkah: "800 m", madinah: "500 m" }, category: "popular" },
  { title: "07 Nights | Express | Double", route: ["JEDDAH", "MAKKAH"], price: 850, inclusions: ["Visa", "Hotel", "Transport"], distances: { makkah: "100 m", madinah: "N/A" }, category: "popular" }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // 1. Seed Packages
    await Package.deleteMany({}); 
    await Package.insertMany(packages);
    console.log("✅ Packages Seeded Successfully!");

    // 2. Seed Admin
    await Admin.deleteMany({});
    const hashedPassword = await bcrypt.hash('mosafiroon.7', 10);
    const newAdmin = new Admin({
      username: 'mosafiroon7',
      email: 'mosafiroon.info@gmail.com',
      password: hashedPassword
    });
    await newAdmin.save();
    console.log("✅ Admin Seeded Successfully! (mosafiroon7)");

    console.log("🎉 All Data Seeded! Aapka system bilkul ready hai!");
    process.exit();
  } catch (err) {
    console.error("Seed error: ", err);
    process.exit(1);
  }
};

seedDB();