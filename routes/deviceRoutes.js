const express = require('express');
const deviceController = require('../controllers/deviceController');
const router = express.Router();

router.post('/', deviceController.createDevice); // Ajouter un capteur
router.get('/', deviceController.getDevices);    // Lister les capteurs
router.delete('/:id', deviceController.deleteDevice); // Supprimer un capteur

module.exports = router;
