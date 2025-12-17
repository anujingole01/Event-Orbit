import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String },
  profilePic: { type: String },
  role: { type: String, default: "user", enum: ["user", "organizer", "admin"] },
  walletBalance: { type: Number, default: 0 },
  kycStatus: { type: String, enum: ['pending', 'approved', 'rejected', 'not_submitted'], default: 'not_submitted' },
  kycDocuments: [
    {
      docType: { type: String },
      filePath: { type: String },
      originalName: { type: String },
      uploadedAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

export default mongoose.model("User", userSchema);
