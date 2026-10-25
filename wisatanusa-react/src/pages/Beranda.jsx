import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import KartuDestinasi from '../components/KartuDestinasi';

export default function Beranda() {
  const [destinasi, setDestinasi] = useState([]);
  const [status, setStatus] = useState('Memuat data...');

  useEffect(() => {
    fetch('/data/destinasi.json')
      .then(res => {
        if (!res.ok) throw new Error("Gagal");
        return res.json();
      })
      .then(data => {
        setDestinasi(data.slice(0, 3));
        setStatus('');
      })
      .catch(() => setStatus('Data gagal dimuat. Pastikan file ada di public/data/destinasi.json'));
  }, []);

  return (
    <main className="container flex-grow-1 py-4 py-lg-5">
      <section aria-labelledby="hero" className="hero-tenun tw-relative tw-bg-brand tw-text-white tw-rounded-2xl tw-px-6 tw-pt-10 tw-pb-14 lg:tw-px-16 lg:tw-pt-16 lg:tw-pb-24 lg:tw-grid lg:tw-grid-cols-[5fr_4fr] lg:tw-gap-12 lg:tw-items-end">
        <h1 id="hero" className="tw-text-4xl lg:tw-text-6xl tw-max-w-[18ch]">Temukan wisata Kabupaten XYZ yang cocok untukmu</h1>
        <div>
          <p className="tw-text-lg tw-text-indigo-100">Jelajahi destinasi dan dapatkan rekomendasi personal berbasis AI.</p>
          <p className="tw-flex tw-flex-wrap tw-gap-3 tw-mb-0">
            <Link to="/rekomendasi" className="btn btn-warning rounded-pill px-4">Coba rekomendasi AI</Link>
            <Link to="/destinasi" className="btn btn-outline-light rounded-pill px-4">Lihat semua destinasi</Link>
          </p>
        </div>
      </section>

      <section aria-labelledby="unggulan" className="mt-5">
        <h2 id="unggulan" className="mb-4">Destinasi unggulan</h2>
        {status ? <p className="text-danger fw-semibold">{status}</p> : (
          <ul className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 list-unstyled mb-0">
            {destinasi.map(d => <KartuDestinasi key={d.id} d={d} />)}
          </ul>
        )}
      </section>

      <section aria-labelledby="fitur" className="mt-5">
        <h2 id="fitur" className="mb-4">Kenapa WisataNusa AI?</h2>
        <ol className="row row-cols-1 row-cols-md-3 g-3 list-unstyled mb-0">
          <li className="col"><div className="tw-h-full tw-bg-white tw-border tw-border-l-[6px] tw-border-l-saffron tw-rounded-lg tw-p-5 tw-font-semibold">Informasi wisata terintegrasi dan mudah diakses.</div></li>
          <li className="col"><div className="tw-h-full tw-bg-white tw-border tw-border-l-[6px] tw-border-l-saffron tw-rounded-lg tw-p-5 tw-font-semibold">Rekomendasi AI sesuai preferensi dan anggaranmu.</div></li>
          <li className="col"><div className="tw-h-full tw-bg-white tw-border tw-border-l-[6px] tw-border-l-saffron tw-rounded-lg tw-p-5 tw-font-semibold">Membantu promosi potensi wisata Kabupaten XYZ.</div></li>
        </ol>
      </section>
    </main>
  );
}