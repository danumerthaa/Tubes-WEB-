import { useState, useEffect } from 'react';
import KartuDestinasi from '../components/KartuDestinasi';

export default function Destinasi() {
  const [destinasi, setDestinasi] = useState([]);
  const [status, setStatus] = useState('Memuat data...');
  const [kataKunci, setKataKunci] = useState('');
  const [kategori, setKategori] = useState('');

  useEffect(() => {
    fetch('/data/destinasi.json')
      .then((res) => {
        if (!res.ok) throw new Error("Gagal");
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

  const hasil = destinasi.filter((d) => {
    const cocokKategori = kategori === "" || d.kategori === kategori;
    const cocokKata = (d.nama + " " + d.deskripsi).toLowerCase().includes(kataKunci.toLowerCase());
    return cocokKategori && cocokKata;
  });

  return (
    <main className="container flex-grow-1 py-4 py-lg-5">
      <h1 className="text-primary mb-4">Daftar destinasi</h1>
      
      <div className="row g-3 align-items-end bg-white border rounded p-3 mb-4">
        <div className="col-12 col-md-5">
          <label htmlFor="cari" className="form-label fw-semibold">Cari destinasi</label>
          <input 
            type="search" 
            className="form-control" 
            id="cari" 
            value={kataKunci} 
            onChange={(e) => setKataKunci(e.target.value)} 
            placeholder="Contoh: pantai" 
          />
        </div>
        <div className="col-12 col-md-4">
          <label htmlFor="kategori" className="form-label fw-semibold">Kategori</label>
          <select 
            className="form-select" 
            id="kategori" 
            value={kategori} 
            onChange={(e) => setKategori(e.target.value)}
          >
            <option value="">Semua</option>
            <option value="pantai">Pantai</option>
            <option value="alam">Alam</option>
            <option value="budaya">Budaya</option>
            <option value="kuliner">Kuliner</option>
          </select>
        </div>
      </div>

      {status ? (
        <p className={status.includes('gagal') ? 'alert alert-danger' : 'text-center py-4'} role="status">
          {status}
        </p>
      ) : (
        <>
          <p className="fw-semibold" aria-live="polite">
            Menampilkan {hasil.length} destinasi
          </p>
          
          {hasil.length === 0 && (
            <p className="alert alert-warning" role="status">
              Tidak ada destinasi yang cocok dengan pencarianmu.
            </p>
          )}

          <ul className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 list-unstyled mb-0">
            {hasil.map((d) => (
              <KartuDestinasi key={d.id} d={d} />
            ))}
          </ul>
        </>
      )}
    </main>
  );
}