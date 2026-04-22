import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from './models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB... 🔌");

    // Pehle purana koi admin hai to usey clear kar dete hain (Optional)
    await Admin.deleteMany({});

    // Password ko "Hash" (Khufiya) kar rahe hain
    const hashedPassword = await bcrypt.hash("boss123", 10);

    const newAdmin = new Admin({
      username: "bilal_boss",
      email: "admin@musafiroon.com",
      password: hashedPassword
    });

    await newAdmin.save();
    console.log("Admin Created Successfully! 👑");
    console.log("Username: bilal_boss");
    console.log("Email: admin@musafiroon.com");
    console.log("Password: boss123");

    process.exit();
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();