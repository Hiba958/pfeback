const express = require('express');
const { createDevice, getDevices, deleteDevice } = require('../controllers/deviceController');
const router = express.Router();

router.post('/', createDevice); // Ajouter un capteur
router.get('/', getDevices);    // Lister les capteurs
router.delete('/:id', deleteDevice); // Supprimer un capteur
module.exports = router;
