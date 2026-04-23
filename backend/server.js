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

// --- SECURE: ADD NEW ADMIN USER ---
app.post('/api/admin/register', verifyToken, async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, email, password: hashedPassword });
    await newAdmin.save();
    res.json({ success: true, message: "User Created!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Username/Email already exists!" });
  }
});

// --- SECURE: RESET PASSWORD (Sirf mosafiroon.info@gmail.com ke liye) ---
app.post('/api/admin/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  
  // Security Check: Sirf is exact email walay ka password badlega
  if (email !== 'mosafiroon.info@gmail.com') {
    return res.status(403).json({ success: false, message: "Unauthorized Request!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Find exact admin user and update password
    const updatedAdmin = await Admin.findOneAndUpdate(
      { email: 'mosafiroon.info@gmail.com' }, 
      { password: hashedPassword }
    );
    
    if (!updatedAdmin) return res.status(404).json({ success: false, message: "Main Admin account not found!" });
    
    res.json({ success: true, message: "Password updated successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));