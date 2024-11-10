const express = require('express');
const router = express.Router();
const { recommendationController } = require('../controllers');

router.get('/', recommendationController.getData);