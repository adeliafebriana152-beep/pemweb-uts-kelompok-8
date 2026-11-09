const pool = require('../config/db');

async function getAll({ status, q } = {}) {
  let sql =
    'SELECT e.*, COUNT(p.id) AS jumlah_peserta, ' +
    '(SELECT COUNT(*) FROM panitia pa WHERE pa.event_id = e.id) AS jumlah_panitia, ' +
    '(SELECT COUNT(*) FROM tugas t WHERE t.event_id = e.id) AS jumlah_tugas ' +
    'FROM event e LEFT JOIN peserta p ON p.event_id = e.id';
  const where = [];
  const params = [];

  if (status) {
    where.push('e.status = ?');
    params.push(status);
  }
  if (q) {
    where.push('e.judul LIKE ?');
    params.push('%' + q + '%');
  }
  if (where.length > 0) {
    sql += ' WHERE ' + where.join(' AND ');
  }
  sql += ' GROUP BY e.id ORDER BY e.tanggal DESC, e.waktu DESC';

  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function getById(id) {
  const [rows] = await pool.execute('SELECT * FROM event WHERE id = ?', [id]);
  return rows[0] || null;
}

// CREATE
async function create(d) {
  const [result] = await pool.execute(
    'INSERT INTO event (judul, deskripsi, kategori, tanggal, waktu, lokasi, kuota, status) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [d.judul, d.deskripsi, d.kategori, d.tanggal, d.waktu, d.lokasi, d.kuota, d.status]
  );
  return result.insertId;
}

// UPDATE
async function update(id, d) {
  const [result] = await pool.execute(
    'UPDATE event SET judul = ?, deskripsi = ?, kategori = ?, tanggal = ?, waktu = ?, ' +
      'lokasi = ?, kuota = ?, status = ? WHERE id = ?',
    [d.judul, d.deskripsi, d.kategori, d.tanggal, d.waktu, d.lokasi, d.kuota, d.status, id]
  );
  return result.affectedRows;
}

// DELETE 
async function remove(id) {
  const [result] = await pool.execute('DELETE FROM event WHERE id = ?', [id]);
  return result.affectedRows;
}

module.exports = { getAll, getById, create, update, remove };