import { useState } from 'react';

export default function Kontak() {
  const [terkirim, setTerkirim] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTerkirim(true);
  };

  return (
    <main className="container flex-grow-1 py-4 py-lg-5">
      <h1 className="text-primary mb-4">Hubungi kami</h1>
      <div className="row g-4">
        <div className="col-lg-4">
          <address className="tw-bg-soft tw-rounded-lg tw-p-4">
            Diskominfo Kabupaten XYZ<br />
            Email: <a href="mailto:info@example.com">info@example.com</a>
          </address>
        </div>
        <div className="col-lg-8">
          {terkirim && <p className="alert alert-success" role="status">Terima kasih! Pesanmu sudah terkirim.</p>}
          <form onSubmit={handleSubmit} className="bg-white border rounded p-3 p-lg-4">
            <div className="mb-3">
              <label htmlFor="nama" className="form-label fw-semibold">Nama</label>
              <input type="text" className="form-control" id="nama" required minLength="3" />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">Email</label>
              <input type="email" className="form-control" id="email" required />
            </div>
            <div className="mb-3">
              <label htmlFor="pesan" className="form-label fw-semibold">Pesan</label>
              <textarea className="form-control" id="pesan" rows="4" required minLength="10"></textarea>
            </div>
            <button type="submit" className="btn btn-primary rounded-pill px-4">Kirim pesan</button>
          </form>
        </div>
      </div>
    </main>
  );
}