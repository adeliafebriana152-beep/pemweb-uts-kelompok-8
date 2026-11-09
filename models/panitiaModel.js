const pool = require('../config/db');

async function getAll(eventId, q) {
  let sql = 'SELECT * FROM panitia WHERE event_id = ?';
  const params = [eventId];
  if (q) {
    sql += ' AND (nama LIKE ? OR nim LIKE ?)';
    params.push('%' + q + '%', '%' + q + '%');
  }
  sql += ' ORDER BY divisi ASC, nama ASC';
  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function getOptions(eventId) {
  const [rows] = await pool.execute(
    'SELECT id, nama, divisi FROM panitia WHERE event_id = ? ORDER BY nama ASC', [eventId]
  );
  return rows;
}

async function getById(id, eventId) {
  const [rows] = await pool.execute(
    'SELECT * FROM panitia WHERE id = ? AND event_id = ?', [id, eventId]
  );
  return rows[0] || null;
}

async function create(eventId, d) {
  const [r] = await pool.execute(
    'INSERT INTO panitia (nama, nim, divisi, jabatan, jenis_kelamin, event_id) VALUES (?, ?, ?, ?, ?, ?)',
    [d.nama, d.nim, d.divisi, d.jabatan, d.jenis_kelamin, eventId]
  );
  return r.insertId;
}

async function update(id, eventId, d) {
  const [r] = await pool.execute(
    'UPDATE panitia SET nama = ?, nim = ?, divisi = ?, jabatan = ?, jenis_kelamin = ? WHERE id = ? AND event_id = ?',
    [d.nama, d.nim, d.divisi, d.jabatan, d.jenis_kelamin, id, eventId]
  );
  return r.affectedRows;
}

async function remove(id, eventId) {
  const [r] = await pool.execute(
    'DELETE FROM panitia WHERE id = ? AND event_id = ?', [id, eventId]
  );
  return r.affectedRows;
}

module.exports = { getAll, getOptions, getById, create, update, remove };