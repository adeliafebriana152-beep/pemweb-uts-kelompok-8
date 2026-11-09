const pool = require('../config/db');

async function getAll(eventId, { divisi, status } = {}) {
  let sql =
    'SELECT t.*, p.nama AS nama_pic ' +
    'FROM tugas t LEFT JOIN panitia p ON p.id = t.panitia_id ' +
    'WHERE t.event_id = ?';
  const params = [eventId];
  if (divisi) {
    sql += ' AND t.divisi = ?';
    params.push(divisi);
  }
  if (status) {
    sql += ' AND t.status_task = ?';
    params.push(status);
  }
  sql += ' ORDER BY t.tgl_deadline ASC, t.id ASC';
  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function getDivisiList(eventId) {
  const [rows] = await pool.execute(
    'SELECT DISTINCT divisi FROM tugas WHERE event_id = ? ORDER BY divisi ASC', [eventId]
  );
  return rows.map((r) => r.divisi);
}

async function getById(id, eventId) {
  const [rows] = await pool.execute(
    'SELECT * FROM tugas WHERE id = ? AND event_id = ?', [id, eventId]
  );
  return rows[0] || null;
}

async function create(eventId, d) {
  const [r] = await pool.execute(
    'INSERT INTO tugas (nama_task, divisi, prioritas, tgl_deadline, status_task, panitia_id, event_id) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?)',
    [d.nama_task, d.divisi, d.prioritas, d.tgl_deadline, d.status_task, d.panitia_id, eventId]
  );
  return r.insertId;
}

async function update(id, eventId, d) {
  const [r] = await pool.execute(
    'UPDATE tugas SET nama_task = ?, divisi = ?, prioritas = ?, tgl_deadline = ?, status_task = ?, ' +
      'panitia_id = ? WHERE id = ? AND event_id = ?',
    [d.nama_task, d.divisi, d.prioritas, d.tgl_deadline, d.status_task, d.panitia_id, id, eventId]
  );
  return r.affectedRows;
}

async function remove(id, eventId) {
  const [r] = await pool.execute(
    'DELETE FROM tugas WHERE id = ? AND event_id = ?', [id, eventId]
  );
  return r.affectedRows;
}

module.exports = { getAll, getDivisiList, getById, create, update, remove };