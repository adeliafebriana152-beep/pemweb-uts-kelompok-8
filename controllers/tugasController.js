const Tugas = require('../models/tugasModel');
const Panitia = require('../models/panitiaModel');

const PRIORITAS = ['tinggi', 'sedang', 'rendah'];
const STATUS_TASK = ['belum', 'proses', 'selesai'];
const DIVISI = ['Konsumsi', 'Humas', 'PubDekDok', 'Kesekretariatan', 'Acara'];
const base = (req) => '/event/' + req.event.id + '/task';

function tanggalValid(str) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str || '')) return false;
  const d = new Date(str + 'T00:00:00Z');
  return !isNaN(d) && d.toISOString().slice(0, 10) === str;
}

function validate(body, panitiaList) {
  const data = {
    nama_task: (body.nama_task || '').trim(),
    divisi: (body.divisi || '').trim(),
    prioritas: body.prioritas,
    tgl_deadline: body.tgl_deadline,
    status_task: body.status_task,
    panitia_id: body.panitia_id ? Number(body.panitia_id) : null
  };
  const errors = [];

  if (!data.nama_task || !data.divisi) errors.push('Nama tugas dan divisi wajib diisi.');
  else if (data.nama_task.length > 150) errors.push('Nama tugas maksimal 150 karakter.');
    if (data.divisi && !DIVISI.includes(data.divisi)) errors.push('Divisi tidak valid, pilih salah satu: ' + DIVISI.join(', ') + '.');
  if (!PRIORITAS.includes(data.prioritas)) errors.push('Prioritas tidak valid.');
  if (!tanggalValid(data.tgl_deadline)) errors.push('Tanggal deadline tidak valid.');
  if (!STATUS_TASK.includes(data.status_task)) errors.push('Status tugas tidak valid.');

  if (data.panitia_id !== null && !panitiaList.some((p) => p.id === data.panitia_id)) {
    errors.push('Penanggung jawab harus panitia dari event ini.');
  }
  return { data, errors };
}

async function renderForm(req, res, status, { title, action, task, errors }) {
  const panitiaList = await Panitia.getOptions(req.event.id);
  const divisiOptions = [...new Set(panitiaList.map((p) => p.divisi))];
  res.status(status).render('pages/tugas/form', {
    title, action, task, errors, base: base(req),
    panitiaList, divisiOptions, PRIORITAS, STATUS_TASK
  });
}

exports.getListTask = async (req, res, next) => {
  try {
    const divisi = req.query.divisi ? String(req.query.divisi) : '';
    const status = STATUS_TASK.includes(req.query.status) ? req.query.status : '';
    const [tasks, divisiList] = await Promise.all([
      Tugas.getAll(req.event.id, { divisi, status }),
      Tugas.getDivisiList(req.event.id)
    ]);
    res.render('pages/tugas/main-task', {
      tasks, divisiList, STATUS_TASK, divisiAktif: divisi, statusAktif: status,
      base: base(req), msg: req.query.msg || ''
    });
  } catch (err) { next(err); }
};

exports.getFormCreateTask = async (req, res, next) => {
  try {
    await renderForm(req, res, 200, {
      title: 'Tambah Tugas', action: base(req),
      task: { prioritas: 'sedang', status_task: 'belum' }, errors: []
    });
  } catch (err) { next(err); }
};

exports.postCreateTask = async (req, res, next) => {
  try {
    const panitiaList = await Panitia.getOptions(req.event.id);
    const { data, errors } = validate(req.body, panitiaList);
    if (errors.length > 0) {
      return await renderForm(req, res, 400, {
        title: 'Tambah Tugas', action: base(req), task: data, errors
      });
    }
    await Tugas.create(req.event.id, data);
    res.redirect(base(req) + '?msg=created');
  } catch (err) { next(err); }
};

exports.getFormEditTask = async (req, res, next) => {
  try {
    const task = await Tugas.getById(req.params.id, req.event.id);
    if (!task) return res.status(404).send('Tugas tidak ditemukan');
    await renderForm(req, res, 200, {
      title: 'Edit Tugas', action: base(req) + '/' + task.id, task, errors: []
    });
  } catch (err) { next(err); }
};

exports.postUpdateTask = async (req, res, next) => {
  try {
    const panitiaList = await Panitia.getOptions(req.event.id);
    const { data, errors } = validate(req.body, panitiaList);
    if (errors.length > 0) {
      return await renderForm(req, res, 400, {
        title: 'Edit Tugas', action: base(req) + '/' + req.params.id, task: data, errors
      });
    }
    const affected = await Tugas.update(req.params.id, req.event.id, data);
    if (!affected) return res.status(404).send('Tugas tidak ditemukan');
    res.redirect(base(req) + '?msg=updated');
  } catch (err) { next(err); }
};

exports.postDeleteTask = async (req, res, next) => {
  try {
    await Tugas.remove(req.params.id, req.event.id);
    res.redirect(base(req) + '?msg=deleted');
  } catch (err) { next(err); }
};