/* =========================================================
   main.js - XYZ WisataNusa AI (Minggu 5: JavaScript + jQuery)
   - Data destinasi di-FETCH dari data/destinasi.json (bukan ditulis langsung di HTML)
   - jQuery dipakai untuk memilih elemen ($), menangani event (.on), dan mengisi halaman (.html)
   ========================================================= */

/* ---------- 1. FUNGSI BERSAMA ---------- */

// Mengambil data JSON dengan fetch, sekaligus menampilkan loading & error.
// "tampilkan" = fungsi yang dijalankan jika data berhasil diambil.
function ambilData(tampilkan, $status) {
  $status.html('<p class="text-center py-4" role="status">Memuat data...</p>');

  fetch("data/destinasi.json")
    .then((response) => {
      if (!response.ok) throw new Error("gagal");
      return response.json();
    })
    .then((data) => {
      $status.empty();
      tampilkan(data);
    })
    .catch(() => {
      $status.html('<p class="alert alert-danger" role="alert">Data gagal dimuat. Coba muat ulang halaman.</p>');
    });
}

// Membuat HTML 1 kartu destinasi (dipakai di Beranda dan halaman Destinasi)
function buatKartu(d) {
  return `
    <li class="col">
      <article class="card h-100 shadow-sm tw-scroll-mt-24" id="${d.id}">
        <img src="${d.gambar}" class="card-img-top tw-aspect-[4/3] tw-object-cover tw-bg-soft" alt="${d.alt}">
        <div class="card-body">
          <h3 class="h4">${d.nama}</h3>
          <p>${d.deskripsi}</p>
          <dl class="tw-grid tw-grid-cols-[auto_1fr] tw-gap-x-4 tw-gap-y-1 tw-text-sm tw-border-t tw-pt-3 tw-mb-0">
            <dt class="text-secondary">Kategori</dt><dd class="mb-0 text-capitalize">${d.kategori}</dd>
            <dt class="text-secondary">Jam buka</dt><dd class="mb-0">${d.jamBuka}</dd>
            <dt class="text-secondary">Tiket</dt><dd class="mb-0">Rp${d.tiket.toLocaleString("id-ID")}</dd>
            <dt class="text-secondary">Fasilitas</dt><dd class="mb-0">${d.fasilitas}</dd>
          </dl>
        </div>
      </article>
    </li>`;
}

/* ---------- 2. BERANDA ---------- */

function halamanBeranda() {
  ambilData((data) => {
    // slice(0, 3) = ambil 3 destinasi pertama
    $("#daftar-unggulan").html(data.slice(0, 3).map(buatKartu).join(""));
  }, $("#status-unggulan"));
}

/* ---------- 3. DESTINASI (cari + filter) ---------- */

function halamanDestinasi() {
  ambilData((data) => {
    // Menampilkan destinasi yang cocok dengan kata kunci dan kategori
    function tampilkan() {
      const kata = $("#cari").val().trim().toLowerCase();
      const kategori = $("#kategori").val();

      const hasil = data.filter((d) => {
        const cocokKategori = kategori === "" || d.kategori === kategori;
        const cocokKata = (d.nama + " " + d.deskripsi).toLowerCase().includes(kata);
        return cocokKategori && cocokKata;
      });

      $("#jumlah").text("Menampilkan " + hasil.length + " destinasi");
      $("#kosong-destinasi").toggleClass("d-none", hasil.length > 0);
      $("#daftar-destinasi").html(hasil.map(buatKartu).join(""));
    }

    tampilkan();

    // Jika dibuka dari link seperti destinasi.html#pantai-biru, scroll ke kartunya
    // (kartu dibuat lewat JavaScript, jadi harus di-scroll manual)
    if (location.hash && $(location.hash).length) {
      $(location.hash)[0].scrollIntoView();
    }

    // Event: hasil berubah saat mengetik, ganti kategori, atau klik tombol cari
    $("#cari").on("input", tampilkan);
    $("#kategori").on("change", tampilkan);
    $("#form-cari").on("submit", (e) => {
      e.preventDefault(); // cegah halaman reload
      tampilkan();
    });
  }, $("#status-destinasi"));
}

/* ---------- 4. REKOMENDASI ---------- */

// Skor kecocokan (total 100): jenis 40 + suasana 25 + tiket <= anggaran 25 + durasi 10
function hitungSkor(d, pref) {
  let skor = 0;
  if (pref.jenis.includes(d.kategori)) skor += 40;
  if (d.suasana === pref.suasana) skor += 25;
  if (d.tiket <= pref.anggaran) skor += 25;
  if (d.durasi <= pref.durasi) skor += 10;
  return skor;
}

function halamanRekomendasi() {
  const $form = $("#form-rekomendasi");

  $form.on("submit", function (e) {
    e.preventDefault();

    // Ambil checkbox jenis yang dicentang menjadi array, contoh: ["pantai", "alam"]
    const jenis = $("input[name='jenis']:checked").map(function () { return this.value; }).get();

    // Validasi: minimal 1 jenis dan semua isian wajib terisi benar
    $("#error-jenis").toggleClass("d-none", jenis.length > 0);
    $form.addClass("was-validated");
    if (jenis.length === 0 || !this.checkValidity()) return;

    const pref = {
      jenis: jenis,
      suasana: $("input[name='suasana']:checked").val(),
      anggaran: Number($("#anggaran").val()),
      durasi: Number($("#durasi").val())
    };

    $("#hasil-awal").addClass("d-none");
    $("#daftar-hasil").empty();

    ambilData((data) => {
      let hasil = [];
      data.forEach((d) => {
        hasil.push({ id: d.id, nama: d.nama, skor: hitungSkor(d, pref) });
      });
      hasil = hasil.filter((d) => d.skor > 0);
      hasil.sort((a, b) => b.skor - a.skor); // skor tertinggi di atas

      if (hasil.length === 0) {
        $("#status-hasil").html("<p>Belum ada destinasi yang cocok.</p>");
        return;
      }
      $("#daftar-hasil").html(hasil.map((d) => `
        <li class="list-group-item">
          <h3 class="h6 mb-1">${d.nama}</h3>
          <p class="mb-1">Kecocokan: <meter min="0" max="100" value="${d.skor}">${d.skor}%</meter> ${d.skor}%</p>
          <a href="destinasi.html#${d.id}" class="text-decoration-none">Lihat detail ${d.nama}</a>
        </li>`).join(""));
    }, $("#status-hasil"));
  });

  // Tombol "Kosongkan isian": bersihkan juga pesan error dan hasil
  $form.on("reset", () => {
    $form.removeClass("was-validated");
    $("#error-jenis").addClass("d-none");
    $("#status-hasil").empty();
    $("#daftar-hasil").empty();
    $("#hasil-awal").removeClass("d-none");
  });
}

/* ---------- 5. KONTAK (validasi form) ---------- */

function halamanKontak() {
  $("#form-kontak").on("submit", function (e) {
    e.preventDefault();
    $(this).addClass("was-validated"); // munculkan pesan error Bootstrap

    if (this.checkValidity()) {
      // Belum ada server, jadi pesan tidak benar-benar dikirim
      $("#sukses-kontak").removeClass("d-none");
      this.reset();
      $(this).removeClass("was-validated");
    } else {
      $("#sukses-kontak").addClass("d-none");
    }
  });
}

/* ---------- 6. JALANKAN SESUAI HALAMAN ---------- */

// $(function () {...}) = jalankan setelah HTML selesai dimuat
$(function () {
  const halaman = $("body").data("halaman"); // dari <body data-halaman="...">

  if (halaman === "beranda") halamanBeranda();
  if (halaman === "destinasi") halamanDestinasi();
  if (halaman === "rekomendasi") halamanRekomendasi();
  if (halaman === "kontak") halamanKontak();
});
