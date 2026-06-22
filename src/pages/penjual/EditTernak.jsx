import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import api from "../../api/axiosConfig";
import "../../styles/penjual/EditTernak.css";
import logoSipera from "../../assets/logo-sipera.jpeg";

function EditTernak() {
  const navigate = useNavigate();
  const { id } = useParams();

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    nama: "",
    jenis: "",
    harga: "",
    usia: "",
    kondisi: "",
    stok: "",
    lokasi: "",
    deskripsi: "",
  });

  const [foto, setFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const getFotoUrl = (namaFoto) => {
    if (!namaFoto) return null;

    if (namaFoto.startsWith("http")) {
      return namaFoto;
    }

    return `${import.meta.env.VITE_API_URL}/uploads/${namaFoto}`;
  };

  const fetchDetailTernak = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/api/ternak/${id}`);
      const ternak = response.data;

      setFormData({
        nama: ternak.nama || "",
        jenis: ternak.jenis || "",
        harga: ternak.harga || "",
        usia: ternak.usia || "",
        kondisi: ternak.kondisi || "",
        stok: ternak.stok || "",
        lokasi: ternak.lokasi || "",
        deskripsi: ternak.deskripsi || "",
      });

      setPreviewFoto(getFotoUrl(ternak.foto));
    } catch (error) {
      console.error("Gagal mengambil detail ternak:", error);
      alert(
        error.response?.data?.message ||
          "Gagal mengambil detail ternak dari database."
      );
      navigate("/penjual");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFoto(file);
    setPreviewFoto(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const data = new FormData();

      data.append("nama", formData.nama);
      data.append("jenis", formData.jenis);
      data.append("harga", formData.harga);
      data.append("usia", formData.usia);
      data.append("kondisi", formData.kondisi);
      data.append("stok", formData.stok);
      data.append("lokasi", formData.lokasi);
      data.append("deskripsi", formData.deskripsi);

      if (foto) {
        data.append("foto", foto);
      }

      await api.put(`/api/ternak/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Data ternak berhasil diperbarui.");
      navigate("/penjual");
    } catch (error) {
      console.error("Gagal memperbarui ternak:", error);
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Gagal memperbarui data ternak."
      );
    } finally {
      setSaving(false);
    }
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
      <div className="edit-ternak-page">
        <div className="edit-loading">Memuat data ternak...</div>
      </div>
    );
  }

  return (
    <div className="edit-ternak-page">
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

      <main className="edit-ternak-main">
      <section className="app-page-header">

        <span className="app-page-label">
          Dashboard Penjual
        </span>

        <h1>Edit Data Ternak</h1>

        <p>
          Ubah data ternak yang sudah Anda tambahkan sebelumnya di SIPERA Toraja.
        </p>

      </section>

        <section className="edit-ternak-card">
          <form className="edit-ternak-form" onSubmit={handleSubmit}>
            <div className="edit-photo-section">
              <div className="photo-preview-box">
                {previewFoto ? (
                  <img src={previewFoto} alt="Preview ternak" />
                ) : (
                  <div className="photo-empty">Tidak ada foto</div>
                )}
              </div>

              <div>
                <label className="photo-label">Foto Ternak</label>
                <p className="photo-helper">
                  Pilih foto baru jika ingin mengganti foto ternak.
                </p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFotoChange}
                />
              </div>
            </div>

            <div className="edit-form-grid">
              <div className="edit-input-group">
                <label>Nama Ternak</label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="edit-input-group">
                <label>Jenis Ternak</label>
                <select
                  name="jenis"
                  value={formData.jenis}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih jenis ternak</option>
                  <option value="Kerbau">Kerbau</option>
                  <option value="Babi">Babi</option>
                  <option value="Kambing">Kambing</option>
                  <option value="Ayam">Ayam</option>
                  <option value="Sapi">Sapi</option>
                </select>
              </div>

              <div className="edit-input-group">
                <label>Harga</label>
                <input
                  type="number"
                  name="harga"
                  value={formData.harga}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="edit-input-group">
                <label>Usia</label>
                <input
                  type="text"
                  name="usia"
                  value={formData.usia}
                  onChange={handleChange}
                  placeholder="Contoh: 3 tahun"
                  required
                />
              </div>

              <div className="edit-input-group">
                <label>Kondisi</label>
                <input
                  type="text"
                  name="kondisi"
                  value={formData.kondisi}
                  onChange={handleChange}
                  placeholder="Contoh: Sehat"
                  required
                />
              </div>

              <div className="edit-input-group">
                <label>Stok</label>
                <input
                  type="number"
                  name="stok"
                  value={formData.stok}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="edit-input-group full">
                <label>Lokasi</label>
                <input
                  type="text"
                  name="lokasi"
                  value={formData.lokasi}
                  onChange={handleChange}
                  placeholder="Contoh: Rantepao, Toraja Utara"
                  required
                />
              </div>

              <div className="edit-input-group full">
                <label>Deskripsi</label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  placeholder="Tuliskan deskripsi ternak..."
                ></textarea>
              </div>
            </div>

            <div className="edit-form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/penjual")}
              >
                Batal
              </button>

              <button type="submit" className="save-btn" disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default EditTernak;