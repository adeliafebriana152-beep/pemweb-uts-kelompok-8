const Event = require('../models/eventModel');

module.exports = async (req, res, next) => {
  try {
    const id = Number(req.params.eventId);
    const event = Number.isInteger(id) ? await Event.getById(id) : null;
    if (!event) return res.status(404).send('Event tidak ditemukan');
    req.event = event;
    res.locals.event = event; 
    next();
  } catch (err) {
    next(err);
  }
};