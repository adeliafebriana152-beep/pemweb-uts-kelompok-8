const express = require('express');
const router = express.Router();
const panitiaController = require('../controllers/panitiaController');

// Rute CRUD Panitia (Tanpa middleware upload multer)
router.get('/', panitiaController.index);
router.get('/add', panitiaController.renderAddForm);
router.post('/add', panitiaController.create);
router.get('/edit/:id', panitiaController.renderEditForm);
router.post('/edit/:id', panitiaController.update);
router.post('/delete/:id', panitiaController.delete);

module.exports = router;