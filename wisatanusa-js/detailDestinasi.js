// 1. Ambil parameter id dari URL, mis. detailDestinasi.html?id=pantai-biru
const id = new URLSearchParams(window.location.search).get('id');

const statusEl = document.getElementById('status');
const errorEl = document.getElementById('error');
const detailEl = document.getElementById('detail');

// Tampilkan pesan error dan sembunyikan bagian lain
const tampilkanError = (pesan) => {
  statusEl.hidden = true;
  detailEl.hidden = true;
  errorEl.textContent = pesan;
  errorEl.hidden = false;
};

// 4. Isi elemen HTML yang sudah disiapkan dengan data destinasi
const render = (d) => {
  document.title = `${d.nama} | XYZ WisataNusa AI`;
  document.getElementById('nama').textContent = d.nama;
  document.getElementById('kategori').textContent = d.kategori;
  document.getElementById('deskripsi').textContent = d.deskripsi;
  document.getElementById('lokasi').textContent = d.lokasi;
  document.getElementById('jam-buka').textContent = d.jamBuka;
  document.getElementById('tiket').textContent = d.tiket;

  const gambar = document.getElementById('gambar');
  gambar.src = d.gambar;
  gambar.alt = d.alt; // alt diambil dari field alt pada JSON

  const daftarFasilitas = document.getElementById('fasilitas');
  daftarFasilitas.innerHTML = '';
  d.fasilitas.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    daftarFasilitas.appendChild(li);
  });

  statusEl.hidden = true;
  detailEl.hidden = false;
};

const muatDetail = async () => {
  if (!id) {
    tampilkanError('Destinasi tidak ditemukan');
    return;
  }

  try {
    // 2. Ambil data dari file JSON
    const response = await fetch('data/destinasi.json');
    if (!response.ok) throw new Error(`Gagal memuat data (HTTP ${response.status})`);
    const data = await response.json();

    // 3. Cari destinasi yang id-nya sama dengan id di URL
    const destinasi = data.find((item) => item.id === id);
    if (!destinasi) {
      tampilkanError('Destinasi tidak ditemukan');
      return;
    }
    render(destinasi);
  } catch (error) {
    console.error(error);
    tampilkanError('Data gagal dimuat. Coba lagi nanti.');
  }
};

muatDetail();