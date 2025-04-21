const express = require('express');
const User = require('../models/User'); // Modèle User
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const router = express.Router();
// Route pour récupérer tous les utilisateurs (sans mot de passe)
router.get("/users", async (req, res) => {
  try {
      const users = await User.find({}, { password: 0 });
      res.status(200).json(users);
  } catch (error) {
      res.status(500).json({ message: "❌ Erreur serveur", error });
  }
});

// Route pour l'inscription (Sign Up)
router.post('/signup', async (req, res) => {
  const { username, password, role } = req.body;

  // Vérifie si l'utilisateur existe déjà
  const existingUser = await User.findOne({ username });
  if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
  }

  // Créer un nouvel utilisateur
  const newUser = new User({
      username,
      password,
      role: role || 'User' // Par défaut 'User' si aucun rôle n'est spécifié
  });

  try {
      await newUser.save();
      res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur lors de la création de l\'utilisateur' });
  }
});

// Route pour la connexion (Login)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      const user = await User.findOne({ username });

      if (!user) {
          return res.status(404).json({ message: 'Utilisateur introuvable' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
          return res.status(400).json({ message: 'Mot de passe incorrect' });
      }

      // Créer un JWT avec l'ID de l'utilisateur et son rôle
      const token = jwt.sign({ userId: user._id, role: user.role }, 'secret_key', { expiresIn: '1h' });

      // Retourner le token dans la réponse
      res.status(200).json({
          message: 'Connexion réussie',
          token: token // Le token contient l'ID et le rôle
      });
  } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error });
  }
});
// Route pour ajouter un utilisateur
router.post('/add-user', async (req, res) => {
    const { username, password, role } = req.body;
  
    try {
      // Vérifie si l'utilisateur existe déjà
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'L\'utilisateur existe déjà.' });
      }
  
      // Crée un nouvel utilisateur
      const newUser = new User({
        username,
        password, // Le mot de passe sera hashé automatiquement dans le pré-save
        role
      });
  
      // Sauvegarde l'utilisateur dans la base de données
      await newUser.save();
      res.status(201).json({ message: 'Utilisateur créé avec succès.' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur du serveur', error });
    }
  });

module.exports = router;
