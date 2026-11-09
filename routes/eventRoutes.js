const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/', eventController.getListEvent);
router.get('/create', eventController.getFormCreateEvent);
router.post('/', eventController.postCreateEvent);
router.get('/:id/edit', eventController.getFormEditEvent);
router.post('/:id', eventController.postUpdateEvent);
router.post('/:id/delete', eventController.postDeleteEvent); 

module.exports = router;