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
const app = express();

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
// 1. PUBLIC ROUTES
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
// 2. ADMIN LOGIN & OTP ROUTES
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

app.post('/api/admin/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Admin.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "Email not found!" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; 
    await user.save();

    const mailOptions = {
      from: 'mosafiroon.info@gmail.com',
      to: email,
      subject: 'Mosafiroon - Password Reset OTP',
      text: `Aapka password reset OTP hai: ${otp}. Ye 10 minute tak valid hai.`
    };

    console.log(`[DEV MODE] OTP for ${email}: ${otp}`); 
    try { await transporter.sendMail(mailOptions); } catch(e) { console.log("Email failed, but OTP is in console."); }
    
    res.json({ success: true, message: "OTP Sent to Email!" });
  } catch (err) { res.status(500).json({ success: false, message: "Server Error" }); }
});

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
// 3. SECURITY MIDDLEWARE
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
// 4. SECURE ADMIN ROUTES
// ==========================================
app.post('/api/packages', verifyToken, async (req, res) => {
  const newPackage = new Package(req.body);
  await newPackage.save();
  res.json({ message: "Added!" });
});

app.delete('/api/packages/:id', verifyToken, async (req, res) => {
  await Package.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted!" });
});

app.get('/api/admin/users', verifyToken, async (req, res) => {
  try {
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

// ==========================================
// 5. 🔍 DIAGNOSTIC ROUTE 
// ==========================================
app.get('/api/check-models', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 6. GEMINI AI CHATBOT ROUTE (Bilingual & Professional)
// ==========================================
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language } = req.body; // Frontend se aane wali zaban pakri
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ reply: "API Key Missing!" });
    }

    // Zaban ke hisab se hidayat change ki
    const langInstruction = language === 'en' 
      ? "ALWAYS reply in highly professional English." 
      : "ALWAYS reply in highly professional Roman Urdu (Urdu written in English alphabets).";

    const defaultContactMsg = language === 'en'
      ? "For exact pricing and more details, please contact us on WhatsApp: +92 311 2462949."
      : "Mazeed tafseelat aur exact pricing ke liye baraye meharbani hamare WhatsApp +92 311 2462949 par rabta karein.";

    const fullPrompt = `
      You are an expert, highly professional, and polite Travel Consultant for 'Mosafiroon' (Bin Aziz Tourism & Consultants).
      
      EXTREMELY STRICT RULES:
      1. ${langInstruction}
      2. Be concise and TO THE POINT. Your answer MUST NOT exceed 2 to 3 short sentences.
      3. Use maximum 3 short bullet points (1-2 words each) ONLY if listing items or explaining multiple things. NO LONG PARAGRAPHS.
      4. Maintain a highly professional and respectful tone. DO NOT use robotic phrases like "Aapka sawal behtareen hai" or "Aapka khair maqdam hai".
      5. If asked about exact prices, specific dates, or complex details, politely reply EXACTLY with this: "${defaultContactMsg}"

      User Question: ${message}
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Google API Error:", data);
      throw new Error(data.error?.message || "Google API Error");
    }

    const responseText = data.candidates[0].content.parts[0].text;
    res.json({ reply: responseText });
    
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ reply: "Server error. Barae meharbani thori dair baad try karein." });
  }
});

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));