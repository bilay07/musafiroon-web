import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true // Bilal Boss ya sub-users ka unique username hoga
  },
  email: { 
    type: String, 
    required: true, 
    unique: true // Email bhi unique hogi
  },
  password: { 
    type: String, 
    required: true // Ye encrypted password hoga
  },
  
  // --- NAYE FIELDS (Role aur Advanced OTP ke liye) ---
  role: { 
    type: String, 
    default: 'user' // Default sub-user banega, sirf tumhara account 'superadmin' hoga
  },
  resetOtp: { 
    type: String // 6-digit OTP save karne ke liye
  },
  otpExpiry: { 
    type: Date // OTP kab expire hoga (e.g., 10 minutes baad)
  }
  
}, { timestamps: true }); // Taake pata chale kab bana admin

export default mongoose.model('Admin', adminSchema);