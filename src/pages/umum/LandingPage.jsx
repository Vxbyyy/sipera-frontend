import { Link, NavLink } from "react-router-dom";
import "../../styles/umum/LandingPage.css";

import kerbauImg from "../../assets/kerbau.jpeg";
import babiImg from "../../assets/babi.jpg";
import kambingImg from "../../assets/kambing.jpeg";
import ayamImg from "../../assets/ayam.jpg";
import rumahImg from "../../assets/hero.jpeg";
import Footer from "./Footer";
import logoSipera from "../../assets/logo-sipera.jpeg";

function LandingPage() {
  const daftarTernak = [
    {
      id: 1,
      nama: "Kerbau Toraja",
      harga: "Rp 100.000.000",
      gambar: kerbauImg,
    },
    {
      id: 2,
      nama: "Babi",
      harga: "Rp 8.000.000",
      gambar: babiImg,
    },
    {
      id: 3,
      nama: "Kambing",
      harga: "Rp 6.000.000",
      gambar: kambingImg,
    },
    {
      id: 4,
      nama: "Ayam Kampung",
      harga: "Rp 150.000",
      gambar: ayamImg,
    },
  ];

  return (
    <div className="landing-page">
      
      {/* ===== NAVBAR ===== */}
      <header className="app-navbar">
      <div className="app-logo">
        <img
          src={logoSipera}
          alt="Logo SIPERA"
          className="app-logo-image"
        />

        <h2>
          SIPERA <span>TORAJA</span>
        </h2>
      </div>

        <nav className="app-nav-links">
          <Link to="/" className="active">Beranda</Link>
          <Link to="/login">Masuk</Link>
          <Link to="/register">
            Daftar
          </Link>
        </nav>
      </header>

      {/* ===== HERO ===== */}
      <section className="hero-section" id="beranda">
        <div className="hero-left">
          <span className="badge">WARISAN BUDAYA TORAJA</span>

          <h1>
            Pasar Ternak <br />
            <span>Terpercaya</span> <br />
            untuk Acara Adat
          </h1>

          <p>
            SIPERA adalah platform digital untuk jual beli ternak khas
            Toraja seperti kerbau, babi, kambing, dan ayam untuk kebutuhan
            acara adat maupun peternakan.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="primary-btn">
              Mulai Bergabung
            </Link>

            <Link to="/login" className="secondary-btn">
              Lihat Katalog
            </Link>
          </div>
        </div>

        <div className="hero-right">
          <img src={rumahImg} alt="Hero SIPERA" />
        </div>
      </section>

      {/* ===== STATISTIK ===== */}
      <section className="stats-section">
        <div className="stat-box">
          <h2>500+</h2>
          <p>Ternak Terjual</p>
        </div>

        <div className="stat-box">
          <h2>120+</h2>
          <p>Peternak Aktif</p>
        </div>

        <div className="stat-box">
          <h2>15+</h2>
          <p>Kecamatan Terjangkau</p>
        </div>

        <div className="stat-box">
          <h2>4.9/5</h2>
          <p>Kepuasan Pembeli</p>
        </div>
      </section>

      {/* ===== DAFTAR TERNAK ===== */}
      <section className="animal-section" id="katalog">
        <div className="section-title">
          <h2>Daftar Hewan Ternak</h2>
          <p>
            Pembeli dapat melihat daftar ternak dan harga sebelum melakukan
            pemesanan.
          </p>
        </div>

        <div className="animal-grid">
          {daftarTernak.map((ternak) => (
            <div className="animal-card" key={ternak.id}>
              <img src={ternak.gambar} alt={ternak.nama} />

              <div className="animal-content">
                <h3>{ternak.nama}</h3>
                <p className="animal-price">{ternak.harga}</p>

                <Link to="/login" className="order-button">
                  Pesan Sekarang
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

{/* ===== INFO ===== */}
<section className="info-section" id="tentang">

  <div className="info-card">
    <div className="info-icon">🐃</div>

    <h3>Tentang SIPERA</h3>

    <p>
      SIPERA merupakan platform digital yang membantu masyarakat Toraja
      dalam proses jual beli ternak secara lebih mudah, aman, dan
      transparan untuk kebutuhan adat maupun peternakan.
    </p>
  </div>

  <div className="info-card">
    <div className="info-icon">📋</div>

    <h3>Cara Pemesanan</h3>

    <ul className="order-flow">
      <li>Pilih ternak yang tersedia</li>
      <li>Lihat detail dan harga ternak</li>
      <li>Login atau registrasi akun</li>
      <li>Lakukan pemesanan melalui dashboard</li>
      <li>Penjual akan memproses pesanan</li>
    </ul>
  </div>

</section>

{/* ===== FOOTER ===== */}
<Footer />

</div>
);
}

export default LandingPage;