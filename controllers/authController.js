const jwt = require('jsonwebtoken');
const User = require('../models/User');

const loginUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: "Veuillez entrer un nom d'utilisateur et un mot de passe." });
  }

};

module.exports = { loginUser }; // S'assurer que la fonction est exportée
