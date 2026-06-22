import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "../../styles/penjual/RiwayatTernak.css";
import logoSipera from "../../assets/logo-sipera.jpeg";
import Footer from "../umum/Footer";

function RiwayatTernak() {
  const navigate = useNavigate();

  const [riwayatTernak, setRiwayatTernak] = useState([]);
  const [selectedTernak, setSelectedTernak] = useState(null);
  const [loading, setLoading] = useState(true);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(angka || 0));
  };

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";

    return new Date(tanggal).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getFotoTernak = (foto) => {
    if (!foto) return null;

    if (foto.startsWith("http")) {
      return foto;
    }

   return `${import.meta.env.VITE_API_URL}/uploads/${foto}`;
  };

  const getStatusTernak = (stok) => {
    return Number(stok) > 0 ? "Aktif" : "Terjual";
  };

  const fetchRiwayatTernak = async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/ternak");

      const semuaTernak = response.data || [];

      const ternakPenjual = loggedInUser?.id
        ? semuaTernak.filter(
            (ternak) => Number(ternak.userId) === Number(loggedInUser.id)
          )
        : semuaTernak;

      setRiwayatTernak(ternakPenjual);
    } catch (error) {
      console.error(
        "Gagal mengambil riwayat ternak:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Gagal mengambil data riwayat ternak dari database."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    fetchRiwayatTernak();
  }, []);

  const totalTernak = riwayatTernak.length;

  const totalAktif = riwayatTernak.filter(
    (ternak) => getStatusTernak(ternak.stok) === "Aktif"
  ).length;

  const totalTerjual = riwayatTernak.filter(
    (ternak) => getStatusTernak(ternak.stok) === "Terjual"
  ).length;

  return (
    <div className="riwayat-page">
      <nav className="app-navbar">
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

        <div className="app-nav-links">
          <NavLink
            to="/penjual"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Beranda
          </NavLink>

          <NavLink
            to="/penjual/riwayat-ternak"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Riwayat Ternak
          </NavLink>

          <NavLink
            to="/penjual/pesanan"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Pesanan
          </NavLink>

          <NavLink
            to="/penjual/chat"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Chat
          </NavLink>

          <NavLink
            to="/penjual/lapor-masalah"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Laporan
          </NavLink>

          <NavLink
            to="/penjual/profil"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Profil
          </NavLink>
        </div>

        <div className="app-user">
          <div>
            <strong>{loggedInUser?.nama || "Penjual"}</strong>
            <span>Seller</span>
          </div>

          <button
            type="button"
            className="app-logout"
            onClick={handleLogout}
          >
            ↪
          </button>
        </div>
      </nav>

      <main className="app-main">
      <section className="app-page-header">

        <span className="app-page-label">
          Dashboard Penjual
        </span>

        <h1>Riwayat Ternak</h1>

        <p>
          Kelola dan pantau semua data ternak yang pernah Anda tambahkan.
        </p>

      </section>

        <div className="summary">
          <div className="summary-card">
            <span>Total Ternak</span>
            <h3>{totalTernak}</h3>
          </div>

          <div className="summary-card">
            <span>Ternak Aktif</span>
            <h3>{totalAktif}</h3>
          </div>

          <div className="summary-card">
            <span>Terjual</span>
            <h3>{totalTerjual}</h3>
          </div>
        </div>

        <div className="history-card">
          <div className="history-header">
            <h2>Daftar Riwayat</h2>
            <p>Klik detail untuk melihat informasi lengkap ternak.</p>
          </div>

          <div className="history-list">
            {loading ? (
              <div className="empty-history">Memuat data riwayat ternak...</div>
            ) : riwayatTernak.length > 0 ? (
              riwayatTernak.map((item, index) => {
                const fotoUrl = getFotoTernak(item.foto);
                const status = getStatusTernak(item.stok);

                return (
                  <div className="history-item" key={item.id}>
                    <div className="history-number">{index + 1}</div>

                    {fotoUrl ? (
                      <img
                        src={fotoUrl}
                        alt={item.nama}
                        className="history-img"
                      />
                    ) : (
                      <div className="history-img-placeholder">No Image</div>
                    )}

                    <div className="history-info">
                      <h3>{item.nama}</h3>
                      <p>{item.deskripsi || "Belum ada deskripsi ternak."}</p>
                      <span>
                        {item.jenis} • {formatTanggal(item.createdAt)}
                      </span>
                    </div>

                    <div className="history-price">
                      <strong>{formatRupiah(item.harga)}</strong>
                      <span>Stok: {item.stok || 0}</span>
                    </div>

                    <span
                      className={
                        status === "Aktif" ? "badge aktif" : "badge terjual"
                      }
                    >
                      {status}
                    </span>

                    <button
                      type="button"
                      className="detail-btn"
                      onClick={() => setSelectedTernak(item)}
                    >
                      Detail
                    </button>
                  </div>
                );
              })
            ) : (
             <div className="empty-history"></div>
            )}
          </div>
        </div>
      

        {selectedTernak && (

  <div
    className="modal-overlay"
    onClick={() => setSelectedTernak(null)}
  >
    <div
      className="detail-card"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="close-btn"
        onClick={() => setSelectedTernak(null)}
      >
        <i className="fas fa-times"></i>
      </button>

  {getFotoTernak(selectedTernak.foto) ? (
    <img
      src={getFotoTernak(selectedTernak.foto)}
      alt={selectedTernak.nama}
      className="detail-img"
    />
  ) : (
    <div className="detail-img-placeholder">
      No Image
    </div>
  )}

  <div className="detail-content">
    <span className="page-label">
      Detail Ternak
    </span>

    <h2>{selectedTernak.nama}</h2>

    <div className="detail-price">
    {formatRupiah(selectedTernak.harga)}
  </div>
  
    <p className="detail-desc">
      {selectedTernak.deskripsi ||
        "Belum ada deskripsi ternak."}
    </p>

    <div className="detail-info-grid">

      <div>
        <span>Jenis</span>
        <strong>{selectedTernak.jenis || "-"}</strong>
      </div>

      <div>
        <span>Harga</span>
        <strong>
          {formatRupiah(selectedTernak.harga)}
        </strong>
      </div>

      <div>
        <span>Usia</span>
        <strong>{selectedTernak.usia || "-"}</strong>
      </div>

      <div>
        <span>Kondisi</span>
        <strong>{selectedTernak.kondisi || "-"}</strong>
      </div>

      <div>
        <span>Stok</span>
        <strong>{selectedTernak.stok || 0}</strong>
      </div>

      <div>
        <span>Status</span>
        <strong>
          {getStatusTernak(selectedTernak.stok)}
        </strong>
      </div>

      <div>
        <span>Lokasi</span>
        <strong>
          {selectedTernak.lokasi || "-"}
        </strong>
      </div>

      <div>
        <span>Tanggal Ditambahkan</span>
        <strong>
          {formatTanggal(
            selectedTernak.createdAt
          )}
        </strong>
      </div>
    </div>
  </div>
</div>

  </div>
)}

</main>

 <Footer />

    </div>
  );
}

export default RiwayatTernak;