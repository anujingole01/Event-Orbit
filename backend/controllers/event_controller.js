import Event from "../models/event_model.js";

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getAllEvents = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
        $or: [
          { title: { $regex: req.query.search, $options: "i" } },
          { description: { $regex: req.query.search, $options: "i" } },
          { category: { $regex: req.query.search, $options: "i" } },
          { location: { $regex: req.query.search, $options: "i" } },
        ],
      }
      : {};

    const events = await Event.find({ ...keyword, status: "approved" })
      .populate("organizer", "fullName");

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Organizer)
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      venue,
      date,
      category,
      description,
      banner,
      price,
      seatMap
    } = req.body;

    // Basic Validation
    if (!title || !description || !date || !venue) {
      return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    const event = new Event({
      title,
      organizer: req.user ? req.user._id : "6753457a1234567890abcdef", // Fallback to dummy ID if no auth
      venue,
      date,
      category,
      description,
      banner, // Assuming URL for now
      price,
      seatMap,
      status: "approved" // Defaulting to approved for now to simplify flow
    });

    const createdEvent = await event.save();

    res.status(201).json({
      success: true,
      event: createdEvent
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error creating event" });
  }
};
