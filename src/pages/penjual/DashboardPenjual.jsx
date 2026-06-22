import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import "../../styles/penjual/DashboardPenjual.css";
import logoSipera from "../../assets/logo-sipera.jpeg";
import Footer from "../umum/Footer";
import useAuthStore from "../../store/authStore";

function DashboardPenjual() {
  const navigate = useNavigate();

  const [dataTernak, setDataTernak] = useState([]);
  const [loading, setLoading] = useState(true);

  const loggedInUser =
  useAuthStore(
    (state) => state.user
  );

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(angka || 0));
  };

  const getFotoTernak = (foto) => {
    if (!foto) {
      return null;
    }

    if (foto.startsWith("http")) {
      return foto;
    }

   return `${import.meta.env.VITE_API_URL}/uploads/${foto}`;
  };

  const fetchTernak = async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/ternak");

      const semuaTernak = response.data || [];

      const ternakPenjual = loggedInUser?.id
        ? semuaTernak.filter((ternak) => ternak.userId === loggedInUser.id)
        : semuaTernak;

      setDataTernak(ternakPenjual);
    } catch (error) {
      console.error("Gagal mengambil data ternak:", error);
      alert("Gagal mengambil data ternak dari database.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTernak = async (id) => {
    const konfirmasi = window.confirm(
      "Apakah Anda yakin ingin menghapus data ternak ini?"
    );

    if (!konfirmasi) return;

    try {
      await api.delete(`/api/ternak/${id}`);

      setDataTernak((prevData) =>
        prevData.filter((ternak) => ternak.id !== id)
      );

      alert("Data ternak berhasil dihapus.");
    } catch (error) {
      console.error("Gagal menghapus data ternak:", error);

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Gagal menghapus data ternak."
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    fetchTernak();
  }, []);

  return (
    <div className="seller-dashboard">
      <nav className="app-navbar">
        <div className="app-logo">
        <img
          src={logoSipera}
          alt="SIPERA Toraja"
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

        <h1>Dashboard Penjual</h1>

        <p>
          Kelola seluruh data ternak yang Anda jual
          melalui platform SIPERA Toraja.
        </p>

        <Link
          to="/penjual/tambah-ternak"
          className="add-button"
        >
          + Tambah Ternak
        </Link>
      </section>

        <section className="seller-table-card">
          <table>
            <thead>
              <tr>
                <th>Foto</th>
                <th>Ternak</th>
                <th>Jenis</th>
                <th>Usia</th>
                <th>Stok</th>
                <th>Harga</th>
                <th>Status</th>
                <th className="aksi">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    Memuat data ternak...
                  </td>
                </tr>
              ) : dataTernak.length > 0 ? (
                dataTernak.map((ternak) => {
                  const fotoUrl = getFotoTernak(ternak.foto);

                  return (
                    <tr key={ternak.id}>
                      <td>
                        {fotoUrl ? (
                          <img
                            src={fotoUrl}
                            alt={ternak.nama}
                            className="ternak-photo"
                          />
                        ) : (
                          <div className="ternak-photo-placeholder">
                            No Image
                          </div>
                        )}
                      </td>

                      <td className="ternak-name">{ternak.nama}</td>
                      <td>{ternak.jenis}</td>
                      <td>{ternak.usia}</td>
                      <td>{ternak.stok}</td>
                      <td className="price">{formatRupiah(ternak.harga)}</td>
                      <td>
                        <span className="status-badge">Tersedia</span>
                      </td>

                      <td className="aksi">
                        <div className="action-icon-wrapper">
                          <Link
                            to={`/penjual/edit-ternak/${ternak.id}`}
                            className="action-icon-btn edit-icon-btn"
                            title="Edit ternak"
                          >
                            <i className="fas fa-pen"></i>
                          </Link>

                          <button
                            type="button"
                            className="action-icon-btn delete-icon-btn"
                            onClick={() => handleDeleteTernak(ternak.id)}
                            title="Hapus ternak"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    Belum ada data ternak.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>

<Footer />

</div>
);
}

export default DashboardPenjual;