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
  category: { type: String, enum: ['premium', 'economy', 'group', 'popular'], required: true },
  month: { type: String, default: 'All Months*' },
  roomType: { type: String, default: 'Double' },
  image: { type: String, default: '' },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  reviewCount: { type: Number, default: 50 }
});

const Package = mongoose.model('Package', packageSchema);
export default Package;