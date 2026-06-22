import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "../../styles/pembeli/DashboardPembeli.css";
import logoSipera from "../../assets/logo-sipera.jpeg";
import Footer from "../umum/Footer";
import useAuthStore from "../../store/authStore";

function DashboardPembeli() {
  const navigate = useNavigate();
const logout =
useAuthStore(
(state) => state.logout
);
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("Semua");
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
    if (!foto) return null;

    if (foto.startsWith("http")) {
      return foto;
    }

    return `${import.meta.env.VITE_API_URL}/uploads/${foto}`;
  };

  const fetchTernak = async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/ternak");

      setDataTernak(response.data || []);
    } catch (error) {
      console.error("Gagal mengambil data ternak:", error);
      alert(
        error.response?.data?.message ||
          "Gagal mengambil data ternak dari database."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTernak();
  }, []);

  const filteredTernak = dataTernak.filter((ternak) => {
    const nama = ternak.nama || "";
    const jenis = ternak.jenis || "";
    const lokasi = ternak.lokasi || "";

    const cocokSearch =
      nama.toLowerCase().includes(search.toLowerCase()) ||
      jenis.toLowerCase().includes(search.toLowerCase()) ||
      lokasi.toLowerCase().includes(search.toLowerCase());

    const cocokKategori = kategori === "Semua" || jenis === kategori;

    return cocokSearch && cocokKategori;
  });

  const handleChat = (ternak) => {
    if (!ternak.userId) {
      alert("Data penjual tidak ditemukan.");
      return;
    }

    navigate("/pembeli/chat", {
      state: {
        receiverId: ternak.userId,
        namaPenjual: ternak.penjual?.nama || "Penjual",
      },
    });
  };

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    logout();

    navigate("/login");
  };

  return (
    <div className="buyer-dashboard">
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
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Beranda
          </NavLink>

          <NavLink
            to="/pembeli/transaksi"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Transaksi
          </NavLink>

          <NavLink
            to="/pembeli/chat"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Chat
          </NavLink>

          <NavLink to="/pembeli/lapor-masalah">
          Lapor Masalah
        </NavLink>

          <NavLink
            to="/pembeli/profil"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
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

      <main className="app-main">
  <section className="app-page-header">
        <span className="page-label">
          Dashboard Pembeli
        </span>

        <h1>Pasar Ternak Toraja</h1>

        <p>
          Temukan ternak terbaik untuk kebutuhan adat,
          konsumsi, dan keperluan adat Toraja.
        </p>

        <div className="buyer-tools">
          <div className="search-box">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Cari jenis kerbau/babi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-tabs">
            {["Semua", "Kerbau", "Babi", "Kambing", "Ayam", "Sapi"].map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  className={kategori === item ? "active" : ""}
                  onClick={() => setKategori(item)}
                >
                  {item}
                </button>
              )
            )}
          </div>
        </div>
      </section>

        <section className="buyer-grid">
          {loading ? (
            <div className="buyer-empty">Memuat data ternak dari database...</div>
          ) : filteredTernak.length > 0 ? (
            filteredTernak.map((ternak) => {
              const fotoUrl = getFotoTernak(ternak.foto);

              return (
                <div
                  className="buyer-card"
                  key={ternak.id}
                  onClick={() =>
                    navigate(`/pembeli/detail-ternak/${ternak.id}`)
                  }
                  style={{ cursor: "pointer" }}
                >
                  {fotoUrl ? (
                    <img src={fotoUrl} alt={ternak.nama} />
                  ) : (
                    <div className="buyer-card-img-placeholder">No Image</div>
                  )}

                  <div className="buyer-card-body">
                    <span className="stock-badge">
                      Stok {ternak.stok || 0}
                    </span>

                    <h3>{ternak.nama}</h3>

                    <div className="meta">
                      <span>⌖ {ternak.lokasi || "-"}</span>
                      <span>⌑ {ternak.usia || "-"}</span>
                    </div>

                    <div className="buyer-info">
                      <p>
                        <strong>Jenis:</strong> {ternak.jenis || "-"}
                      </p>
                      <p>
                        <strong>Kondisi:</strong> {ternak.kondisi || "-"}
                      </p>
                    </div>

                    <div className="card-bottom">
                      <p className="price">{formatRupiah(ternak.harga)}</p>

                      <div className="card-actions">
                        <button
                          type="button"
                          className="detail-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            navigate(`/pembeli/pemesanan/${ternak.id}`);
                          }}
                        >
                          Pesan
                        </button>

                        <button
                          type="button"
                          className="chat-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChat(ternak);
                          }}
                        >
                          Chat
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="buyer-empty">
              Tidak ada data ternak yang sesuai dengan pencarian.
            </div>
          )}
        </section>
</main>

<Footer />

</div>
  );
}

export default DashboardPembeli;