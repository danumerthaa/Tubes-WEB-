import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const BASE = import.meta.env.BASE_URL


const urlGambar = (path) =>
  /^(https?:)?\/\//.test(path) ? path : BASE + path.replace(/^\//, '')

export default function DetailDestinasi() {

  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')

  
  const [hasil, setHasil] = useState(null)

  useEffect(() => {
    if (!id) return
    let batal = false

  
    fetch(`${BASE}data/destinasi.json`)
      .then((res) => {
        if (!res.ok) throw new Error('Gagal memuat data')
        return res.json()
      })
      
      .then((data) => {
        if (!batal) setHasil({ id, destinasi: data.find((d) => d.id === id) ?? null })
      })
      .catch(() => {
        if (!batal) setHasil({ id, galat: true })
      })

    return () => {
      batal = true
    }
  }, [id])

  const siap = hasil !== null && hasil.id === id

  let isi
  if (!id) {
    isi = <p className="alert alert-danger" role="alert">Destinasi tidak ditemukan</p>
  } else if (!siap) {
    isi = <p role="status">Memuat detail destinasi...</p>
  } else if (hasil.galat) {
    isi = <p className="alert alert-danger" role="alert">Data gagal dimuat. Coba lagi nanti.</p>
  } else if (!hasil.destinasi) {
    isi = <p className="alert alert-danger" role="alert">Destinasi tidak ditemukan</p>
  } else {
    const d = hasil.destinasi
    isi = (
      <article className="row g-4 g-lg-5">
        <div className="col-lg-6">
          <img
            src={urlGambar(d.gambar)}
            alt={d.alt ?? d.nama}
            className="img-fluid rounded-3 shadow-sm tw-w-full tw-aspect-[4/3] tw-object-cover tw-bg-soft"
          />
        </div>
        <div className="col-lg-6">
          <h1 className="text-primary mb-1">{d.nama}</h1>
          <p className="text-secondary text-capitalize">{d.kategori}</p>
          <p>{d.deskripsi}</p>

          <dl className="tw-grid tw-grid-cols-[auto_1fr] tw-gap-x-4 tw-gap-y-2 border-top pt-3 mb-4">
            <dt className="text-secondary">Lokasi</dt>
            <dd className="mb-0">{d.lokasi || 'Kabupaten XYZ'}</dd>
            <dt className="text-secondary">Jam buka</dt>
            <dd className="mb-0">{d.jamBuka}</dd>
            <dt className="text-secondary">Tiket</dt>
            <dd className="mb-0">
              {typeof d.tiket === 'number' ? `Rp${d.tiket.toLocaleString('id-ID')}` : d.tiket}
            </dd>
            <dt className="text-secondary">Fasilitas</dt>
            <dd className="mb-0">
              <ul className="list-unstyled mb-0">
                {[].concat(d.fasilitas ?? []).map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </dd>
          </dl>

          <Link to="/destinasi" className="btn btn-primary rounded-pill px-4">
            Kembali ke daftar destinasi
          </Link>
        </div>
      </article>
    )
  }

  return <main className="container flex-grow-1 py-4 py-lg-5">{isi}</main>
}