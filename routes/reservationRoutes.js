const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
    createReservation,
    getUserReservations,
    updateReservationStatus,
    getAllReservations
} = require('../controllers/reservationController');

// Get all reservations
router.get('/', auth, getAllReservations);

// Create a new reservation
router.post('/', auth, createReservation);

// Get user's reservations
router.get('/user/:userId', auth, getUserReservations);

// Update reservation status
router.put('/:id', auth, updateReservationStatus);

module.exports = router;
