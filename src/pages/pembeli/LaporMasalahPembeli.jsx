import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate} from "react-router-dom";
import logoSipera from "../../assets/logo-sipera.jpeg";
import api from "../../api/axiosConfig";
import "../../styles/pembeli/LaporMasalahPembeli.css";
import Footer from "../umum/Footer";

function LaporMasalahPembeli() {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse( localStorage.getItem("user"));
  const [kategori, setKategori] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [loading, setLoading] = useState(false);

  const [laporanSaya, setLaporanSaya] = useState([]);
  const [balasanUser, setBalasanUser] = useState({});
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    navigate("/login");
  };

  useEffect(() => {
    getLaporanSaya();
  }, []);

  const getLaporanSaya = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const response = await api.get(
        `/api/laporan/user/${user.id}`
      );

      setLaporanSaya(response.data);
    } catch (error) {
      console.error(
        "Gagal mengambil laporan:",
        error
      );
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

      const response = await api.post(
        "/api/laporan",
        {
          kategori,
          deskripsi,
          userId: user.id,
        }
      );

      console.log(
        "Laporan berhasil:",
        response.data
      );

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
  <div className="lapor-page">

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
        >
          Beranda
        </NavLink>

        <NavLink to="/pembeli/transaksi">
          Transaksi
        </NavLink>

        <NavLink to="/pembeli/chat">
          Chat
        </NavLink>

        <NavLink to="/pembeli/lapor-masalah">
          Lapor Masalah
        </NavLink>

        <NavLink to="/pembeli/profil">
          Profil
        </NavLink>

      </div>

      <div className="app-user">
        <div>
          <strong>
            {loggedInUser?.nama ||
              "Pembeli"}
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

    <h1>Lapor Masalah</h1>

    <p>
      Sampaikan kendala atau masalah
      yang Anda alami selama menggunakan
      SIPERA Toraja.
    </p>
  </section>

     <div className="lapor-form-card">

      <div className="section-title">
        <h2>Buat Laporan Baru</h2>
        <p>Sampaikan kendala yang sedang Anda alami.</p>
      </div>

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

              <option value="Penjual">
                Penjual
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
</div>
        {/* RIWAYAT LAPORAN */}

        <div className="riwayat-card">

        <div className="section-title">
          <h2>Riwayat Laporan Saya</h2>
          <p>Laporan yang pernah Anda kirim.</p>
        </div>

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
                      item.status ===
                      "Selesai"
                        ? "selesai"
                        : "menunggu"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <p>
                  <strong>
                    Laporan:
                  </strong>
                </p>

                <p>{item.deskripsi}</p>

                <p>
                  <strong>
                    Balasan Admin:
                  </strong>
                </p>

                <div className="balasan-box">
                  {item.balasan ||
                    "Belum ada balasan dari admin"}
                </div>

                {item.balasanUser && (
                <div className="user-reply-box">
                  <strong>Balasan Terakhir:</strong>
                  <p>{item.balasanUser}</p>
                </div>
              )}

                  <div className="user-reply-section">
                    <label>
                      Balasan:
                    </label>

                    <textarea
                      rows="3"
                      placeholder="Tulis balasan Anda..."
                      value={
                        balasanUser[item.id] || ""
                      }
                      onChange={(e) =>
                        setBalasanUser({
                          ...balasanUser,
                          [item.id]:
                            e.target.value,
                        })
                      }
                    />

                    <button
                      className="btn-reply-user"
                      onClick={() =>
                        kirimBalasanUser(
                          item.id
                        )
                      }
                    >
                      Kirim Balasan
                    </button>

                  </div>
              </div>
            ))
          ) : (
            <div className="kosong-laporan">
              Belum ada laporan yang dikirim.
            </div>
          )}
          
         </div> {/* riwayat-card */}

      </main>

      <Footer />

    </div>
  );
}

export default LaporMasalahPembeli;