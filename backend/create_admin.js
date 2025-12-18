
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user_model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/event_orbit";

const createAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB...");

        const existing = await User.findOne({ role: 'admin' });
        if (existing) {
            console.log("Admin already exists:", existing.fullName);
        } else {
            await User.create({
                fullName: "Real Admin Name",
                email: "realadmin@eventorbit.com",
                password: "password123", // In real app, hash this!
                role: "admin",
                phone: "+1 555 000 0000",
                location: "San Francisco, CA"
            });
            console.log("Admin user created successfully!");
        }

        mongoose.disconnect();
    } catch (err) {
        console.error("Error creating admin:", err);
        mongoose.disconnect();
    }
};

createAdmin();
