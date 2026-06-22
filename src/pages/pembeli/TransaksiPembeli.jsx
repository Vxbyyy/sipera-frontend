import {  Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import "../../styles/pembeli/TransaksiPembeli.css";
import logoSipera from "../../assets/logo-sipera.jpeg";
import Footer from "../umum/Footer";

function TransaksiPembeli() {
  const navigate = useNavigate();

  const [transaksi, setTransaksi] = useState([]);
  const [loading, setLoading] = useState(true);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(angka || 0));
  };

  const fetchPesanan = async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/pesanan/pembeli");

      console.log("DATA PESANAN:", response.data);

      setTransaksi(response.data || []);
    } catch (error) {
      console.error("Gagal mengambil transaksi:", error);

      alert(
        error.response?.data?.message ||
          "Gagal mengambil data transaksi."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPesanan();
  }, []);

  const jumlahMenunggu = transaksi.filter(
    (item) => item.status === "Menunggu"
  ).length;

  const jumlahDiproses = transaksi.filter(
    (item) => item.status === "Diproses"
  ).length;

  const jumlahSelesai = transaksi.filter(
    (item) => item.status === "Selesai"
  ).length;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    navigate("/login");
  };

  return (
    <div className="buyer-transaction-page">
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
          to="/pembeli"
          end
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Beranda
        </NavLink>

        <NavLink
          to="/pembeli/transaksi"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Transaksi
        </NavLink>

        <NavLink
          to="/pembeli/chat"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Chat
        </NavLink>

        <NavLink
          to="/pembeli/lapor-masalah"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Lapor Masalah
        </NavLink>

        <NavLink
          to="/pembeli/profil"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Profil
        </NavLink>
      </div>

        <div className="app-user">
          <div>
            <strong>
              {loggedInUser?.nama || "Pembeli"}
            </strong>

            <span>Buyer</span>
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
          Dashboard Pembeli
        </span>

        <h1>Transaksi Saya</h1>

        <p>
          Pantau status transaksi pembelian ternak Anda
          di SIPERA Toraja.
        </p>
      </section>

        <section className="buyer-transaction-stats">
          <div className="transaction-stat-card">
            <div className="transaction-stat-icon pending">
              <i className="fas fa-wallet"></i>
            </div>

            <div>
              <p>Menunggu</p>
              <h3>{jumlahMenunggu}</h3>
            </div>
          </div>

          <div className="transaction-stat-card">
            <div className="transaction-stat-icon process">
              <i className="fas fa-truck"></i>
            </div>

            <div>
              <p>Diproses</p>
              <h3>{jumlahDiproses}</h3>
            </div>
          </div>

          <div className="transaction-stat-card">
            <div className="transaction-stat-icon done">
              <i className="fas fa-check-circle"></i>
            </div>

            <div>
              <p>Selesai</p>
              <h3>{jumlahSelesai}</h3>
            </div>
          </div>
        </section>

        <section className="buyer-transaction-card">
          <div className="buyer-transaction-card-title">
            <i className="fas fa-file-invoice"></i>
            <h2>Riwayat Transaksi</h2>
          </div>

          <div className="buyer-transaction-table-wrapper">
            <table className="buyer-transaction-table">
              <thead>
                <tr>
                  <th>Ternak</th>
                  <th>Penjual</th>
                  <th>Jumlah</th>
                  <th>Total</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7">
                      Memuat data transaksi...
                    </td>
                  </tr>
                ) : transaksi.length > 0 ? (
                  transaksi.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {item.namaTernak || "-"}
                      </td>

                      <td>
                        {item.namaPenjual ||
                          "Penjual"}
                      </td>

                      <td>{item.jumlah}</td>

                      <td className="transaction-price">
                        {formatRupiah(item.total)}
                      </td>

                      <td>
                        {new Date(
                          item.createdAt
                        ).toLocaleDateString(
                          "id-ID"
                        )}
                      </td>

                      <td>
                        <span
                          className={`transaction-status ${
                            item.status ===
                            "Selesai"
                              ? "done"
                              : item.status ===
                                "Diproses"
                              ? "process"
                              : "pending"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="transaction-detail-btn"
                          onClick={() =>
                            navigate(
                            (`/pembeli/detail-pesanan/${item.id}`)
                            )
                          }
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">
                      Belum ada transaksi
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Footer />

    </div>
  );
}

export default TransaksiPembeli;