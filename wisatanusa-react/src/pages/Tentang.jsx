export default function Tentang() {
  return (
    <main className="container flex-grow-1 py-4 py-lg-5">
      <h1 className="text-primary mb-4">Tentang XYZ WisataNusa AI</h1>
      <div className="row g-5">
        <section className="col-lg-7">
          <h2>Tentang proyek</h2>
          <p className="lead">Platform digital yang mengintegrasikan informasi pariwisata Kabupaten XYZ dengan kecerdasan buatan untuk memberi rekomendasi destinasi yang relevan dan personal. Dikerjakan untuk Diskominfo Kabupaten XYZ.</p>
        </section>
        <section className="col-lg-5">
          <h2>Tim pengembang</h2>
          <ul className="list-group">
            <li className="list-group-item fw-semibold">I Made Radithya Kusuma Wardana</li>
            <li className="list-group-item fw-semibold">Muhammad Fauzan Bahri</li>
            <li className="list-group-item fw-semibold">Putu Gede Danu Mertha Teja</li>
            <li className="list-group-item fw-semibold">Razka Rabbany Nurdiyana</li>
            <li className="list-group-item fw-semibold">Rodzy Mahri Salim</li>
          </ul>
        </section>
      </div>
    </main>
  );
}