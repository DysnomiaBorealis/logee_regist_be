// controllers/businessController.js

const Business = require('../models/businessSchema');
const { validationResult } = require('express-validator');
const fs = require('fs');
const axios = require('axios');

// Register Business
exports.registerBusiness = async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (req.file) {
            try {
                await fs.promises.unlink(req.file.path);
            } catch (fileErr) {
                console.error('Error deleting file:', fileErr);
            }
        }
        return res.status(400).json({ errors: errors.array() });
    }

    const { companyName, companyBank, companyRegistrationNumber } = req.body;
    const companyDocument = req.file ? req.file.filename : null;

    try {
        // Use a placeholder API URL (since we don't have an actual API endpoint)
        const apiUrl = `https://placeholder-api.example.com/verify/${companyRegistrationNumber}`;

        // Make the Axios GET request
        const apiResponse = await axios.get(apiUrl);

        // Since the API doesn't exist, the request will fail, and we'll catch the error
        // If the request succeeds, we can check apiResponse.data to determine validity

        // Proceed based on the API response (this code won't be reached without a real API)
        if (!apiResponse.data.isValid) {
            // If invalid, delete the uploaded file and return an error
            if (req.file) {
                try {
                    await fs.promises.unlink(req.file.path);
                } catch (fileErr) {
                    console.error('Error deleting file:', fileErr);
                }
            }
            return res.status(400).json({ msg: 'Invalid Company Registration Number' });
        }

        // Proceed to save the business since the company is valid
        const newBusiness = new Business({
            user: req.user.id,
            companyName,
            companyBank,
            companyRegistrationNumber,
            companyDocument,
            companyDocumentOriginalName: req.file ? req.file.originalname : null,
            companyDocumentMimeType: req.file ? req.file.mimetype : null,
            companyDocumentSize: req.file ? req.file.size : null,
        });

        const business = await newBusiness.save();

        res.json(business);
    } catch (err) {
        // Handle errors from the Axios call
        console.error('Error during company verification:', err.message);

        // Since the Axios call failed, we'll proceed without verification during development
        // In production, you should handle this differently

        // Proceed to save the business without verification
        const newBusiness = new Business({
            user: req.user.id,
            companyName,
            companyBank,
            companyRegistrationNumber,
            companyDocument,
            companyDocumentOriginalName: req.file ? req.file.originalname : null,
            companyDocumentMimeType: req.file ? req.file.mimetype : null,
            companyDocumentSize: req.file ? req.file.size : null,
        });

        const business = await newBusiness.save();

        res.json(business);
    }
};

// Get Business Details
exports.getBusiness = async (req, res) => {
    try {
        const businesses = await Business.find({ user: req.user.id });
        res.json(businesses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update Business Information
exports.updateBusiness = async (req, res) => {
    const { companyName, companyBank } = req.body;

    // Build business object
    const businessFields = {};
    if (companyName) businessFields.companyName = companyName;
    if (companyBank) businessFields.companyBank = companyBank;

    try {
        let business = await Business.findOne({ user: req.user.id });

        if (!business) {
            return res.status(404).json({ msg: 'Business not found' });
        }

        business = await Business.findOneAndUpdate(
            { user: req.user.id },
            { $set: businessFields },
            { new: true }
        );

        res.json(business);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete Business
exports.deleteBusiness = async (req, res) => {
    try {
        const business = await Business.findOne({ user: req.user.id });

        if (!business) {
            return res.status(404).json({ msg: 'Business not found' });
        }

        await Business.findOneAndRemove({ user: req.user.id });

        res.json({ msg: 'Business removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
