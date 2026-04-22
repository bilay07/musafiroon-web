import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Package from './models/Package.js';
import Admin from './models/Admin.js'; 

dotenv.config();
const app = express();

// --- 1. CORS FIX: VIP List for Frontend Domains ---
app.use(cors({
  origin: ['https://mosafiroon.com', 'https://www.mosafiroon.com', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected! 🎉"))
  .catch(err => console.log("Conn Error:", err));

// --- PUBLIC ROUTES (Har koi dekh sakta hai) ---
app.get('/api/packages', async (req, res) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- 2. NEW ROUTES: Premium aur Economy Packages ke liye ---
app.get('/api/premium', async (req, res) => {
  try {
    const packages = await Package.find({ category: 'premium' });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/economy', async (req, res) => {
  try {
    const packages = await Package.find({ category: 'economy' });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- HEAVY ADMIN LOGIN (Email YA Username dono se) ---
app.post('/api/admin/login', async (req, res) => {
  const { identifier, password } = req.body; 

  try {
    const admin = await Admin.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });

    if (!admin) {
      return res.status(401).json({ success: false, message: "Admin nahi mila! 🛑" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Ghalat Password! ❌" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
    
    res.json({ 
      success: true, 
      token, 
      admin: { username: admin.username, email: admin.email } 
    });

  } catch (err) {
    res.status(500).json({ message: "Server Error!" });
  }
});

// --- SECURITY MIDDLEWARE (Guard) ---
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied! Token missing." });

  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token!" });
  }
};

// --- SECURE ADMIN ROUTES (Sirf Login ke baad chalenge) ---
app.post('/api/packages', verifyToken, async (req, res) => {
  const newPackage = new Package(req.body);
  await newPackage.save();
  res.json({ message: "Added!" });
});

app.delete('/api/packages/:id', verifyToken, async (req, res) => {
  await Package.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));