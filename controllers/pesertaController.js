const Peserta = require('../models/pesertaModel');

const base = (req) => '/event/' + req.event.id + '/peserta';

function validate(body) {
  const data = {
    nama: (body.nama || '').trim(),
    nim: (body.nim || '').trim(),
    email: (body.email || '').trim(),
    no_hp: (body.no_hp || '').trim(),
    prodi: (body.prodi || '').trim()
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

  return { data, errors };
}

exports.getListPeserta = async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const peserta = await Peserta.getAll(req.event.id, q);
    res.render('pages/peserta/index', { peserta, q, base: base(req), msg: req.query.msg || '' });
  } catch (err) { next(err); }
};

exports.getFormCreate = (req, res) => {
  res.render('pages/peserta/form', {
    title: 'Tambah Peserta', action: base(req), base: base(req), peserta: {}, errors: []
  });
};

exports.postCreate = async (req, res, next) => {
  try {
    const { data, errors } = validate(req.body);
    if (errors.length > 0) {
      return res.status(400).render('pages/peserta/form', {
        title: 'Tambah Peserta', action: base(req), base: base(req), peserta: data, errors
      });
    }
    await Peserta.create(req.event.id, data);
    res.redirect(base(req) + '?msg=created');
  } catch (err) { next(err); }
};

exports.getEditForm = async (req, res, next) => {
  try {
    const peserta = await Peserta.getById(req.params.id, req.event.id);
    if (!peserta) return res.status(404).send('Peserta tidak ditemukan');
    res.render('pages/peserta/form', {
      title: 'Edit Peserta', action: base(req) + '/' + peserta.id, base: base(req), peserta, errors: []
    });
  } catch (err) { next(err); }
};

exports.postUpdate = async (req, res, next) => {
  try {
    const { data, errors } = validate(req.body);
    if (errors.length > 0) {
      return res.status(400).render('pages/peserta/form', {
        title: 'Edit Peserta', action: base(req) + '/' + req.params.id, base: base(req),
        peserta: data, errors
      });
    }
    const affected = await Peserta.update(req.params.id, req.event.id, data);
    if (!affected) return res.status(404).send('Peserta tidak ditemukan');
    res.redirect(base(req) + '?msg=updated');
  } catch (err) { next(err); }
};

exports.postDelete = async (req, res, next) => {
  try {
    await Peserta.remove(req.params.id, req.event.id);
    res.redirect(base(req) + '?msg=deleted');
  } catch (err) { next(err); }
};