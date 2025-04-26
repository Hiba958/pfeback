const Device = require('../models/Device');

// Ajouter un nouvel objet connecté
const createDevice = async (req, res) => {
    try {
        const { name, reference ,  availability} = req.body;
        const newDevice = new Device({ name, reference, availability });
        await newDevice.save();
        res.status(201).json(newDevice);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout", error });
    }
};

// Récupérer tous les objets connectés
const getDevices = async (req, res) => {
    try {
        const devices = await Device.find();
        res.status(200).json(devices);
    } catch (error) {
        res.status(500).json({ message: "Erreur de récupération", error });
    }
};

// Supprimer un objet connecté
const deleteDevice = async (req, res) => {
    try {
        await Device.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Objet supprimé" });
    } catch (error) {
        res.status(500).json({ message: "Erreur de suppression", error });
    }
};


// Fonction pour mettre à jour la disponibilité d’un device
const updateAvailability = (req, res) => {
    const deviceId = req.params.id;
    const availability = req.body.availability;

    Device.findByIdAndUpdate(deviceId, { availability: availability }, { new: true })
        .then(updatedDevice => {
            res.json(updatedDevice);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la mise à jour de la disponibilité", error });
        });
};

module.exports = {
    createDevice,
    getDevices,
    deleteDevice,
    updateAvailability
};
