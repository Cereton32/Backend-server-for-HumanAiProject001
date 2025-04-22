const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Create a new user
router.post('/', userController.createUser);

// get user by phone
router.get('/:phoneNumber', userController.getUser);

// Delete user
router.delete('/:phoneNumber', userController.deleteUser);

module.exports = router;