const express = require('express');
const router = express.Router();

const { getAllDoctors } = require('../controllers/Doctor');

router.get('/alldoctor', getAllDoctors);

module.exports = router;