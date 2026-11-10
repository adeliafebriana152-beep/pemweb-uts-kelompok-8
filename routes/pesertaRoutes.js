const express = require('express');
const router = express.Router({ mergeParams: true });
const loadEvent = require('../middlewares/loadEvent');
const pesertaController = require('../controllers/pesertaController');

router.use(loadEvent); 

router.get('/', pesertaController.getListPeserta);
router.get('/create', pesertaController.getFormCreate);   
router.post('/', pesertaController.postCreate);
router.get('/:id/edit', pesertaController.getEditForm);
router.post('/:id', pesertaController.postUpdate);
router.post('/:id/delete', pesertaController.postDelete); 

module.exports = router;