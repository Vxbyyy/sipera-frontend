import footerToraja from "../../assets/footer-toraja.png";
import logoSipera from "../../assets/logo-sipera.jpeg";
import {
  NavLink,
  useLocation,
} from "react-router-dom";
import useAuthStore from "../../store/authStore";

function Footer() {

  const location = useLocation();

const role =
useAuthStore(
  (state) => state.role
);

const currentRole =
(role || "").toLowerCase();
  const renderNavigation = () => {

    // LANDING PAGE + LOGIN + REGISTER
    if (
      location.pathname === "/" ||
      location.pathname === "/login" ||
      location.pathname === "/register"
    ) {
      return (
        <>
          <li>
            <a href="/#beranda">
              Beranda
            </a>
          </li>

          <li>
            <a href="/#katalog">
              Katalog Ternak
            </a>
          </li>

          <li>
            <a href="/#tentang">
              Tentang SIPERA
            </a>
          </li>

          <li>
            <NavLink to="/login">
              Login
            </NavLink>
          </li>

          <li>
            <NavLink to="/register">
              Register
            </NavLink>
          </li>
        </>
      );
    }

    // PENJUAL
    if (currentRole === "penjual") {
      return (
        <>
          <li>
            <NavLink to="/penjual">
              Beranda
            </NavLink>
          </li>

          <li>
            <NavLink to="/penjual/riwayat-ternak">
              Riwayat Ternak
            </NavLink>
          </li>

          <li>
            <NavLink to="/penjual/pesanan">
              Pesanan
            </NavLink>
          </li>

          <li>
            <NavLink to="/penjual/chat">
              Chat
            </NavLink>
          </li>

          <li>
            <NavLink to="/penjual/lapor-masalah">
              Laporan
            </NavLink>
          </li>

          <li>
            <NavLink to="/penjual/profil">
              Profil
            </NavLink>
          </li>
        </>
      );
    }

    // PEMBELI
    if (currentRole === "pembeli") {
      return (
        <>
          <li>
            <NavLink to="/pembeli">
              Beranda
            </NavLink>
          </li>

          <li>
            <NavLink to="/pembeli/transaksi">
              Transaksi
            </NavLink>
          </li>

          <li>
            <NavLink to="/pembeli/chat">
              Chat
            </NavLink>
          </li>

          <li>
            <NavLink to="/pembeli/lapor-masalah">
              Lapor Masalah
            </NavLink>
          </li>

          <li>
            <NavLink to="/pembeli/profil">
              Profil
            </NavLink>
          </li>
        </>
      );
    }

    // ADMIN
    if (currentRole === "admin") {
      return (
        <>
          <li>
            <NavLink to="/admin/dashboard">
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/laporan">
              Laporan
            </NavLink>
          </li>
        </>
      );
    }

    return null;
  };

  return (
    <>
      <footer className="app-footer">

        <div className="footer-brand">

          <div className="sipera-logo">
            <img
              src={logoSipera}
              alt="SIPERA Toraja"
            />

            <h2>
              SIPERA <span>TORAJA</span>
            </h2>
          </div>

          <p>
            Sistem Informasi Penjualan Ternak Toraja.
            Menghubungkan peternak lokal dengan
            pembeli secara transparan dan efisien.
          </p>

        </div>

        <div className="footer-nav">

          <h3>Navigasi</h3>

          <ul>
            {renderNavigation()}
          </ul>

        </div>

        <div className="footer-contact">

          <h3>Hubungi Kami</h3>

          <ul>

            <li>
              <a
                href="https://instagram.com/vxbyy_"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-instagram"></i>
                vxbyy_
              </a>
            </li>

            <li>
              <a
                href="https://instagram.com/evapalembangann_"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-instagram"></i>
                evapalembangann_
              </a>
            </li>

            <li>
              <a
                href="https://instagram.com/alnisyaputri_"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-instagram"></i>
                alnisyaputri_
              </a>
            </li>

          </ul>

        </div>

      </footer>

      <div className="app-footer-banner">
        <img
          src={footerToraja}
          alt="Footer Toraja"
        />
      </div>
    </>
  );
}

export default Footer;