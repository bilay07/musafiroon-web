import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true // Bilal Boss ka ek hi unique username hoga
  },
  email: { 
    type: String, 
    required: true, 
    unique: true // Email bhi unique hogi
  },
  password: { 
    type: String, 
    required: true // Ye encrypted password hoga
  }
}, { timestamps: true }); // Taake pata chale kab bana admin

export default mongoose.model('Admin', adminSchema);