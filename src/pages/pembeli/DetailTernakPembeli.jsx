import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import "../../styles/pembeli/DetailTernakPembeli.css";
import logoSipera from "../../assets/logo-sipera.jpeg";

function DetailTernakPembeli() {
  const { id } = useParams();
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const [ternak, setTernak] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(angka || 0));
  };

  const getFotoTernak = (foto) => {
    if (!foto) return null;

    if (foto.startsWith("http")) {
      return foto;
    }

    return `${import.meta.env.VITE_API_URL}/uploads/${foto}`;
  };

  const fetchDetailTernak = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/api/ternak/${id}`);
      setTernak(response.data);
    } catch (error) {
      console.error("Gagal mengambil detail ternak:", error);

      alert(
        error.response?.data?.message ||
          "Gagal mengambil detail postingan ternak."
      );

      navigate("/pembeli/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleChatPenjual = () => {
    const receiverId = ternak?.penjual?.id || ternak?.userId;
    const namaPenjual = ternak?.penjual?.nama || "Penjual SIPERA";

    if (!receiverId) {
      alert("Data penjual tidak ditemukan.");
      return;
    }

    navigate("/pembeli/chat", {
      state: {
        receiverId: Number(receiverId),
        namaPenjual,
      },
    });
  };

  const handleKePemesanan = () => {
    if (!ternak?.id) {
      alert("Data ternak tidak valid.");
      return;
    }

    navigate(`/pembeli/pemesanan/${ternak.id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    fetchDetailTernak();
  }, [id]);

  if (loading) {
    return (
      <div className="buyer-detail-page">
        <div className="detail-loading">Memuat detail postingan ternak...</div>
      </div>
    );
  }

  if (!ternak) {
    return (
      <div className="buyer-detail-page">
        <div className="detail-loading">Data ternak tidak ditemukan.</div>
      </div>
    );
  }

  const fotoUrl = getFotoTernak(ternak.foto);

  return (
    <div className="buyer-detail-page">
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
    <NavLink to="/pembeli" end>
      Beranda
    </NavLink>

    <NavLink to="/pembeli/transaksi">
      Transaksi
    </NavLink>

    <NavLink to="/pembeli/chat">
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

    <NavLink to="/pembeli/profil">
      Profil
    </NavLink>
  </div>

  <div className="app-user">
    <div>
      <strong>{loggedInUser?.nama || "Pembeli"}</strong>
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

      <main className="buyer-detail-main">
        <button
          type="button"
          className="back-detail-btn"
          onClick={() => navigate("/pembeli/dashboard")}
        >
          <i className="fas fa-arrow-left"></i>
          Kembali
        </button>

        <section className="detail-product-card">
          <div className="detail-product-image">
            {fotoUrl ? (
              <img src={fotoUrl} alt={ternak.nama} />
            ) : (
              <div className="detail-no-image">No Image</div>
            )}
          </div>

          <div className="detail-product-info">
            <div className="detail-badge-row">
              <span className="stock-badge">Stok {ternak.stok || 0}</span>
              <span className="status-badge-detail">Tersedia</span>
            </div>

            <h1>{ternak.nama}</h1>

            <div className="seller-box">
              <div className="seller-avatar">
                {(ternak?.penjual?.nama || "P").charAt(0).toUpperCase()}
              </div>

              <div>
                <p>Penjual</p>
                <h3>{ternak?.penjual?.nama || "Penjual SIPERA"}</h3>
                <span>
                  {ternak?.penjual?.alamat || ternak.lokasi || "Toraja"}
                </span>
              </div>
            </div>

            <h2 className="detail-price">{formatRupiah(ternak.harga)}</h2>

            <div className="detail-meta">
              <div>
                <span>Jenis</span>
                <strong>{ternak.jenis || "-"}</strong>
              </div>

              <div>
                <span>Usia</span>
                <strong>{ternak.usia || "-"}</strong>
              </div>

              <div>
                <span>Kondisi</span>
                <strong>{ternak.kondisi || "-"}</strong>
              </div>

              <div>
                <span>Lokasi</span>
                <strong>{ternak.lokasi || "-"}</strong>
              </div>
            </div>

            <div className="detail-description">
              <h3>Deskripsi Ternak</h3>
              <p>{ternak.deskripsi || "Belum ada deskripsi ternak."}</p>
            </div>

            <div className="detail-action-bottom">
              <button
                type="button"
                className="chat-detail-btn"
                onClick={handleChatPenjual}
              >
                <i className="fas fa-comments"></i>
                Chat
              </button>

              <button
                type="button"
                className="order-detail-btn"
                onClick={handleKePemesanan}
              >
                <i className="fas fa-shopping-cart"></i>
                Pesan Sekarang
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DetailTernakPembeli;