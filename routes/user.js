// routes/user.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');
const {
    getUserProfile,
    updateUserProfile,
} = require('../controllers/userController');

// Get Current User Profile
router.get('/me', auth, getUserProfile);

// Update User Profile
router.put(
    '/me',
    [
        auth,
        [
            check('firstName', 'First Name is required').notEmpty(),
            check('lastName', 'Last Name is required').notEmpty(),
            check('phoneNumber', 'Phone Number is required').notEmpty(),
        ],
    ],
    updateUserProfile
);

module.exports = router;
