const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
  status: { type: String, enum: ['en_attente', 'validée', 'refusée'], default: 'en_attente' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reservation', reservationSchema);
