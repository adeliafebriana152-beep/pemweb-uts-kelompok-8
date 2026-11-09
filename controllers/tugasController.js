const taskModel = require("../models/tugasModel");

const tanggalValid = (str) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str || "")) return false;
  const d = new Date(str + "T00:00:00Z");
  return !isNaN(d) && d.toISOString().slice(0, 10) === str;
};

const ambilEvent = async (req, res) => {
  const eventId = Number(req.params.eventId);
  const event = Number.isInteger(eventId) ? await taskModel.getEventById(eventId) : null;
  if (!event) {
    res.status(404).render("pages/notFound", {
      pageTitle: "Tidak Ditemukan", 
      halaman: "notfound", 
      pesan: "Event tidak ditemukan.",
    });
    return null;
  }
  return event;
};

const ambilOpsi = async () => ({
  divisiList: await taskModel.getEnumValues('divisi'),
  statusList: await taskModel.getStatusList('prioritas'),
  prioritasList: await taskModel.getPrioritasList('status_task'),
  panitiaList: await taskModel.getPanitiaList(eventId),
});

const rapikan = (body) => ({
  nama_task: (body.nama_task || "").trim(),
  kategori: (body.kategori || "").trim(),
  prioritas: body.prioritas,
  tgl_deadline: body.tgl_deadline,
  status_task: body.status_task,
  pic: (body.pic || "").trim(),
  panitia_id: body.panitia_id ? Number(body.panitia_id) : null,
});

// Mengembalikan pesan error, atau null kalau semua valid
const validasi = (d, { statusList, prioritasList }) => {
  if (!d.nama_task || !d.kategori || !d.prioritas || !d.tgl_deadline || !d.status_task || !d.pic) {
    return "Seluruh field formulir wajib diisi.";
  }
  if (d.nama_task.length > 150) return "Nama tugas maksimal 150 karakter.";
  if (!prioritasList.includes(d.prioritas)) return "Prioritas tidak valid.";
  if (!statusList.includes(d.status_task)) return "Status tidak valid.";
  if (!tanggalValid(d.tgl_deadline)) return "Tanggal deadline tidak valid.";
  if (d.panitia_id !== null && !panitiaList.some((p) => p.id === d.panitia_id)) {
  return "Penanggung jawab tidak valid.";
  }
  return null;
};

exports.getListTask = async (req, res) => {
  try {
    const event = await ambilEvent(req, res);
    if (!event) return;

    const divisi = req.query.divisi ? String(req.query.divisi) : "";
    const status = req.query.status ? String(req.query.status) : "";

    const listTask = await taskModel.getFiltered(event.id, divisi, status);
    const divisiList = await taskModel.getDivisiList(event.id);
    const { statusList } = await ambilOpsi();

    res.render("pages/main-task", {
      pageTitle: `Tugas Panitia: ${event.judul}`,
      halaman: "Home",
      event, tasks: listTask, divisiList, statusList,
      divisiAktif: divisi, statusAktif: status,
    });
  } catch (error) {
    console.error("[ERROR getListTask]:", error);
    res.status(500).send("Terjadi galat internal saat mengambil data tugas.");
  }
};

exports.getFormCreateTask = async (req, res) => {
  try {
    const event = await ambilEvent(req, res);
    if (!event) return;
    res.render("pages/tambah-task", {
      pageTitle: "Form Tambah Tugas Baru", 
      halaman: "Add Task",
      event, task: {}, ...(await ambilOpsi(event.id)),
    });
  } catch (error) {
    console.error("[ERROR getFormCreate]:", error);
    res.status(500).send("Galat internal saat memuat form tambah tugas.");
  }
};

exports.postCreateTask = async (req, res) => {
  try {
    const event = await ambilEvent(req, res);
    if (!event) return;

    const data = rapikan(req.body);
    const pesanError = validasi(data, await ambilOpsi());
    if (pesanError) return res.status(400).send(pesanError);

    await taskModel.create(event.id, data);
    console.log(`[DATABASE] Tugas "${data.nama_task}" berhasil di-insert ke event ${event.id}.`);
    res.redirect(`/event/${event.id}/task`);
  } catch (error) {
    console.error("[ERROR postCreateTask]:", error);
    res.status(500).send("Gagal menambahkan tugas ke basis data.");
  }
};

exports.getFormEditTask = async (req, res) => {
  try {
    const event = await ambilEvent(req, res);
    if (!event) return;

    const task = await taskModel.getByIdTugas(req.params.id, event.id);
    if (!task) {
      return res.status(404).render("pages/notFound", {
        pageTitle: "Tidak Ditemukan", halaman: "notfound", pesan: "Tugas tidak ditemukan.",
      });
    }
    res.render("pages/edit-task", {
      pageTitle: "Edit Data Tugas", halaman: "Edit",
      event, task, ...(await ambilOpsi()),
    });
  } catch (error) {
    console.error("[ERROR getFormEdit]:", error);
    res.status(500).send("Galat internal saat memuat form edit tugas.");
  }
};

exports.postUpdateTask = async (req, res) => {
  try {
    const event = await ambilEvent(req, res);
    if (!event) return;

    const data = rapikan(req.body);
    const pesanError = validasi(data, await ambilOpsi());
    if (pesanError) return res.status(400).send(pesanError);

    await taskModel.update(req.params.id, event.id, data);
    console.log(`[DATABASE] Tugas ID ${req.params.id} berhasil diupdate.`);
    res.redirect(`/event/${event.id}/task`);
  } catch (error) {
    console.error("[ERROR postUpdateTask]:", error);
    res.status(500).send("Gagal mengupdate tugas.");
  }
};

exports.postDeleteTask = async (req, res) => {
  try {
    const event = await ambilEvent(req, res);
    if (!event) return;

    const result = await taskModel.delete(req.params.id, event.id);
    if (result.affectedRows === 0) {
      console.warn(`[DATABASE] Tidak ada tugas yang terhapus untuk ID ${req.params.id}`);
    } else {
      console.log(`[DATABASE] Tugas ID ${req.params.id} berhasil dihapus.`);
    }
    res.redirect(`/event/${event.id}/task`);
  } catch (error) {
    console.error("[ERROR postDeleteTask]:", error);
    res.status(500).send("Gagal menghapus tugas dari basis data.");
  }
};

