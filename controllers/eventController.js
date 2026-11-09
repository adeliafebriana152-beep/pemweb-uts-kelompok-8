const Event = require('../models/eventModel');

const STATUS = ['dibuka', 'ditutup', 'selesai'];
const KATEGORI = ['Akademik', 'Non-Akademik'];

function validate(body) {
  const data = {
    judul: (body.judul || '').trim(),
    deskripsi: (body.deskripsi || '').trim(),
    kategori: body.kategori,
    tanggal: body.tanggal,
    waktu: body.waktu,
    lokasi: (body.lokasi || '').trim(),
    kuota: body.kuota,
    status: body.status
  };
  const errors = [];

  if (!data.judul) errors.push('Judul wajib diisi.');
  else if (data.judul.length > 150) errors.push('Judul maksimal 150 karakter.');

  if (!KATEGORI.includes(data.kategori)) errors.push('Kategori tidak valid.');

  const tgl = new Date(data.tanggal + 'T00:00:00');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.tanggal || '') || isNaN(tgl.getTime())) {
    errors.push('Tanggal tidak valid.');
  }

  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(data.waktu || '')) errors.push('Waktu tidak valid.');

  if (!data.lokasi) errors.push('Lokasi wajib diisi.');

  const kuota = Number(data.kuota);
  if (data.kuota === '' || !Number.isInteger(kuota) || kuota <= 0) {
    errors.push('Kuota harus berupa angka lebih dari 0.');
  }

  if (!STATUS.includes(data.status)) errors.push('Status harus dibuka, ditutup, atau selesai.');

  return { data, errors };
}

exports.getListEvent = async (req, res, next) => {
  try {
    const status = STATUS.includes(req.query.status) ? req.query.status : '';
    const q = (req.query.q || '').trim();
    const events = await Event.getAll({ status, q });
    res.render('pages/event/index', { events, status, q, msg: req.query.msg || '' });
  } catch (err) {
    next(err);
  }
};

exports.getFormCreateEvent = (req, res) => {
  res.render('pages/event/form', {
    title: 'Tambah Event',
    action: '/event',
    event: { kategori: 'Akademik', status: 'dibuka' },
    errors: [],
    STATUS,
    KATEGORI
  });
};

exports.postCreateEvent = async (req, res, next) => {
  try {
    const { data, errors } = validate(req.body);
    if (errors.length > 0) {
      return res.status(400).render('pages/event/form', {
        title: 'Tambah Event',
        action: '/event',
        event: data,
        errors,
        STATUS,
        KATEGORI
      });
    }
    await Event.create(data);
    res.redirect('/event?msg=created');
  } catch (err) {
    next(err);
  }
};

exports.getFormEditEvent = async (req, res, next) => {
  try {
    const event = await Event.getById(req.params.id);
    if (!event) return res.status(404).send('Event tidak ditemukan');
    res.render('pages/event/form', {
      title: 'Edit Event',
      action: '/event/' + event.id,
      event,
      errors: [],
      STATUS,
      KATEGORI
    });
  } catch (err) {
    next(err);
  }
};

exports.postUpdateEvent = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { data, errors } = validate(req.body);
    if (errors.length > 0) {
      return res.status(400).render('pages/event/form', {
        title: 'Edit Event',
        action: '/event/' + id,
        event: data,
        errors,
        STATUS,
        KATEGORI
      });
    }
    const affected = await Event.update(id, data);
    if (!affected) return res.status(404).send('Event tidak ditemukan');
    res.redirect('/event?msg=updated');
  } catch (err) {
    next(err);
  }
};

exports.postDeleteEvent = async (req, res, next) => {
  try {
    await Event.remove(req.params.id);
    res.redirect('/event?msg=deleted');
  } catch (err) {
    next(err);
  }
};