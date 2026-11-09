const express = require('express');
const router = express.Router({ mergeParams: true });
const loadEvent = require('../middlewares/loadEvent');
const ctrl = require('../controllers/pesertaController');

router.use(loadEvent); 

router.get('/', ctrl.index);
router.get('/create', ctrl.createForm);   
router.post('/', ctrl.store);
router.get('/:id/edit', ctrl.editForm);
router.post('/:id', ctrl.update);
router.post('/:id/delete', ctrl.destroy); 

module.exports = router;