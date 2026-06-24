import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import api from "../../api/axiosConfig";
import "../../styles/pembeli/DetailPemesanan.css";
import logoSipera from "../../assets/logo-sipera.jpeg";

function DetailPemesanan() {
  const { id } = useParams();
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const [ternak, setTernak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jumlah, setJumlah] = useState(1);
  const [metodePembayaran, setMetodePembayaran] = useState("COD");
  const [buktiTransfer, setBuktiTransfer] = useState(null);
  const [previewBukti, setPreviewBukti] = useState(null);
  const [catatan, setCatatan] = useState("");

  const [namaPenerima, setNamaPenerima] = useState(loggedInUser?.nama || "");
  const [noTelepon, setNoTelepon] = useState(loggedInUser?.noTelepon || "");
  const [alamatUtama, setAlamatUtama] = useState(loggedInUser?.alamat || "");
  const [detailAlamat, setDetailAlamat] = useState("");
  const [jadikanDefault, setJadikanDefault] = useState(true);

  const [saving, setSaving] = useState(false);

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
      alert("Gagal mengambil detail ternak.");
      navigate("/pembeli");
    } finally {
      setLoading(false);
    }
  };

  const handleBuktiChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setBuktiTransfer(file);
    setPreviewBukti(URL.createObjectURL(file));
  };
  

  const handleBuatPesanan = async () => {
  if (!ternak) return;

  if (!namaPenerima.trim()) {
    alert("Nama penerima wajib diisi.");
    return;
  }

  if (!noTelepon.trim()) {
    alert("Nomor telepon wajib diisi.");
    return;
  }

  if (!alamatUtama.trim()) {
    alert("Alamat utama wajib diisi.");
    return;
  }

  if (!detailAlamat.trim()) {
    alert("Detail alamat wajib diisi.");
    return;
  }

  const konfirmasi = window.confirm(
    "Apakah Anda yakin ingin membuat pesanan?"
  );

  if (!konfirmasi) return;

  try {
    setSaving(true);

     const payload = {
    ternakId: ternak.id,
    jumlah,
    metodePembayaran,
};

    console.log("PAYLOAD:", payload);

    const response = await api.post(
      "/api/pesanan",
      payload
    );

    console.log(response.data);

    alert("Pesanan berhasil dibuat");

    navigate("/pembeli/transaksi");

  } catch (error) {

    console.error(error);

    alert(
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Gagal membuat pesanan"
    );

  } finally {
    setSaving(false);
  }
};

  const handleResetAlamat = () => {
    setNamaPenerima("");
    setNoTelepon("");
    setAlamatUtama("");
    setDetailAlamat("");
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
      <div className="order-detail-page">
        <div className="order-loading">Memuat detail pemesanan...</div>
      </div>
    );
  }

  if (!ternak) {
    return (
      <div className="order-detail-page">
        <div className="order-loading">Data ternak tidak ditemukan.</div>
      </div>
    );
  }


  const fotoUrl = getFotoTernak(ternak.foto);
  const subtotalProduk = Number(ternak.harga || 0) * Number(jumlah || 1);
  const biayaLayanan = 2000;
  const total = subtotalProduk + biayaLayanan;

  return (
    <div className="order-detail-page">
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
          <NavLink to="/pembeli/transaksi">Transaksi</NavLink>
          <NavLink to="/pembeli/chat">Chat</NavLink>
          <NavLink to="/pembeli/lapor-masalah">Lapor Masalah</NavLink>
          <NavLink to="/pembeli/profil">Profil</NavLink>
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

      <main className="order-main">
        <button
          type="button"
          className="order-back-btn"
          onClick={() => navigate(`/pembeli/detail-ternak/${ternak.id}`)}
        >
          <i className="fas fa-arrow-left"></i>
          Kembali
        </button>

        <section className="order-layout">
          <div className="order-left">
            <div className="order-address-card">
              <div className="address-title-row">
                <h2>Detail Alamat</h2>

                <button
                  type="button"
                  className="delete-address-btn"
                  title="Hapus alamat"
                  onClick={handleResetAlamat}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>

              <div className="order-input-group">
                <label>Nama Lengkap</label>
                <input
                  type="text"
                  value={namaPenerima}
                  onChange={(e) => setNamaPenerima(e.target.value)}
                  placeholder="Masukkan nama lengkap..."
                />
              </div>

              <div className="order-input-group">
                <label>Nomor Telepon</label>
                <div className="phone-input-box">
                  <span>ID +62</span>
                  <input
                    type="text"
                    value={noTelepon}
                    onChange={(e) => setNoTelepon(e.target.value)}
                    placeholder="82358371448"
                  />
                </div>
              </div>

              <div className="order-input-group">
                <label>Alamat</label>

                <div className="address-select-box">
                  <div>
                    <strong>
                      {alamatUtama || "Pilih atau masukkan alamat utama"}
                    </strong>
                    <p>
                      {alamatUtama
                        ? "Alamat utama pengiriman pesanan"
                        : "Contoh: Rantepao, Toraja Utara, Sulawesi Selatan"}
                    </p>
                  </div>

                  <i className="fas fa-chevron-right"></i>
                </div>

                <textarea
                  value={alamatUtama}
                  onChange={(e) => setAlamatUtama(e.target.value)}
                  placeholder="Masukkan alamat utama..."
                ></textarea>
              </div>

              <div className="order-input-group">
                <label>Detail Alamat</label>
                <input
                  type="text"
                  value={detailAlamat}
                  onChange={(e) => setDetailAlamat(e.target.value)}
                  placeholder="Contoh: Rumah warna putih, dekat gereja, toko, atau patokan lain..."
                />
              </div>

              <label className="default-address-row">
                <span>Tetapkan sebagai default</span>

                <input
                  type="checkbox"
                  checked={jadikanDefault}
                  onChange={(e) => setJadikanDefault(e.target.checked)}
                />

                <div className="toggle-switch"></div>
              </label>

              <p className="address-policy-text">
                Dengan mengklik Buat Pesanan, Anda menyatakan bahwa data alamat
                yang dimasukkan sudah benar.
              </p>
            </div>

            <div className="order-product-card">
              <div className="seller-row">
                <span>Penjual</span>
                <strong>{ternak?.penjual?.nama || "Penjual SIPERA"}</strong>
              </div>

              <div className="product-row">
                {fotoUrl ? (
                  <img src={fotoUrl} alt={ternak.nama} />
                ) : (
                  <div className="product-no-image">No Image</div>
                )}

                <div className="product-info">
                  <h3>{ternak.nama}</h3>
                  <p>
                    {ternak.jenis} • {ternak.usia}
                  </p>
                  <span>{ternak.kondisi}</span>
                  <strong>{formatRupiah(ternak.harga)}</strong>
                </div>

                <div className="qty-box">
                  <button
                    type="button"
                    onClick={() =>
                      setJumlah((prev) => Math.max(1, Number(prev) - 1))
                    }
                  >
                    -
                  </button>

                  <span>{jumlah}</span>

                  <button
                    type="button"
                    onClick={() => setJumlah((prev) => Number(prev) + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="order-input-group">
                <label>Catatan untuk Penjual</label>
                <input
                  type="text"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Contoh: Saya ingin lihat ternak dulu..."
                />
              </div>
            </div>

            <div className="payment-card">
              <h2>Metode Pembayaran</h2>

              <label className="payment-option">
                <div>
                  <span className="payment-badge cod">COD</span>
                  <strong>Bayar di Tempat</strong>
                  <p>Pembayaran dilakukan saat bertemu dengan penjual.</p>
                </div>

                <input
                  type="radio"
                  name="metodePembayaran"
                  value="COD"
                  checked={metodePembayaran === "COD"}
                  onChange={(e) => setMetodePembayaran(e.target.value)}
                />
              </label>

              <label className="payment-option">
                <div>
                  <span className="payment-badge transfer">Transfer</span>
                  <strong>Transfer Bank</strong>
                  <p>Transfer ke rekening penjual dan upload bukti pembayaran.</p>
                </div>

                <input
                  type="radio"
                  name="metodePembayaran"
                  value="Transfer"
                  checked={metodePembayaran === "Transfer"}
                  onChange={(e) => setMetodePembayaran(e.target.value)}
                />
              </label>

              {metodePembayaran === "Transfer" && (
                <div className="transfer-proof-box">
                  <h3>Rekening Penjual</h3>

                  {ternak?.penjual?.nomorRekening ? (
                    <div className="seller-bank-box">
                      <p>
                        <strong>Bank:</strong>{" "}
                        {ternak.penjual.namaBank || "-"}
                      </p>
                      <p>
                        <strong>No. Rekening:</strong>{" "}
                        {ternak.penjual.nomorRekening}
                      </p>
                      <p>
                        <strong>Atas Nama:</strong>{" "}
                        {ternak.penjual.namaPemilikRekening ||
                          ternak.penjual.nama ||
                          "-"}
                      </p>
                    </div>
                  ) : (
                    <div className="bank-empty-box">
                      <p>
                        Penjual belum mengisi nomor rekening. Silakan pilih COD
                        atau hubungi penjual melalui fitur chat.
                      </p>
                    </div>
                  )}

                  <h3 className="proof-title">Bukti Transfer</h3>
                  <p>Upload bukti transfer dalam format gambar.</p>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBuktiChange}
                  />

                  {previewBukti && (
                    <img
                      src={previewBukti}
                      alt="Preview bukti transfer"
                      className="proof-preview"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          <aside className="order-summary-card">
            <h2>Ringkasan Pesanan</h2>

            <div className="summary-row">
              <span>Subtotal produk</span>
              <strong>{formatRupiah(subtotalProduk)}</strong>
            </div>

            <div className="summary-row">
              <span>Biaya layanan</span>
              <strong>{formatRupiah(biayaLayanan)}</strong>
            </div>

            <div className="summary-row">
              <span>Metode pembayaran</span>
              <strong>{metodePembayaran}</strong>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total ({jumlah} item)</span>
              <strong>{formatRupiah(total)}</strong>
            </div>

            <button
              type="button"
              className="create-order-btn"
              onClick={handleBuatPesanan}
              disabled={saving}
            >
              {saving ? "Memproses..." : "Buat Pesanan"}
            </button>

            <p className="summary-note">
              Pesanan akan masuk ke dashboard penjual setelah dibuat.
            </p>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default DetailPemesanan;