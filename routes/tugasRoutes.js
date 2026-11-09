const express = require('express');
const router = express.Router({ mergeParams: true });
const tugasController = require('../controllers/tugasController');

router.get('/', tugasController.getListTask);
router.get('/tambah', tugasController.getFormCreateTask);
router.post('/tambah', tugasController.postCreateTask);
router.get('/edit/:id', tugasController.getFormEditTask);
router.post('/edit/:id', tugasController.postUpdateTask);
router.post('/delete/:id', tugasController.postDeleteTask);

module.exports = router;