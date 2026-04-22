import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  route: [String],
  inclusions: [String],
  distances: {
    makkah: String,
    madinah: String
  },
  price: { type: Number, required: true },
  category: { type: String, enum: ['premium', 'economy', 'group', 'popular'], required: true }
});

const Package = mongoose.model('Package', packageSchema);
export default Package;