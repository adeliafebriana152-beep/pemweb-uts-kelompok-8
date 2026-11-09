const express = require('express');
const router = express.Router({ mergeParams: true });
const loadEvent = require('../middlewares/loadEvent');
const panitiaController = require('../controllers/panitiaController');
    
router.use(loadEvent); 

router.get('/', panitiaController.getListPanitia);
router.get('/create', panitiaController.getFormCreatePanitia);
router.post('/', panitiaController.postCreatePanitia);
router.get('/:id/edit', panitiaController.getFormEditPanitia);
router.post('/:id', panitiaController.postUpdatePanitia);
router.post('/:id/delete', panitiaController.postDeletePanitia);

module.exports = router;