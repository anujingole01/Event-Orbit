import User from '../models/user_model.js';
import Event from '../models/event_model.js';
import Booking from '../models/booking_model.js';
import Review from '../models/review_model.js';

export const clearDatabase = async (req, res) => {
    try {
        await Promise.all([
            User.deleteMany({}),
            Event.deleteMany({}),
            Booking.deleteMany({}),
            Review.deleteMany({})
        ]);

        res.status(200).json({ message: 'Database cleared successfully' });
    } catch (error) {
        console.error('Error clearing database:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalOrganizers = await User.countDocuments({ role: 'organizer' });
        const totalEvents = await Event.countDocuments({});
        const pendingEvents = await Event.countDocuments({ status: 'pending' });

        // Calculate total revenue from confirmed bookings
        const bookings = await Booking.find({ status: 'confirmed' });
        const totalRevenue = bookings.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);

        // Chart Data (Mock or Basic Aggregation)
        // For now sending empty array or basic logic
        const chartData = [];

        res.status(200).json({
            totalUsers,
            totalOrganizers,
            totalEvents,
            pendingEvents,
            totalRevenue,
            chartData
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getPendingEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: 'pending' }).populate('organizer', 'fullName email');
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching pending events:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({}).populate('organizer', 'fullName email');
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching all events:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const updateEventStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        event.status = status;
        await event.save();

        res.status(200).json({ message: 'Event status updated', event });
    } catch (error) {
        console.error('Error updating event status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getAllOrganizers = async (req, res) => {
    try {
        const organizers = await User.find({ role: 'organizer' });
        res.status(200).json(organizers);
    } catch (error) {
        console.error('Error fetching organizers:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getAdminProfile = async (req, res) => {
    try {
        const admin = await User.findOne({ role: 'admin' }).select('-password');
        if (!admin) {
            return res.status(404).json({ message: 'Admin profile not found' });
        }
        res.status(200).json(admin);
    } catch (error) {
        console.error('Error fetching admin profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const updateAdminProfile = async (req, res) => {
    try {
        const { fullName, phone, location } = req.body;
        const admin = await User.findOne({ role: 'admin' });

        if (!admin) {
            return res.status(404).json({ message: 'Admin profile not found' });
        }

        if (fullName) admin.fullName = fullName;
        if (phone) admin.phone = phone;
        if (location) admin.location = location;

        await admin.save();

        res.status(200).json({ message: 'Profile updated successfully', admin });
    } catch (error) {
        console.error('Error updating admin profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
