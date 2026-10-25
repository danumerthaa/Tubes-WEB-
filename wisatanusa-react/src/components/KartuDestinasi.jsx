export default function KartuDestinasi({ d }) {
  return (
    <li className="col">
      <article className="card h-100 shadow-sm tw-scroll-mt-24" id={d.id}>
        <img src={d.gambar} className="card-img-top tw-aspect-[4/3] tw-object-cover tw-bg-soft" alt={d.alt} />
        <div className="card-body">
          <h3 className="h4">{d.nama}</h3>
          <p>{d.deskripsi}</p>
          <dl className="tw-grid tw-grid-cols-[auto_1fr] tw-gap-x-4 tw-gap-y-1 tw-text-sm tw-border-t tw-pt-3 tw-mb-0">
            <dt className="text-secondary">Kategori</dt><dd className="mb-0 text-capitalize">{d.kategori}</dd>
            <dt className="text-secondary">Jam buka</dt><dd className="mb-0">{d.jamBuka}</dd>
            <dt className="text-secondary">Tiket</dt><dd className="mb-0">Rp{d.tiket.toLocaleString("id-ID")}</dd>
            <dt className="text-secondary">Fasilitas</dt><dd className="mb-0">{d.fasilitas}</dd>
          </dl>
        </div>
      </article>
    </li>
  );
}