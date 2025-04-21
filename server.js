const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Importe correctement les routes d'authentification
const userRoutes = require("./routes/userRoutes"); // Import des routes
const app = express(); // Déclaration de 'app'
const PORT = 5001; // Assure-toi que c'est le même port que dans ton fetch()
app.use(cors()); // Maintenant on peut utiliser cors()
app.use(express.json());
// Connexion à MongoDB

// URL de connexion MongoDB Atlas
const dbURI = 'mongodb+srv://hiba123:123@cluster0.ve37m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
;

// Se connecter à MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('✅ Connecté à MongoDB'))
.catch((error) => console.error('Erreur de connexion MongoDB:', error));

app.use('/api/devices', require('./routes/deviceRoutes'));
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.get('/', (req, res) => {
    res.send('pfe back is running !');
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);

}); 