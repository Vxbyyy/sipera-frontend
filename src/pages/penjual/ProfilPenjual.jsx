import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "../../styles/penjual/ProfilPenjual.css";
import logoSipera from "../../assets/logo-sipera.jpeg";
import Footer from "../umum/Footer";
import useAuthStore from "../../store/authStore";

function ProfilPenjual() {
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

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    noTelepon: "",
    alamat: "",
    namaBank: "",
    nomorRekening: "",
    namaPemilikRekening: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/auth/profile");
      const user = response.data.user || response.data;

      setFormData({
        nama: user.nama || "",
        email: user.email || "",
        noTelepon: user.noTelepon || "",
        alamat: user.alamat || "",
        namaBank: user.namaBank || "",
        nomorRekening: user.nomorRekening || "",
        namaPemilikRekening: user.namaPemilikRekening || "",
      });
    } catch (error) {
      console.error("Gagal mengambil profil:", error);

      setFormData({
        nama: loggedInUser?.nama || "",
        email: loggedInUser?.email || "",
        noTelepon: loggedInUser?.noTelepon || "",
        alamat: loggedInUser?.alamat || "",
        namaBank: loggedInUser?.namaBank || "",
        nomorRekening: loggedInUser?.nomorRekening || "",
        namaPemilikRekening: loggedInUser?.namaPemilikRekening || "",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

  if(loggedInUser){

    setFormData({
      nama: loggedInUser.nama || "",
      email: loggedInUser.email || "",
      noTelepon: loggedInUser.noTelepon || "",
      alamat: loggedInUser.alamat || "",
      namaBank: loggedInUser.namaBank || "",
      nomorRekening: loggedInUser.nomorRekening || "",
      namaPemilikRekening:
        loggedInUser.namaPemilikRekening || "",
    });

  }

}, [loggedInUser]);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.nama.trim()) {
      alert("Nama lengkap wajib diisi.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.put("/api/auth/profile", formData);
      const updatedUser = response.data.user || response.data;

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
        setIsEditing(false);
      alert("Profil penjual berhasil diperbarui.");
    } catch (error) {
      console.error("Gagal menyimpan profil:", error);
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Gagal menyimpan profil penjual."
      );
    } finally {
      setSaving(false);
    }
  };

const handleLogout = () => {

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");

  logout();

  navigate("/login");
};

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="seller-profile-page">
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
          <NavLink to="/penjual" end>
            Beranda
          </NavLink>

          <NavLink to="/penjual/riwayat-ternak">
            Riwayat Ternak
          </NavLink>

          <NavLink to="/penjual/pesanan">
            Pesanan
          </NavLink>

          <NavLink to="/penjual/chat">
            Chat
          </NavLink>

          <NavLink to="/penjual/lapor-masalah">
            Laporan
          </NavLink>

          <NavLink to="/penjual/profil">
            Profil
          </NavLink>
        </div>

       <div className="app-user">
          <div>
            <strong>{formData.nama || loggedInUser?.nama || "Penjual"}</strong>
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

      <main className="app-main seller-profile-main">
      <section className="app-page-header">
        <span className="app-page-label">
          Dashboard Penjual
        </span>

        <h1>Profil Penjual</h1>

        <p>
          Kelola informasi akun, toko, dan rekening bank penjual SIPERA Anda.
        </p>
      </section>

        <section className="profile-form-card full-width">

  {/* FOTO PROFIL */}
  <div className="profile-header-user">

    <div className="profile-avatar">
      {(formData.nama || "P")
        .charAt(0)
        .toUpperCase()}
    </div>

    <div className="profile-user-info">
      <h2>
        {formData.nama || "Penjual SIPERA"}
      </h2>

      <p>
        {formData.email ||
          "penjual@sipera.com"}
      </p>

      <span className="profile-role">
        Seller
      </span>
    </div>

  </div>

  <div className="profile-title-row">
  <div className="profile-card-title">
    <i className="fas fa-user-cog"></i>
    <h2>Informasi Akun</h2>
  </div>

  {!isEditing && (
    <button
      type="button"
      className="profile-edit-btn"
      onClick={() => setIsEditing(true)}
    >
      Edit Profil
    </button>
  )}
</div>

  {loading ? (
    <p>Memuat profil penjual...</p>
  ) : (
    <form
      className="profile-form"
      onSubmit={handleSave}
    >

      <div className="profile-grid">

        <div className="profile-group">
          <label>Nama Lengkap</label>

          <input
          type="text"
          name="nama"
          value={formData.nama}
          onChange={handleChange}
          placeholder="Nama penjual"
          disabled={!isEditing}
        />
        </div>

        <div className="profile-group">
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
          />
        </div>

        <div className="profile-group full">
          <label>Nomor Telepon</label>

          <input
            type="text"
            name="noTelepon"
            value={formData.noTelepon}
            onChange={handleChange}
            placeholder="08xxxxxxxxxx"
            disabled={!isEditing}
          />
        </div>

      </div>

      <div className="profile-group">
        <label>Alamat Lengkap</label>

        <textarea
          name="alamat"
          value={formData.alamat}
          onChange={handleChange}
          placeholder="Masukkan alamat lengkap penjual"
          disabled={!isEditing}
        />
      </div>

      <div className="profile-card-title rekening-title">
        <i className="fas fa-credit-card"></i>
        <h2>Informasi Rekening Bank</h2>
      </div>

      <div className="profile-grid">

        <div className="profile-group">
          <label>Nama Bank</label>

          <input
            type="text"
            name="namaBank"
            value={formData.namaBank}
            onChange={handleChange}
            placeholder="Contoh: BRI / BCA / Mandiri"
            disabled={!isEditing}
          />
        </div>

        <div className="profile-group">
          <label>Nomor Rekening</label>

          <input
            type="text"
            name="nomorRekening"
            value={formData.nomorRekening}
            onChange={handleChange}
            placeholder="Masukkan nomor rekening"
            disabled={!isEditing}
          />
        </div>

        <div className="profile-group full">
            <label>Nama Pemilik Rekening</label>

            <input
              type="text"
              name="namaPemilikRekening"
              value={formData.namaPemilikRekening}
              onChange={handleChange}
              placeholder="Nama sesuai rekening bank"
              disabled={!isEditing}
            />
          </div>

      </div>

      {isEditing && (
  <div className="profile-action-buttons">

    <button
      type="submit"
      className="profile-save-btn"
      disabled={saving}
    >
      {saving
        ? "Menyimpan..."
        : "Simpan Perubahan"}
    </button>

    <button
      type="button"
      className="profile-cancel-btn"
      onClick={() => {
        setIsEditing(false);
        fetchProfile();
      }}
    >
      Batal
    </button>

  </div>
)}

    </form>
  )}

</section>
           </main>

<Footer />

    </div>
  );
}


export default ProfilPenjual;