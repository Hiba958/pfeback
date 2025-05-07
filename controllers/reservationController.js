const Reservation = require('../models/Reservation');
const Device = require('../models/Device');
const mongoose = require('mongoose');

// Function to get all reservations
const getAllReservations = async (req, res) => {
    try {
        console.log('Fetching all reservations...');
        const reservations = await Reservation.find()
            .populate({
                path: 'user',
                select: 'username' // Only select the username field
            })
            .populate({
                path: 'device',
                select: 'name' // Only select the name field
            })
            .sort({ createdAt: -1 }); // Sort by most recent first

        console.log('Found reservations:', reservations);
        res.status(200).json(reservations);
    } catch (error) {
        console.error('Error fetching all reservations:', error);
        res.status(500).json({ message: 'Error fetching reservations', error: error.message });
    }
};

// Function to check all existing reservations
const checkAllReservations = async () => {
    try {
        const reservations = await Reservation.find().populate('device').populate('user');
        console.log('All existing reservations:', reservations);
        return reservations;
    } catch (error) {
        console.error('Error checking all reservations:', error);
        return [];
    }
};

// Create a new reservation
const createReservation = async (req, res) => {
    try {
        const { deviceId } = req.body;
        const userId = req.user.userId;

        // Convert string IDs to ObjectId
        const deviceObjectId = new mongoose.Types.ObjectId(deviceId);
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Check if device exists
        const device = await Device.findById(deviceObjectId);
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        // Check for existing reservations
        const existingReservation = await Reservation.findOne({
            device: deviceObjectId,
            user: userObjectId,
            status: { $in: ['en_attente', 'validée'] }
        });

        if (existingReservation) {
            return res.status(400).json({ message: 'You already have a pending or active reservation for this device' });
        }

        // Create new reservation
        const reservation = new Reservation({
            device: deviceObjectId,
            user: userObjectId,
            status: 'en_attente'
        });

        await reservation.save();

        // Populate the device and user references before sending response
        const populatedReservation = await Reservation.findById(reservation._id)
            .populate('device')
            .populate('user');

        res.status(201).json({
            message: 'Reservation created successfully',
            reservation: populatedReservation
        });
    } catch (error) {
        console.error('Error creating reservation:', error);
        res.status(500).json({ message: 'Error creating reservation', error: error.message });
    }
};

// Get user's reservations
const getUserReservations = async (req, res) => {
    try {
        const userId = req.params.userId;
        const reservations = await Reservation.find({ user: userId })
            .populate('device')
            .populate('user');
        res.status(200).json(reservations);
    } catch (error) {
        console.error('Error fetching user reservations:', error);
        res.status(500).json({ message: 'Error fetching user reservations', error: error.message });
    }
};

// Update reservation status
const updateReservationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const reservation = await Reservation.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate('device').populate('user');

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.status(200).json({
            message: 'Reservation status updated successfully',
            reservation
        });
    } catch (error) {
        console.error('Error updating reservation status:', error);
        res.status(500).json({ message: 'Error updating reservation status', error: error.message });
    }
};

module.exports = {
    createReservation,
    getUserReservations,
    updateReservationStatus,
    getAllReservations,
    checkAllReservations
}; 
