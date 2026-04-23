import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import Package from './models/Package.js';
import Admin from './models/Admin.js'; 

dotenv.config();
const app = express(); // <-- Yehi wo line thi jo miss ho gayi thi!

// --- CORS FIX: VIP List for Frontend Domains ---
app.use(cors({
  origin: ['https://mosafiroon.com', 'https://www.mosafiroon.com', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

app.use(express.json());

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected! 🎉"))
  .catch(err => console.log("Conn Error:", err));

// --- EMAIL TRANSPORTER SETUP (For OTP) ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mosafiroon.info@gmail.com',
    pass: process.env.EMAIL_PASS || 'dummy_password' 
  }
});

// ==========================================
// 1. PUBLIC ROUTES (Har koi dekh sakta hai)
// ==========================================
app.get('/api/packages', async (req, res) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/premium', async (req, res) => {
  try {
    const packages = await Package.find({ category: 'premium' });
    res.json(packages);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/economy', async (req, res) => {
  try {
    const packages = await Package.find({ category: 'economy' });
    res.json(packages);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ==========================================
// 2. ADMIN LOGIN & OTP ROUTES (No Token Needed)
// ==========================================
app.post('/api/admin/login', async (req, res) => {
  const { identifier, password } = req.body; 
  try {
    const admin = await Admin.findOne({ $or: [{ email: identifier }, { username: identifier }] });
    if (!admin) return res.status(401).json({ success: false, message: "User nahi mila! 🛑" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Ghalat Password! ❌" });

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ success: true, token, role: admin.role, admin: { username: admin.username, email: admin.email } });
  } catch (err) { res.status(500).json({ message: "Server Error!" }); }
});

// FORGOT PASSWORD - Send OTP
app.post('/api/admin/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Admin.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "Email not found!" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 mins valid
    await user.save();

    const mailOptions = {
      from: 'mosafiroon.info@gmail.com',
      to: email,
      subject: 'Mosafiroon - Password Reset OTP',
      text: `Aapka password reset OTP hai: ${otp}. Ye 10 minute tak valid hai.`
    };

    console.log(`[DEV MODE] OTP for ${email}: ${otp}`); // Testing ke liye console mein
    try { await transporter.sendMail(mailOptions); } catch(e) { console.log("Email failed, but OTP is in console."); }
    
    res.json({ success: true, message: "OTP Sent to Email!" });
  } catch (err) { res.status(500).json({ success: false, message: "Server Error" }); }
});

// RESET PASSWORD - Verify OTP
app.post('/api/admin/reset-password-otp', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await Admin.findOne({ email, resetOtp: otp, otpExpiry: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ success: false, message: "Invalid or Expired OTP!" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    
    res.json({ success: true, message: "Password updated successfully!" });
  } catch (err) { res.status(500).json({ success: false, message: "Server Error" }); }
});

// ==========================================
// 3. SECURITY MIDDLEWARE (Guard)
// ==========================================
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied! Token missing." });

  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) { res.status(400).json({ message: "Invalid Token!" }); }
};

// ==========================================
// 4. SECURE ADMIN ROUTES (Sirf Login ke baad chalenge)
// ==========================================
// Packages Manage Karna
app.post('/api/packages', verifyToken, async (req, res) => {
  const newPackage = new Package(req.body);
  await newPackage.save();
  res.json({ message: "Added!" });
});

app.delete('/api/packages/:id', verifyToken, async (req, res) => {
  await Package.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted!" });
});

// Users Manage Karna (Sirf Superadmin ke liye)
app.get('/api/admin/users', verifyToken, async (req, res) => {
  try {
    // Sirf 'user' role walo ko layega, superadmin khud ko nahi dekhega list mein
    const users = await Admin.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (err) { res.status(500).json({ message: "Error fetching users" }); }
});

app.delete('/api/admin/users/:id', verifyToken, async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User Deleted!" });
  } catch (err) { res.status(500).json({ message: "Error deleting user" }); }
});

app.post('/api/admin/register', verifyToken, async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, email, password: hashedPassword, role: 'user' });
    await newAdmin.save();
    res.json({ success: true, message: "User Created!" });
  } catch (err) { res.status(500).json({ success: false, message: "Username/Email already exists!" }); }
});

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));