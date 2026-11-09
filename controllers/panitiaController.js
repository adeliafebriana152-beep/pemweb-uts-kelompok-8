const Panitia = require('../models/panitiaModel');

const JENIS_KELAMIN = ['Laki-laki', 'Perempuan'];
const base = (req) => '/event/' + req.event.id + '/panitia';
const teksHuruf = /^[A-Za-z][A-Za-z\s\-\/&.]{1,49}$/;

function validate(body) {
  const data = {
    nama: (body.nama || '').trim(),
    nim: (body.nim || '').trim(),
    divisi: (body.divisi || '').trim(),
    jabatan: (body.jabatan || '').trim(),
    jenis_kelamin: body.jenis_kelamin
  };
  const errors = [];

  if (!data.nama) errors.push('Nama wajib diisi.');
  else if (data.nama.length > 100) errors.push('Nama maksimal 100 karakter.');

  if (!data.nim) errors.push('NIM wajib diisi.');
  else if (!/^\d{1,20}$/.test(data.nim)) errors.push('NIM harus berupa angka (maksimal 20 digit).');

  if (!data.divisi) errors.push('Divisi wajib diisi.');
  else if (!teksHuruf.test(data.divisi)) errors.push('Divisi hanya boleh berisi huruf (2-50 karakter).');  

  if (!data.jabatan) errors.push('Jabatan wajib diisi.');
  else if (!teksHuruf.test(data.jabatan)) errors.push('Jabatan hanya boleh berisi huruf (2-50 karakter).'); 

  if (!JENIS_KELAMIN.includes(data.jenis_kelamin)) errors.push('Jenis kelamin tidak valid.');

  return { data, errors };
}

exports.getListPanitia = async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const panitia = await Panitia.getAll(req.event.id, q);
    res.render('pages/panitia/index', { panitia, q, base: base(req), msg: req.query.msg || '' });
  } catch (err) { next(err); }
};

exports.getFormCreatePanitia = (req, res) => {
  res.render('pages/panitia/form', {
    title: 'Tambah Panitia', action: base(req), base: base(req),
    panitia: {}, errors: [], JENIS_KELAMIN
  });
};

exports.postCreatePanitia = async (req, res, next) => {
  try {
    const { data, errors } = validate(req.body);
    if (errors.length > 0) {
      return res.status(400).render('pages/panitia/form', {
        title: 'Tambah Panitia', action: base(req), base: base(req),
        panitia: data, errors, JENIS_KELAMIN
      });
    }
    await Panitia.create(req.event.id, data);
    res.redirect(base(req) + '?msg=created');
  } catch (err) { next(err); }
};

exports.getFormEditPanitia = async (req, res, next) => {
  try {
    const panitia = await Panitia.getById(req.params.id, req.event.id);
    if (!panitia) return res.status(404).send('Panitia tidak ditemukan');
    res.render('pages/panitia/form', {
      title: 'Edit Panitia', action: base(req) + '/' + panitia.id, base: base(req),
      panitia, errors: [], JENIS_KELAMIN
    });
  } catch (err) { next(err); }
};

exports.postUpdatePanitia = async (req, res, next) => {
  try {
    const { data, errors } = validate(req.body);
    if (errors.length > 0) {
      return res.status(400).render('pages/panitia/form', {
        title: 'Edit Panitia', action: base(req) + '/' + req.params.id, base: base(req),
        panitia: data, errors, JENIS_KELAMIN
      });
    }
    const affected = await Panitia.update(req.params.id, req.event.id, data);
    if (!affected) return res.status(404).send('Panitia tidak ditemukan');
    res.redirect(base(req) + '?msg=updated');
  } catch (err) { next(err); }
};

exports.postDeletePanitia = async (req, res, next) => {
  try {
    await Panitia.remove(req.params.id, req.event.id);
    res.redirect(base(req) + '?msg=deleted');
  } catch (err) { next(err); }
};