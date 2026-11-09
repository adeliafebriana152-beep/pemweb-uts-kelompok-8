const db = require('../config/db');

const Panitia = {
    // Read: Menampilkan data panitia beserta judul event-nya (LEFT JOIN)
    getAll: async () => {
        const query = `
            SELECT panitia.*, event.judul AS judul_event 
            FROM panitia 
            LEFT JOIN event ON panitia.event_id = event.id
        `;
        const [rows] = await db.query(query);
        return rows;
    },

    // Ambil data berdasarkan ID untuk keperluan edit
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM panitia WHERE id = ?', [id]);
        return rows[0];
    },

    // Ambil daftar event untuk pilihan dropdown di form
    getAllEvents: async () => {
        const [rows] = await db.query('SELECT id, judul FROM event');
        return rows;
    },

    // Create: Menyimpan data panitia baru (Tanpa foto)
    create: async (data) => {
        const query = 'INSERT INTO panitia (nama, nim, divisi, jabatan, jenis_kelamin, event_id) VALUES (?, ?, ?, ?, ?, ?)';
        await db.query(query, [data.nama, data.nim, data.divisi, data.jabatan, data.jenis_kelamin, data.event_id || null]);
    },

    // Update: Memperbarui data panitia (Tanpa foto)
    update: async (id, data) => {
        const query = 'UPDATE panitia SET nama = ?, nim = ?, divisi = ?, jabatan = ?, jenis_kelamin = ?, event_id = ? WHERE id = ?';
        await db.query(query, [data.nama, data.nim, data.divisi, data.jabatan, data.jenis_kelamin, data.event_id || null, id]);
    },

    // Delete: Menghapus data panitia
    delete: async (id) => {
        await db.query('DELETE FROM panitia WHERE id = ?', [id]);
    }
};

module.exports = Panitia;