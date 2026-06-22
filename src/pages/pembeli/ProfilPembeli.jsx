import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../../styles/pembeli/ProfilPembeli.css";
import logoSipera from "../../assets/logo-sipera.jpeg";
import Footer from "../umum/Footer";
import api from "../../api/axiosConfig";
import useAuthStore from "../../store/authStore";

function ProfilPembeli() {
  const navigate = useNavigate();
const loggedInUser =
useAuthStore(
(state) => state.user
);
const setUser =
useAuthStore(
(state) => state.setUser
);
const logout =
useAuthStore(
(state) => state.logout
);
  const [isEditing, setIsEditing] = useState(false);
const handleLogout = () => {

localStorage.removeItem("token");

logout();

navigate("/login");
};

const [formData, setFormData] = useState({
  nama: "",
  noTelepon: "",
  alamat: "",
});
useEffect(() => {

  if (loggedInUser) {

    setFormData({
      nama: loggedInUser.nama || "",
      noTelepon: loggedInUser.noTelepon || "",
      alamat: loggedInUser.alamat || "",
    });

  }

}, [loggedInUser]);

  const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const handleSaveProfile = async () => {
  try {
    const response = await api.put(
      "/api/auth/profile",
      {
        nama: formData.nama,
        noTelepon: formData.noTelepon,
        alamat: formData.alamat,
      }
    );

    const updatedUser = response.data.user;

localStorage.setItem(
  "user",
  JSON.stringify(updatedUser)
);

setUser(updatedUser);

    alert("Profil berhasil diperbarui");

    setIsEditing(false);

  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Gagal memperbarui profil"
    );
  }
};

  return (
    <div className="buyer-profile-page">
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

        <NavLink to="/pembeli/lapor-masalah">
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

      <main className="app-main">

<section className="app-page-header">
        <span className="app-page-label">
          Dashboard Pembeli
        </span>

        <h1>Profil Pembeli</h1>

        <p>
          Kelola informasi akun pembeli SIPERA Toraja.
        </p>
      </section>

        <section className="buyer-profile-layout">
          <div className="buyer-profile-card">
            <div className="buyer-profile-avatar">
              {(loggedInUser?.nama || "P").charAt(0).toUpperCase()}
            </div>

            <h2>{loggedInUser?.nama || "Pembeli SIPERA"}</h2>
            <p>{loggedInUser?.email || "pembeli@sipera.com"}</p>

            <span className="buyer-profile-role">Buyer</span>
          </div>

<div className="buyer-profile-form-card">
  <div className="buyer-profile-card-title">
    <i className="fas fa-user-cog"></i>
    <h2>Informasi Akun</h2>
  </div>

  {!isEditing ? (
    <div className="buyer-profile-view">
      <div className="buyer-info-item">
        <strong>Nama Lengkap</strong>
        <span>{loggedInUser?.nama || "-"}</span>
      </div>

      <div className="buyer-info-item">
        <strong>Email</strong>
        <span>{loggedInUser?.email || "-"}</span>
      </div>

      <div className="buyer-info-item">
        <strong>Nomor Telepon</strong>
        <span>{loggedInUser?.noTelepon || "-"}</span>
      </div>

      <div className="buyer-info-item">
        <strong>Alamat</strong>
        <span>{loggedInUser?.alamat || "-"}</span>
      </div>

      <button
        className="buyer-profile-save-btn"
        onClick={() => setIsEditing(true)}
      >
        Edit Profil
      </button>
    </div>
  ) : (
    <form className="buyer-profile-form">
      <div className="buyer-profile-grid">
        <div className="buyer-profile-group">
          <label>Nama Lengkap</label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
          />
        </div>

        <div className="buyer-profile-group">
          <label>Email</label>
          <input
            type="email"
            defaultValue={loggedInUser?.email || ""}
            disabled
          />
        </div>

        <div className="buyer-profile-group">
          <label>Nomor Telepon</label>
          <input
            type="text"
            name="noTelepon"
            value={formData.noTelepon}
            onChange={handleChange}
          />
        </div>

      </div>

      <div className="buyer-profile-group">
        <label>Alamat Lengkap</label>
        <textarea
          name="alamat"
          value={formData.alamat}
          onChange={handleChange}
        />
      </div>

      <button
        type="button"
        className="buyer-profile-save-btn"
        onClick={handleSaveProfile}
      >
        Simpan Perubahan
      </button>

      <button
        type="button"
        className="buyer-profile-cancel-btn"
        onClick={() => setIsEditing(false)}
      >
        Batal
      </button>
    </form>
  )}
</div>
        </section>
      </main>
      <Footer />

    </div>
  );
}

export default ProfilPembeli;