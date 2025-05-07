const mongoose = require('mongoose');

const deviceSchema = mongoose.Schema({
    name: { type: String, required: true },
    reference: { type: String, required: true }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Device', deviceSchema);
