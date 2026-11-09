const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/eventController');

router.get('/', ctrl.index);
router.get('/create', ctrl.createForm);   // harus sebelum /:id
router.post('/', ctrl.store);
router.get('/:id/edit', ctrl.editForm);
router.post('/:id', ctrl.update);
router.post('/:id/delete', ctrl.destroy); // delete lewat form POST

module.exports = router;