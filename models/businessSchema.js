const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    companyName: {
        type: String,
        required: true,
    },
    companyBank: {
        type: String,
        required: true,
    },
    companyDocument: {
        type: String,
        required: true,
    },
    companyDocumentOriginalName: {
        type: String,
    },
    companyDocumentMimeType: {
        type: String,
    },
    companyDocumentSize: {
        type: Number,
    },
    // Add other fields as necessary
});

module.exports = mongoose.model('Business', businessSchema);
