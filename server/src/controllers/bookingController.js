import { Booking } from '../models/Booking.js';
import { Worker } from '../models/Worker.js';
import { logger } from '../utils/logger.js';

/**
 * @desc    Create a new booking (On-Demand Request)
 * @route   POST /api/bookings
 */
export const createBooking = async (req, res) => {
  try {
    const { category, description, location, scheduledTime } = req.body;

    if (!category || !description || !location || !scheduledTime) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const booking = await Booking.create({
      customerId: req.user.id,
      category,
      description,
      location,
      scheduledTime
    });

    // Simulate worker acceptance after 10 seconds
    setTimeout(async () => {
      try {
        // Find a random worker that matches the category (or just any active worker for simulation)
        const workers = await Worker.find({ status: 'Active' });
        if (workers.length > 0) {
          const randomWorker = workers[Math.floor(Math.random() * workers.length)];
          await Booking.findByIdAndUpdate(booking._id, {
            status: 'Accepted',
            assignedWorker: randomWorker._id
          });
          logger.info(`Simulated worker acceptance for booking ${booking._id} by worker ${randomWorker._id}`);
        }
      } catch (err) {
        logger.error('Error in simulated worker acceptance', err);
      }
    }, 10000);

    res.status(201).json({
      success: true,
      message: 'Booking created and searching for a worker',
      data: booking
    });
  } catch (error) {
    logger.error('Error creating booking', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 * @desc    Get current user's bookings
 * @route   GET /api/bookings
 */
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.id })
      .populate('assignedWorker', 'displayName profilePhoto averageRating')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: bookings
    });
  } catch (error) {
    logger.error('Error fetching bookings', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 * @desc    Cancel a booking
 * @route   PUT /api/bookings/:id/cancel
 */
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, customerId: req.user.id });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status === 'Cancelled' || booking.status === 'Completed') {
      return res.status(400).json({ success: false, message: 'Cannot cancel a booking that is already completed or cancelled' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    logger.error('Error cancelling booking', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
