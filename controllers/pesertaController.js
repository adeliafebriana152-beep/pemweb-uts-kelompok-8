const Peserta = require('../models/pesertaModel');
const Event = require('../models/eventModel');

// Validasi di server, mengembalikan { data, errors }
function validate(body) {
  const data = {
    nama: (body.nama || '').trim(),
    nim: (body.nim || '').trim(),
    email: (body.email || '').trim(),
    no_hp: (body.no_hp || '').trim(),
    prodi: (body.prodi || '').trim(),
    // "Tanpa event" (string kosong) disimpan sebagai NULL
    event_id: body.event_id === undefined || body.event_id === '' ? null : Number(body.event_id)
  };
  const errors = [];

  if (!data.nama) errors.push('Nama wajib diisi.');
  else if (data.nama.length > 100) errors.push('Nama maksimal 100 karakter.');

  if (!data.nim) errors.push('NIM wajib diisi.');
  else if (!/^\d{1,20}$/.test(data.nim)) errors.push('NIM harus berupa angka (maksimal 20 digit).');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('Format email tidak valid.');
  else if (data.email.length > 100) errors.push('Email maksimal 100 karakter.');

  if (!/^\d{8,20}$/.test(data.no_hp)) errors.push('No HP harus berupa angka 8-20 digit.');

  if (!data.prodi) errors.push('Prodi wajib diisi.');
  else if (data.prodi.length > 80) errors.push('Prodi maksimal 80 karakter.');

  if (data.event_id !== null && !Number.isInteger(data.event_id)) {
    errors.push('Event tidak valid.');
  }

  return { data, errors };
}

// Pastikan event yang dipilih benar-benar ada
async function cekEvent(data, errors) {
  if (data.event_id !== null && Number.isInteger(data.event_id)) {
    const ev = await Event.getById(data.event_id);
    if (!ev) errors.push('Event yang dipilih tidak ditemukan.');
  }
}

async function renderForm(res, status, { title, action, peserta, errors }) {
  const events = await Event.getOptions();
  res.status(status).render('peserta/form', { title, action, peserta, errors, events });
}

// GET /peserta
exports.index = async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const eventId = (req.query.event_id || '').trim();
    const [peserta, events] = await Promise.all([
      Peserta.getAll({ q, eventId }),
      Event.getOptions()
    ]);
    res.render('peserta/index', { peserta, events, q, eventId, msg: req.query.msg || '' });
  } catch (err) {
    next(err);
  }
};

// GET /peserta/create
exports.createForm = async (req, res, next) => {
  try {
    await renderForm(res, 200, {
      title: 'Tambah Peserta',
      action: '/peserta',
      peserta: { event_id: null },
      errors: []
    });
  } catch (err) {
    next(err);
  }
};

// POST /peserta
exports.store = async (req, res, next) => {
  try {
    const { data, errors } = validate(req.body);
    await cekEvent(data, errors);
    if (errors.length > 0) {
      return await renderForm(res, 400, {
        title: 'Tambah Peserta',
        action: '/peserta',
        peserta: data,
        errors
      });
    }
    await Peserta.create(data);
    res.redirect('/peserta?msg=created');
  } catch (err) {
    next(err);
  }
};

// GET /peserta/:id/edit
exports.editForm = async (req, res, next) => {
  try {
    const peserta = await Peserta.getById(req.params.id);
    if (!peserta) return res.status(404).send('Peserta tidak ditemukan');
    await renderForm(res, 200, {
      title: 'Edit Peserta',
      action: '/peserta/' + peserta.id,
      peserta,
      errors: []
    });
  } catch (err) {
    next(err);
  }
};

// POST /peserta/:id
exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { data, errors } = validate(req.body);
    await cekEvent(data, errors);
    if (errors.length > 0) {
      return await renderForm(res, 400, {
        title: 'Edit Peserta',
        action: '/peserta/' + id,
        peserta: data,
        errors
      });
    }
    const affected = await Peserta.update(id, data);
    if (!affected) return res.status(404).send('Peserta tidak ditemukan');
    res.redirect('/peserta?msg=updated');
  } catch (err) {
    next(err);
  }
};

// POST /peserta/:id/delete
exports.destroy = async (req, res, next) => {
  try {
    await Peserta.remove(req.params.id);
    res.redirect('/peserta?msg=deleted');
  } catch (err) {
    next(err);
  }
};