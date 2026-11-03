import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Pilihan jenis wisata. Ditulis sekali di sini, lalu di-map jadi 4 checkbox.
const JENIS = [
  { nilai: 'pantai', label: 'Pantai' },
  { nilai: 'alam', label: 'Alam' },
  { nilai: 'budaya', label: 'Budaya' },
  { nilai: 'kuliner', label: 'Kuliner' },
];

// "AI" disimulasikan dengan aturan berbobot (rule-based). Total maksimal 100.
//   jenis wisata cocok  : 40
//   suasana cocok       : 25
//   tiket sesuai budget : 25 (kalau kemahalan, dapat sebagian sesuai rasio)
//   durasi muat         : 10
function hitungSkor(d, pref) {
  let skor = 0;
  if (pref.jenis.includes(d.kategori)) skor += 40;
  if (d.suasana === pref.suasana) skor += 25;
  if (d.tiket <= pref.anggaran) skor += 25;
  else skor += Math.round((25 * pref.anggaran) / d.tiket);
  if (d.durasi <= pref.durasi) skor += 10;
  return skor;
}

export default function Rekomendasi() {
  // --- data dari JSON (pola sama dengan Destinasi.jsx) ---
  const [destinasi, setDestinasi] = useState([]);
  const [status, setStatus] = useState('Memuat data...');

  // --- isian form: 1 state untuk 1 isian ---
  const [jenis, setJenis] = useState([]);
  const [suasana, setSuasana] = useState('tenang');
  const [anggaran, setAnggaran] = useState('100000');
  const [durasi, setDurasi] = useState('1');
  const [catatan, setCatatan] = useState('');

  // --- validasi & hasil ---
  const [errors, setErrors] = useState({});
  const [hasil, setHasil] = useState(null); // null = belum pernah dihitung

  useEffect(() => {
    fetch('/data/destinasi.json')
      .then((res) => {
        if (!res.ok) throw new Error('Gagal');
        return res.json();
      })
      .then((data) => {
        setDestinasi(data);
        setStatus('');
      })
      .catch(() => {
        setStatus('Data gagal dimuat. Pastikan file ada di public/data/destinasi.json');
      });
  }, []);

  // Centang/lepas centang: tambah atau buang nilai dari array jenis
  const toggleJenis = (nilai) => {
    setJenis((lama) =>
      lama.includes(nilai) ? lama.filter((j) => j !== nilai) : [...lama, nilai]
    );
  };

  // Validasi sisi klien. Mengembalikan objek berisi pesan error per isian.
  const validasi = () => {
    const err = {};
    if (jenis.length === 0) err.jenis = 'Pilih minimal satu jenis wisata.';
    if (anggaran === '') err.anggaran = 'Anggaran wajib diisi.';
    else if (Number(anggaran) < 0) err.anggaran = 'Anggaran tidak boleh negatif.';
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // cegah halaman reload
    const err = validasi();
    setErrors(err);
    if (Object.keys(err).length > 0) {
      setHasil(null);
      return;
    }

    const pref = {
      jenis,
      suasana,
      anggaran: Number(anggaran),
      durasi: Number(durasi),
    };

    const urut = destinasi
      .map((d) => ({ ...d, skor: hitungSkor(d, pref) })) // tambah field skor
      .sort((a, b) => b.skor - a.skor); // skor tertinggi di atas
    setHasil(urut);
  };

  // Form ini "controlled" (nilainya dipegang state), jadi reset = kembalikan state
  const handleReset = () => {
    setJenis([]);
    setSuasana('tenang');
    setAnggaran('100000');
    setDurasi('1');
    setCatatan('');
    setErrors({});
    setHasil(null);
  };

  return (
    <main className="container flex-grow-1 py-4 py-lg-5">
      <h1 className="text-primary">Rekomendasi wisata AI</h1>
      <p className="text-secondary mb-4">Isi preferensimu, lalu sistem menghitung destinasi yang paling cocok.</p>

      {status && (
        <p className={status.includes('gagal') ? 'alert alert-danger' : 'text-secondary'} role="status">
          {status}
        </p>
      )}

      <div className="row g-4">
        {/* ===== Kolom kiri: form ===== */}
        <div className="col-lg-7">
          <form onSubmit={handleSubmit} className="bg-white border rounded p-3 p-lg-4" noValidate>
            <fieldset className="mb-3">
              <legend className="fs-6 fw-semibold">Jenis wisata yang kamu suka</legend>
              {JENIS.map((j) => (
                <div className="form-check form-check-inline" key={j.nilai}>
                  <input
                    className={`form-check-input ${errors.jenis ? 'is-invalid' : ''}`}
                    type="checkbox"
                    id={`jenis-${j.nilai}`}
                    checked={jenis.includes(j.nilai)}
                    onChange={() => toggleJenis(j.nilai)}
                  />
                  <label className="form-check-label" htmlFor={`jenis-${j.nilai}`}>{j.label}</label>
                </div>
              ))}
              {errors.jenis && <div className="text-danger small mt-1" role="alert">{errors.jenis}</div>}
            </fieldset>

            <fieldset className="mb-3">
              <legend className="fs-6 fw-semibold">Suasana</legend>
              {['tenang', 'ramai'].map((s) => (
                <div className="form-check form-check-inline" key={s}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="suasana"
                    id={`suasana-${s}`}
                    checked={suasana === s}
                    onChange={() => setSuasana(s)}
                  />
                  <label className="form-check-label text-capitalize" htmlFor={`suasana-${s}`}>{s}</label>
                </div>
              ))}
            </fieldset>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label htmlFor="anggaran" className="form-label fw-semibold">Anggaran per orang (Rp)</label>
                <input
                  type="number"
                  id="anggaran"
                  className={`form-control ${errors.anggaran ? 'is-invalid' : ''}`}
                  min="0"
                  step="10000"
                  value={anggaran}
                  onChange={(e) => setAnggaran(e.target.value)}
                />
                <div className="invalid-feedback">{errors.anggaran}</div>
              </div>
              <div className="col-md-6">
                <label htmlFor="durasi" className="form-label fw-semibold">Durasi kunjungan</label>
                <select
                  id="durasi"
                  className="form-select"
                  value={durasi}
                  onChange={(e) => setDurasi(e.target.value)}
                >
                  <option value="1">1 hari</option>
                  <option value="2">2 hari</option>
                  <option value="3">3 hari atau lebih</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="catatan" className="form-label fw-semibold">Catatan tambahan</label>
              <textarea
                id="catatan"
                className="form-control"
                rows="3"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={status !== ''}>
              Lihat rekomendasi
            </button>
            <button type="button" className="btn btn-outline-primary rounded-pill px-4 ms-2" onClick={handleReset}>
              Kosongkan isian
            </button>
          </form>
        </div>

        {/* ===== Kolom kanan: hasil ===== */}
        <div className="col-lg-5">
          <section
            aria-labelledby="hasil"
            aria-live="polite"
            className="tw-bg-soft tw-rounded-lg tw-p-4 sticky-lg-top"
            style={{ top: '5rem' }}
          >
            <h2 id="hasil" className="h3 mb-3">Hasil rekomendasi</h2>

            {hasil === null ? (
              <p className="mb-0 text-secondary">
                Isi preferensimu lalu klik "Lihat rekomendasi" untuk melihat destinasi yang paling cocok.
              </p>
            ) : (
              <ol className="list-unstyled d-grid gap-3 mb-0">
                {hasil.map((d, i) => (
                  <li key={d.id}>
                    <article className="bg-white border rounded p-3">
                      <h3 className="h5 d-flex align-items-center">
                        <span className="tw-inline-grid tw-place-items-center tw-w-7 tw-h-7 tw-rounded-full tw-bg-saffron tw-text-sm tw-mr-2">
                          {i + 1}
                        </span>
                        {d.nama}
                      </h3>
                      <p className="mb-2">
                        Kecocokan: <meter min="0" max="100" value={d.skor}>{d.skor}%</meter> {d.skor}%
                      </p>
                      <Link to={`/destinasi#${d.id}`}>Lihat detail {d.nama}</Link>
                    </article>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
