const express = require('express');
const router = express.Router({ mergeParams: true });
const loadEvent = require('../middlewares/loadEvent');
const tugasController = require('../controllers/tugasController');

router.use(loadEvent);

router.get('/', tugasController.getListTask);
router.get('/create', tugasController.getFormCreateTask);
router.post('/', tugasController.postCreateTask);
router.get('/:id/edit', tugasController.getFormEditTask);
router.post('/:id', tugasController.postUpdateTask);
router.post('/:id/delete', tugasController.postDeleteTask);

module.exports = router;