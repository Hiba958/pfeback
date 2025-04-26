const Reservation = require('../models/Reservation');
const Device = require('../models/Device');

exports.createReservation = async (req, res) => {
  const { deviceId, userId } = req.body;

  try {
    // Vérifie que le capteur existe
    const device = await Device.findById(deviceId);

    if (!device) {
      return res.status(404).json({ message: 'Capteur non trouvé.' });
    }

    // Vérifie si le capteur est disponible
    if (device.status !== 'disponible') {
      return res.status(400).json({ message: 'Capteur non disponible.' });
    }

    // Crée une nouvelle demande de réservation
    const newReservation = new Reservation({
      device: deviceId,
      user: userId,
    });

    await newReservation.save();

    // Mets à jour le statut du capteur
    device.status = 'réservé';
    await device.save();

    // Envoie une réponse de succès au frontend
    res.status(201).json({ message: 'Demande de réservation envoyée à l\'admin.' });
  } catch (error) {
    console.error('Erreur serveur lors de la réservation :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la réservation.' });
  }
};
exports.getReservations = async (req, res) => {
  try {
    // Récupère toutes les réservations en attente
    const reservations = await Reservation.find({ status: 'en attente' }).populate('device').populate('user');
    res.status(200).json(reservations);
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des réservations.' });
  }
};

exports.updateReservationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'accepté' ou 'refusé'

  try {
    // Trouve la réservation par ID
    const reservation = await Reservation.findById(id);
    
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée.' });
    }

    // Si l'admin accepte la réservation, on met à jour le statut du capteur
    if (status === 'accepté') {
      const device = await Device.findById(reservation.device);
      device.status = 'réservé';
      await device.save();
      reservation.status = 'accepté';
    } else if (status === 'refusé') {
      reservation.status = 'refusé';
    }

    // Enregistre les changements
    await reservation.save();
    
    // Envoie une réponse au frontend
    res.status(200).json({ message: 'Réservation mise à jour avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de réservation :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour.' });
  }
};
exports.getUserReservations = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Trouve toutes les réservations de l'utilisateur spécifié
    const reservations = await Reservation.find({ user: userId, status: 'accepté' }).populate('device');
    
    if (!reservations || reservations.length === 0) {
      return res.status(404).json({ message: 'Aucune réservation trouvée.' });
    }

    res.status(200).json(reservations);
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations de l\'utilisateur :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des réservations.' });
  }
};