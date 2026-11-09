const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const panitiaController = require('../controllers/panitiaController');

// Konfigurasi Multer untuk Upload Foto
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); // Pastikan folder public/uploads sudah dibuat
    },
    filename: (req, file, cb) => {
        cb(null, 'panitia-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Rute CRUD Panitia
router.get('/', panitiaController.index);
router.get('/add', panitiaController.renderAddForm);
router.post('/add', upload.single('foto'), panitiaController.create);
router.get('/edit/:id', panitiaController.renderEditForm);
router.post('/edit/:id', upload.single('foto'), panitiaController.update);
router.post('/delete/:id', panitiaController.delete);

module.exports = router;