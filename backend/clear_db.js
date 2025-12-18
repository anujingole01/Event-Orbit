
import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "./models/event_model.js";
import User from "./models/user_model.js";
import Booking from "./models/booking_model.js";
import Review from "./models/review_model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/event_orbit";

const clearDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB for clearing...");

        console.log("Clearing Events...");
        await Event.deleteMany({});

        console.log("Clearing Users...");
        await User.deleteMany({});

        console.log("Clearing Bookings...");
        await Booking.deleteMany({});

        console.log("Clearing Reviews...");
        await Review.deleteMany({});

        console.log("All data cleared successfully!");

        mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error("Clearing failed:", err);
        mongoose.disconnect();
        process.exit(1);
    }
};

clearDB();
