const User = require("../models/User");

// 📌 Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err });
    }
};

// 📌 Ajouter un utilisateur
// exports.createUser = async (req, res) => {
//     try {
//         const { name } = req.body;
        
//         if (!name) return res.status(400).json({ message: "Nom requis" });

//         const newUser = new User({username: name });
//         await newUser.save();
//         res.status(201).json(newUser);
//         console.log(name+" added successfully");
        
//     } catch (err) {
//         res.status(500).json({ message: "Erreur serveur", error: err });
//     }
// };

// 📌 Supprimer un utilisateur par ID
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.json({ message: "Utilisateur supprimé", user: deletedUser });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err });
    }
};
