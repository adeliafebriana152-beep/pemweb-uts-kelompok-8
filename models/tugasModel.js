const TaskModel = {

  getEventById: async (eventId) => {
    const [rows] = await db.execute("SELECT id, judul FROM event WHERE id = ?", [eventId]);
    return rows[0];
  },

getFiltered: async (eventId, divisi, status) => {
  const [rows] = await db.execute(
    "SELECT t.*, p.nama AS nama_pic " +
    "FROM tugas t LEFT JOIN panitia p ON t.panitia_id = p.id " +
    "WHERE t.event_id = ? AND (? = '' OR t.divisi = ?) AND (? = '' OR t.status_task = ?) " +
    "ORDER BY t.tgl_deadline ASC, t.id ASC",
    [eventId, divisi, divisi, status, status]
  );
  return rows;
},

getPanitiaList: async (eventId) => {
  const [rows] = await db.execute(
    "SELECT id, nama, divisi FROM panitia WHERE event_id = ? ORDER BY nama ASC", [eventId]);
  return rows;
},

getDivisiList: async () => {
  const [rows] = await db.execute("SELECT DISTINCT divisi FROM tugas ORDER BY divisi ASC");
  return rows.map(r => r.divisi);
},

getStatusList: async () => {
  const [rows] = await db.execute("SELECT DISTINCT status_task FROM tugas ORDER BY status_task ASC");
  return rows.map(r => r.status_task);
},

  create: async (data) => {
    const sql = `
      INSERT INTO tugas (nama_task, divisi, prioritas, tgl_deadline, status_task, pic)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      data.nama_task,
      data.divisi,
      data.prioritas,
      data.tgl_deadline,
      data.status_task,
      data.pic,
    ]);
    return result;
  },

  getByIdTugas: async (id) => {
    const [rows] = await db.execute("SELECT * FROM tugas WHERE id = ?", [id]);
    return rows[0]; 
  },

  update: async (id, data) => {
    const sql = `
        UPDATE tugas
        SET nama_task = ?, divisi = ?, prioritas = ?, tgl_deadline = ?, status_task = ?, pic = ?
        WHERE id = ?
    `;
    const [result] = await db.execute(sql, [
      data.nama_task,
      data.divisi,
      data.prioritas,
      data.tgl_deadline,
      data.status_task,
      data.pic,
      id,
    ]);
    return result;
  },

  delete: async (id) => {
    const sql = "DELETE FROM tugas WHERE id = ?";
    const [result] = await db.execute(sql, [id]);
    return result;
  },
};
module.exports = TaskModel;