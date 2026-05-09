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

// --- CORS FIX ---
app.use(cors({
  origin: ['https://mosafiroon.com', 'https://www.mosafiroon.com', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

app.use(express.json());

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected! 🎉"))
  .catch(err => console.log("Conn Error:", err));

// --- EMAIL TRANSPORTER ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: 'mosafiroon.info@gmail.com', pass: process.env.EMAIL_PASS || 'dummy_password' }
});

// --- PUBLIC ROUTES ---
app.get('/api/packages', async (req, res) => {
  try { res.json(await Package.find()); } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/premium', async (req, res) => {
  try { res.json(await Package.find({ category: 'premium' })); } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/economy', async (req, res) => {
  try { res.json(await Package.find({ category: 'economy' })); } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- ADMIN ROUTES ---
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

// (Baaki admin auth aur OTP routes yahan hain)
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied!" });
  try { req.user = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET); next(); } 
  catch (err) { res.status(400).json({ message: "Invalid Token!" }); }
};

app.post('/api/packages', verifyToken, async (req, res) => {
  const newPackage = new Package(req.body); await newPackage.save(); res.json({ message: "Added!" });
});
app.delete('/api/packages/:id', verifyToken, async (req, res) => {
  await Package.findByIdAndDelete(req.params.id); res.json({ message: "Deleted!" });
});

// ==========================================
// GEMINI AI CHATBOT ROUTE (STRICT PROFESSIONAL MODE)
// ==========================================
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return res.status(500).json({ reply: "API Key is missing from .env!" });

    const langInstruction = language === 'en' 
      ? "reply in highly professional English." 
      : "reply in natural and professional Roman Urdu.";

    // 👇 Yeh prompt usko lambi kahaniyan sunane se rokega
    const fullPrompt = `
      You are 'Maqsood', an expert Travel Consultant for 'Mosafiroon'.
      
      STRICT RULES:
      1. ALWAYS ${langInstruction}
      2. NEVER use formatting like **bold** or *italics*. Keep text plain.
      3. MAXIMUM LENGTH: 2 to 3 very short sentences. Be direct and to the point.
      4. DO NOT use long robotic greetings like "Aapka khair maqdam hai".
      5. Use standard dashes "-" if making a list. Do not use asterisks.
      6. For exact prices or deep details: "Mazeed tafseelat ke liye WhatsApp +92 311 2462949 par rabta karein."

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

    let responseText = data.candidates[0].content.parts[0].text;
    
    // 👇 Yeh line ghalti se aane wale saare ** aur * stars ko dho dho kar saaf kar degi!
    responseText = responseText.replace(/\*\*/g, '').replace(/\*/g, '');

    res.json({ reply: responseText.trim() });
    
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ reply: "Server error. Barae meharbani thori dair baad try karein." });
  }
});

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));