import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import Beranda from './pages/Beranda';
import Destinasi from './pages/Destinasi';
import Rekomendasi from './pages/Rekomendasi';
import Tentang from './pages/Tentang';
import Kontak from './pages/Kontak';
import './index.css';

function Layout({ children }) {
  return (
    <>
      <header className="sticky-top bg-white border-bottom">
        <nav className="navbar navbar-expand-lg container">
          <Link className="navbar-brand fw-bold text-primary" to="/">XYZ WisataNusa AI</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="menu">
            <ul className="navbar-nav ms-auto gap-lg-1">
              <li className="nav-item"><NavLink className="nav-link px-3" to="/">Beranda</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link px-3" to="/destinasi">Destinasi</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link px-3" to="/rekomendasi">Rekomendasi AI</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link px-3" to="/tentang">Tentang</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link px-3" to="/kontak">Kontak</NavLink></li>
            </ul>
          </div>
        </nav>
      </header>
      {children}
      <footer className="tw-bg-ink tw-text-indigo-100 py-3 mt-auto">
        <div className="container small">&copy; 2026 Kelompok 7 - XYZ WisataNusa AI. Sponsor: Diskominfo Kabupaten XYZ.</div>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Beranda />} />
          <Route path="/destinasi" element={<Destinasi />} />
          <Route path="/rekomendasi" element={<Rekomendasi />} />
          <Route path="/tentang" element={<Tentang />} />
          <Route path="/kontak" element={<Kontak />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}