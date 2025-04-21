const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Définir le schéma utilisateur
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: { 
      type: String, 
      default: 'User' },
});

// Middleware avant la sauvegarde pour hasher le mot de passe
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Créer le modèle à partir du schéma
const User = mongoose.model('User', userSchema);

module.exports = User;
