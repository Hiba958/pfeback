const mongoose = require('mongoose');

const deviceSchema = mongoose.Schema({
    name: { type: String, required: true },
    reference: { type: String, required: true },
    status: {
        type: String,
        enum: ['disponible', 'réservé'],
        default: 'disponible'
    }
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);
