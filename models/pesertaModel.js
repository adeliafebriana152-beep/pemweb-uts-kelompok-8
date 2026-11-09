const pool = require('../config/db');

async function getAll(eventId, q) {
  let sql = 'SELECT * FROM peserta WHERE event_id = ?';
  const params = [eventId];
  if (q) {
    sql += ' AND (nama LIKE ? OR nim LIKE ?)';
    params.push('%' + q + '%', '%' + q + '%');
  }
  sql += ' ORDER BY id DESC';
  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function getById(id, eventId) {
  const [rows] = await pool.execute(
    'SELECT * FROM peserta WHERE id = ? AND event_id = ?', [id, eventId]
  );
  return rows[0] || null;
}

async function create(eventId, d) {
  const [r] = await pool.execute(
    'INSERT INTO peserta (nama, nim, email, no_hp, prodi, event_id) VALUES (?, ?, ?, ?, ?, ?)',
    [d.nama, d.nim, d.email, d.no_hp, d.prodi, eventId]
  );
  return r.insertId;
}

async function update(id, eventId, d) {
  const [r] = await pool.execute(
    'UPDATE peserta SET nama = ?, nim = ?, email = ?, no_hp = ?, prodi = ? WHERE id = ? AND event_id = ?',
    [d.nama, d.nim, d.email, d.no_hp, d.prodi, id, eventId]
  );
  return r.affectedRows;
}

async function remove(id, eventId) {
  const [r] = await pool.execute(
    'DELETE FROM peserta WHERE id = ? AND event_id = ?', [id, eventId]
  );
  return r.affectedRows;
}

module.exports = { getAll, getById, create, update, remove };