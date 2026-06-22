
import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "../../styles/penjual/LaporMasalah.css";
import logoSipera from "../../assets/logo-sipera.jpeg";
import Footer from "../umum/Footer";

function LaporMasalah() {

      const navigate = useNavigate();

      const loggedInUser = JSON.parse(localStorage.getItem("user"));

      const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        navigate("/login");
      };
      
  const [kategori, setKategori] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [loading, setLoading] = useState(false);


  const [laporanSaya, setLaporanSaya] = useState([]);
  const [balasanUser, setBalasanUser] = useState({});

  useEffect(() => {
    getLaporanSaya();
  }, []);

  const getLaporanSaya = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      console.log("User tidak ditemukan");
      return;
    }

    const response = await api.get(
      `/api/laporan/user/${user.id}`
    );

    setLaporanSaya(response.data);
  } catch (error) {
    console.error("Gagal mengambil laporan:", error);
  }
};

  const submitLaporan = async (e) => {
    e.preventDefault();

    if (!kategori || !deskripsi) {
      alert("Silakan lengkapi semua data.");
      return;
    }

    try {
      setLoading(true);

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (!user) {
        alert(
          "Data pengguna tidak ditemukan. Silakan login kembali."
        );
        return;
      }

      await api.post("/api/laporan", {
        kategori,
        deskripsi,
        userId: user.id,
      });

      alert("Laporan berhasil dikirim.");

      setKategori("");
      setDeskripsi("");

      getLaporanSaya();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Gagal mengirim laporan."
      );
    } finally {
      setLoading(false);
    }
  };

  const kirimBalasanUser = async (id) => {
    try {
      if (!balasanUser[id]) {
        alert("Isi balasan terlebih dahulu");
        return;
      }

      await api.patch(
        `/api/laporan/${id}/balas-user`,
        {
          balasanUser: balasanUser[id],
        }
      );

      alert("Balasan berhasil dikirim");

      setBalasanUser({
        ...balasanUser,
        [id]: "",
      });

      getLaporanSaya();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Gagal mengirim balasan"
      );
    }
        };

return (
  <>

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
          className={({isActive}) =>
          isActive ? "active" : ""
          }
          >
          Beranda
          </NavLink>

        <NavLink to="/penjual/riwayat-ternak">
          Riwayat Ternak
        </NavLink>

        <NavLink to="/penjual/pesanan">
          Pesanan
        </NavLink>

        <NavLink
          to="/penjual/chat"
          className={({isActive}) =>
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
            className={({isActive}) =>
            isActive ? "active" : ""
            }
            >
            Profil
            </NavLink>
      </div>

      <div className="app-user">
        <div>
          <strong>{loggedInUser?.nama}</strong>
          <span>Seller</span>
        </div>

<button
  className="app-logout"
  onClick={handleLogout}
>
  ↪
</button>
      </div>
    </nav>

<div className="lapor-page">

<main className="app-main">

  {/* HEADER CARD */}
  <section className="app-page-header">
    <span className="app-page-label">
      Dashboard Penjual
    </span>

    <h1>Laporan Masalah</h1>

    <p>
      Laporkan kendala yang Anda alami selama menggunakan SIPERA Toraja.
    </p>
  </section>

  {/* CARD FORM */}
  <section className="lapor-card">


<form onSubmit={submitLaporan}>
          <div className="form-group">
            <label>Kategori Masalah</label>

            <select
              value={kategori}
              onChange={(e) =>
                setKategori(e.target.value)
              }
              required
            >
              <option value="">
                Pilih kategori
              </option>

              <option value="Akun">
                Akun
              </option>

              <option value="Transaksi">
                Transaksi
              </option>

              <option value="Pembeli">
                Pembeli
              </option>

              <option value="Ternak">
                Ternak
              </option>

              <option value="Chat">
                Chat
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>
              Deskripsi Masalah
            </label>

            <textarea
              value={deskripsi}
              onChange={(e) =>
                setDeskripsi(e.target.value)
              }
              rows="6"
              placeholder="Jelaskan masalah yang Anda alami..."
              required
            />
          </div>

          <div className="lapor-actions">
            <button
              type="submit"
              className="btn-kirim"
              disabled={loading}
            >
              {loading
                ? "Mengirim..."
                : "Kirim Laporan"}
            </button>
          </div>
        </form>

{/* RIWAYAT LAPORAN */}

<div className="riwayat-laporan">
  <h2>Riwayat Laporan Saya</h2>

  {laporanSaya.length > 0 ? (
    laporanSaya.map((item) => (
      <div
        key={item.id}
        className="laporan-item"
      >
        <div className="laporan-item-header">
          <span className="kategori-badge">
            {item.kategori}
          </span>

          <span
            className={`status-badge ${
              item.status === "Selesai"
                ? "selesai"
                : "menunggu"
            }`}
          >
            {item.status}
          </span>
        </div>

        {/* LAPORAN */}
        <div className="laporan-section">
          <h4>Laporan</h4>

          <div className="info-box">
            {item.deskripsi}
          </div>
        </div>

        {/* BALASAN ADMIN */}
        <div className="laporan-section">
          <h4>Balasan Admin</h4>

          <div className="info-box">
            {item.balasan ||
              "Belum ada balasan dari admin"}
          </div>
        </div>

        {/* BALASAN USER */}
{item.balasan && (
  <div className="laporan-extra">

    {item.balasanUser && (
      <div className="laporan-section">
        <h4>Balasan Terakhir Saya</h4>

        <div className="user-reply-box">
          <p>{item.balasanUser}</p>
        </div>
      </div>
    )}

    <div className="user-reply-section">
      <h4>Balas Lagi</h4>

      <textarea
        rows="4"
        placeholder="Tulis balasan Anda..."
        value={balasanUser[item.id] || ""}
        onChange={(e) =>
          setBalasanUser({
            ...balasanUser,
            [item.id]: e.target.value,
          })
        }
      />
      <button
        type="button"
        className="btn-reply-user"
        onClick={() => kirimBalasanUser(item.id)}
      >
        Kirim Balasan
      </button>
    </div>

  </div>
)}
      </div>
    ))
  ) : (
    <div className="kosong-laporan">
      Belum ada laporan yang dikirim.
    </div>
  )}
        </div>
      </section>
        </main>

<Footer />

  </div>

  </>
);
}

export default LaporMasalah;