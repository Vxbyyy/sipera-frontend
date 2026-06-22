import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "../../styles/penjual/PesananPenjual.css";
import logoSipera from "../../assets/logo-sipera.jpeg";
import Footer from "../umum/Footer";

function PesananPenjual() {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const [pesanan, setPesanan] = useState([]);
  const [selectedPesanan, setSelectedPesanan] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const getBuktiTransferUrl = (buktiTransfer) => {
    if (!buktiTransfer) return null;

    if (buktiTransfer.startsWith("http")) {
      return buktiTransfer;
    }

   return `${import.meta.env.VITE_API_URL}/uploads/${buktiTransfer}`;
  };

  const fetchPesanan = async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/pesanan/penjual");
      setPesanan(response.data || []);
    } catch (error) {
      console.error("Gagal mengambil data pesanan:", error);
      alert(
        error.response?.data?.message ||
          "Gagal mengambil data pesanan dari database."
      );
    } finally {
      setLoading(false);
    }
  };

  const hitungStatistik = (status) => {
    return pesanan.filter((item) => item.status === status).length;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    fetchPesanan();
  }, []);

  const updateStatusPesanan = async (id, statusBaru) => {
  try {
    await api.patch(`/api/pesanan/${id}/status`, {
      status: statusBaru,
    });

    // refresh data tabel
    await fetchPesanan();

    // update data modal yang sedang terbuka
    setSelectedPesanan((prev) => ({
      ...prev,
      status: statusBaru,
    }));

    alert("Status pesanan berhasil diperbarui");
  } catch (error) {
    console.error(error);
    alert("Gagal memperbarui status pesanan");
  }
};

  return (
    <div className="seller-order-page">
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
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Beranda
        </NavLink>

        <NavLink
          to="/penjual/riwayat-ternak"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Riwayat Ternak
        </NavLink>

        <NavLink
          to="/penjual/pesanan"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Pesanan
        </NavLink>

        <NavLink
          to="/penjual/chat"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
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
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
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

      <main className="seller-order-main">
      <section className="app-page-header">
        <span className="app-page-label">
          Dashboard Penjual
        </span>

        <h1>Pesanan Masuk</h1>

        <p>
          Kelola pesanan pembeli yang masuk ke lapak ternak Anda.
        </p>
      </section>

        <section className="seller-order-stats">

  <div className="order-stat-card">
    <div className="order-stat-icon total">
      <i className="fas fa-shopping-cart"></i>
    </div>

    <div>
      <p>Total Pesanan</p>
      <h3>{pesanan.length}</h3>
    </div>
  </div>

  <div className="order-stat-card">
    <div className="order-stat-icon pending">
      <i className="fas fa-clock"></i>
    </div>

    <div>
      <p>Menunggu</p>
      <h3>{hitungStatistik("Menunggu")}</h3>
    </div>
  </div>

  <div className="order-stat-card">
    <div className="order-stat-icon process">
      <i className="fas fa-truck"></i>
    </div>

    <div>
      <p>Diproses</p>
      <h3>{hitungStatistik("Diproses")}</h3>
    </div>
  </div>

  <div className="order-stat-card">
    <div className="order-stat-icon done">
      <i className="fas fa-check-circle"></i>
    </div>

    <div>
      <p>Selesai</p>
      <h3>{hitungStatistik("Selesai")}</h3>
    </div>
  </div>

</section>

        <section className="seller-order-card">
          <div className="seller-order-card-title">
            <i className="fas fa-receipt"></i>
            <h2>Daftar Pesanan</h2>
          </div>

          <div className="seller-order-table-wrapper">
            <table className="seller-order-table">
              <thead>
                <tr>
                  <th>Pembeli</th>
                  <th>Ternak</th>
                  <th>Jumlah</th>
                  <th>Total</th>
                  <th>Pembayaran</th>
                  <th>Bukti Transfer</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9">Memuat data pesanan...</td>
                  </tr>
                ) : pesanan.length > 0 ? (
                  pesanan.map((item) => {
                    const buktiUrl = getBuktiTransferUrl(item.buktiTransfer);

                    return (
                      <tr key={item.id}>
                        <td>
                          {item.pembeli?.nama ||
                            item.namaPenerima ||
                            item.namaPembeli ||
                            "Pembeli"}
                        </td>

                        <td>{item.ternak?.nama || item.namaTernak || "-"}</td>

                        <td>{item.jumlah || 1}</td>

                        <td className="order-price">
                          {formatRupiah(
                            item.totalHarga || item.total || item.totalBayar || 0
                          )}
                        </td>

                        <td>
                          <span className="payment-method-badge">
                            {item.metodePembayaran || "-"}
                          </span>
                        </td>

                        <td>
                          {item.metodePembayaran === "Transfer" && buktiUrl ? (
                            <a
                              href={buktiUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="proof-link"
                            >
                              Lihat Bukti
                            </a>
                          ) : item.metodePembayaran === "Transfer" ? (
                            <span className="proof-empty">Belum ada</span>
                          ) : (
                            <span className="proof-cod">COD</span>
                          )}
                        </td>

                        <td>{formatTanggal(item.createdAt || item.tanggal)}</td>

                        <td>
                          <span
                            className={`order-status ${
                              item.status === "Selesai"
                                ? "done"
                                : item.status === "Sudah Dibayar"
                                ? "paid"
                                : item.status === "Diproses"
                                ? "process"
                                : "pending"
                            }`}
                          >
                            {item.status || "Menunggu"}
                          </span>
                        </td>

                        <td>
                        <button
                          type="button"
                          className="order-detail-btn"
                          onClick={() => setSelectedPesanan(item)}
                        >
                          Detail
                        </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9">
                      <div className="empty-order">
                        📦 Belum ada pesanan masuk
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
        {selectedPesanan && (
  <div
    className="modal-overlay"
    onClick={() => setSelectedPesanan(null)}
  >
    <div
      className="order-modal"
      onClick={(e) => e.stopPropagation()}
    >

      <h2>Detail Pesanan</h2>

<div className="order-detail-grid">

  <div className="detail-box">
  <div className="detail-icon">
    <i className="fas fa-user"></i>
  </div>
    <span>Pembeli</span>
    <strong>
      {selectedPesanan.pembeli?.nama ||
      selectedPesanan.namaPembeli ||
      "-"}
    </strong>
  </div>

  <div className="detail-box">
    <span>Ternak</span>
    <strong>
      {selectedPesanan.ternak?.nama ||
      selectedPesanan.namaTernak ||
      "-"}
    </strong>
  </div>

  <div className="detail-box">
    <span>Jumlah</span>
    <strong>{selectedPesanan.jumlah || 0}</strong>
  </div>

  <div className="detail-box">
    <span>Status</span>

    <span
      className={`order-status ${
        selectedPesanan.status === "Selesai"
          ? "done"
          : selectedPesanan.status === "Sudah Dibayar"
          ? "paid"
          : selectedPesanan.status === "Diproses"
          ? "process"
          : "pending"
      }`}
    >
      {selectedPesanan.status}
    </span>
  </div>

  <div className="detail-box">
    <span>Total Pembayaran</span>

    <strong>
      {formatRupiah(
        selectedPesanan.totalHarga ||
        selectedPesanan.total ||
        selectedPesanan.totalBayar ||
        0
      )}
    </strong>
  </div>

  <div className="detail-box">
    <span>Metode Pembayaran</span>

    <strong>
      {selectedPesanan.metodePembayaran || "-"}
    </strong>
  </div>

  <div className="detail-box">
    <span>Tanggal Pesanan</span>

    <strong>
      {formatTanggal(
        selectedPesanan.createdAt ||
        selectedPesanan.tanggal
      )}
    </strong>
  </div>

  <div className="detail-box">
    <span>Bukti Transfer</span>

    {selectedPesanan.metodePembayaran === "Transfer" &&
    selectedPesanan.buktiTransfer ? (
      <a
        href={getBuktiTransferUrl(
          selectedPesanan.buktiTransfer
        )}
        target="_blank"
        rel="noreferrer"
        className="proof-link"
      >
        Lihat Bukti
      </a>
    ) : (
      <strong>COD</strong>
    )}
  </div>

</div>

<div className="modal-action">

  {selectedPesanan.metodePembayaran === "COD" &&
   selectedPesanan.status === "Menunggu" ? (

    <>
      <button
        className="finish-order-btn"
        onClick={() =>
          updateStatusPesanan(
            selectedPesanan.id,
            "Selesai"
          )
        }
      >
        ✓ Tandai Selesai
      </button>

      <button
        className="close-modal-btn"
        onClick={() => setSelectedPesanan(null)}
      >
        Tutup
      </button>
    </>

  ) : (

    <button
      className="close-modal-btn full-width"
      onClick={() => setSelectedPesanan(null)}
    >
      Tutup
    </button>

  )}

</div>
    </div>
  </div>
        )}
            </main>

<Footer />

    </div>
  );
}

export default PesananPenjual;