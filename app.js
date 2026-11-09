require('dotenv').config();
const express = require('express');
const path = require('path');
const eventRoutes = require('./routes/eventRoutes');
const pesertaRoutes = require('./routes/pesertaRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Helper tanggal ramah baca: 2026-11-10 -> "10 Nov 2026"
const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
app.locals.formatTanggal = (str) => {
  if (!str) return '-';
  const [y, m, d] = String(str).slice(0, 10).split('-');
  return parseInt(d, 10) + ' ' + BULAN[parseInt(m, 10) - 1] + ' ' + y;
};
app.locals.formatWaktu = (str) => (str ? String(str).slice(0, 5) + ' WIB' : '-');

app.get('/', (req, res) => res.redirect('/event'));
app.use('/event', eventRoutes);
app.use('/peserta', pesertaRoutes);

app.use((req, res) => res.status(404).send('Halaman tidak ditemukan'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Terjadi kesalahan pada server');
});

app.listen(PORT, () => console.log('Server berjalan di http://localhost:' + PORT));