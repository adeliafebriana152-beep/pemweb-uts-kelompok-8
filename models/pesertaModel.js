const pool = require('../config/db');

// READ: semua peserta + judul event (LEFT JOIN), dengan pencarian & filter event
async function getAll({ q, eventId } = {}) {
  let sql =
    'SELECT p.*, e.judul AS judul_event ' +
    'FROM peserta p LEFT JOIN event e ON e.id = p.event_id';
  const where = [];
  const params = [];

  if (q) {
    where.push('(p.nama LIKE ? OR p.nim LIKE ?)');
    params.push('%' + q + '%', '%' + q + '%');
  }
  if (eventId === 'none') {
    where.push('p.event_id IS NULL');
  } else if (eventId) {
    where.push('p.event_id = ?');
    params.push(eventId);
  }
  if (where.length > 0) {
    sql += ' WHERE ' + where.join(' AND ');
  }
  sql += ' ORDER BY p.id DESC';

  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function getById(id) {
  const [rows] = await pool.execute('SELECT * FROM peserta WHERE id = ?', [id]);
  return rows[0] || null;
}

async function create(d) {
  const [result] = await pool.execute(
    'INSERT INTO peserta (nama, nim, email, no_hp, prodi, event_id) VALUES (?, ?, ?, ?, ?, ?)',
    [d.nama, d.nim, d.email, d.no_hp, d.prodi, d.event_id]
  );
  return result.insertId;
}

async function update(id, d) {
  const [result] = await pool.execute(
    'UPDATE peserta SET nama = ?, nim = ?, email = ?, no_hp = ?, prodi = ?, event_id = ? WHERE id = ?',
    [d.nama, d.nim, d.email, d.no_hp, d.prodi, d.event_id, id]
  );
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await pool.execute('DELETE FROM peserta WHERE id = ?', [id]);
  return result.affectedRows;
}

module.exports = { getAll, getById, create, update, remove };