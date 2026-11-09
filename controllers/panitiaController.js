const Panitia = require('../models/panitiaModel');
const fs = require('fs');
const path = require('path');

const panitiaController = {
    // 1. Tampil Data (Read)
    index: async (req, res) => {
        try {
            const panitia = await Panitia.getAll();
            res.render('pages/panitia/index', { panitia });
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    },

    // 2. Render Form Tambah
    renderAddForm: async (req, res) => {
        try {
            const events = await Panitia.getAllEvents(); // Untuk dropdown pilihan event
            res.render('pages/panitia/add', { events });
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    },

    // 3. Proses Tambah (Create)
    create: async (req, res) => {
        try {
            const { nama, nim, divisi, jabatan, jenis_kelamin, event_id } = req.body;
            const foto = req.file ? req.file.filename : null;

            await Panitia.create({ nama, nim, divisi, jabatan, jenis_kelamin, foto, event_id });
            res.redirect('/panitia'); // Pola PRG (Post-Redirect-Get)
        } catch (err) {
            console.error(err);
            res.status(500).send('Gagal menyimpan data');
        }
    },

    // 4. Render Form Edit
    renderEditForm: async (req, res) => {
        try {
            const id = req.params.id;
            const pan = await Panitia.getById(id);
            const events = await Panitia.getAllEvents();
            if (!pan) return res.status(404).send('Data tidak ditemukan');
            res.render('pages/panitia/edit', { pan, events });
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    },

    // 5. Proses Update (Update)
    update: async (req, res) => {
        try {
            const id = req.params.id;
            const { nama, nim, divisi, jabatan, jenis_kelamin, event_id } = req.body;
            const panitiaLama = await Panitia.getById(id);

            let fotoBaru = panitiaLama.foto;
            if (req.file) {
                fotoBaru = req.file.filename;
                // Hapus file foto lama jika ada foto baru
                if (panitiaLama.foto) {
                    const oldPath = path.join(__dirname, '../public/uploads/', panitiaLama.foto);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                }
            }

            await Panitia.update(id, { nama, nim, divisi, jabatan, jenis_kelamin, foto: fotoBaru, event_id });
            res.redirect('/panitia');
        } catch (err) {
            console.error(err);
            res.status(500).send('Gagal memperbarui data');
        }
    },

    // 6. Proses Hapus (Delete)
    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const panitia = await Panitia.getById(id);

            // Hapus file fisik foto dari server
            if (panitia && panitia.foto) {
                const filePath = path.join(__dirname, '../public/uploads/', panitia.foto);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }

            await Panitia.delete(id);
            res.redirect('/panitia');
        } catch (err) {
            console.error(err);
            res.status(500).send('Gagal menghapus data');
        }
    }
};

module.exports = panitiaController;