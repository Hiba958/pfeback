const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
  createReservation,
  getReservations,
  updateReservationStatus,
  getUserReservations
} = require('../controllers/reservationController');

// USER crée une demande
router.post('/', auth, createReservation);
router.get('/reservations', getReservations); // Récupère toutes les réservations
router.put('/reservations/:id', updateReservationStatus); // Accepter ou refuser une réservation
router.get('/user/:userId/reservations', getUserReservations); // Récupère les réservations d'un utilisateur

module.exports = router;
