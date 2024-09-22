// routes/business.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');
const multer = require('multer');
const path = require('path');
const {
    registerBusiness,
    getBusiness,
    updateBusiness,
    deleteBusiness,
} = require('../controllers/businessController');

// Set up storage engine for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// File filter to accept only specific file types
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, JPEG, and PNG are allowed.'));
    }
};

// Initialize upload variable
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
    fileFilter: fileFilter,
});

// Business Registration Route with Validation
router.post(
    '/register',
    auth,
    upload.single('companyDocument'),
    [
        check('companyName', 'Company Name is required').notEmpty(),
        check('companyBank', 'Company Bank details are required').notEmpty(),
        check('companyRegistrationNumber', 'Company Registration Number is required').notEmpty(),
    ],
    registerBusiness
);

// Get Business Details
router.get('/', auth, getBusiness);

// Update Business Information
router.put(
    '/',
    auth,
    [
        check('companyName', 'Company Name is required').notEmpty(),
        check('companyBank', 'Company Bank details are required').notEmpty(),
    ],
    updateBusiness
);

// Delete Business
router.delete('/', auth, deleteBusiness);

// Error handling middleware for Multer
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        res.status(400).json({ errors: [{ msg: err.message }] });
    } else if (err) {
        res.status(400).json({ errors: [{ msg: err.message }] });
    } else {
        next();
    }
});

module.exports = router;
