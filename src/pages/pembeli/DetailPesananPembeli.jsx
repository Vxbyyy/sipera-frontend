import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "../../styles/pembeli/DetailPesananPembeli.css";

function DetailPesananPembeli() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pesanan, setPesanan] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(angka || 0));
  };

  const fetchDetailPesanan = async () => {
    try {
      const response = await api.get(`/api/pesanan/${id}`);

      console.log("DETAIL PESANAN:", response.data);

      setPesanan(response.data);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Gagal mengambil detail pesanan"
      );

      navigate("/pembeli/transaksi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetailPesanan();
  }, [id]);

  if (loading) {
    return (
      <div className="detail-pesanan-loading">
        Memuat detail pesanan...
      </div>
    );
  }

  if (!pesanan) {
    return (
      <div className="detail-pesanan-loading">
        Pesanan tidak ditemukan
      </div>
    );
  }

  return (
  <div className="detail-pesanan-page">
    <div className="detail-pesanan-container">

      <button
        className="back-btn"
        onClick={() => navigate("/pembeli/transaksi")}
      >
        ← Kembali ke Transaksi
      </button>

      <div className="detail-card">

        <div className="detail-left">
          <h1>
            Detail
            <br />
            Pesanan
          </h1>

          <p>
            Informasi lengkap mengenai transaksi
            pembelian ternak Anda di SIPERA Toraja.
          </p>

          <br />

          <span
            className={`status-badge ${
              pesanan.status === "Selesai"
                ? "success"
                : pesanan.status === "Diproses"
                ? "process"
                : "waiting"
            }`}
          >
            {pesanan.status}
          </span>
        </div>

        <div className="detail-right">
          <div className="detail-grid">

            <div className="detail-item">
              <label>ID Pesanan</label>
              <p>#{pesanan.id}</p>
            </div>

            <div className="detail-item">
              <label>Nama Ternak</label>
              <p>{pesanan.namaTernak}</p>
            </div>

            <div className="detail-item">
              <label>Nama Pembeli</label>
              <p>{pesanan.namaPembeli}</p>
            </div>

            <div className="detail-item">
              <label>Jumlah Pesanan</label>
              <p>{pesanan.jumlah} Ekor</p>
            </div>

            <div className="detail-item">
              <label>Total Pembayaran</label>
              <p className="price">
                {formatRupiah(pesanan.total)}
              </p>
            </div>

            <div className="detail-item">
              <label>Tanggal Pesanan</label>
              <p>
                {new Date(
                  pesanan.createdAt
                ).toLocaleDateString("id-ID")}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
);
}

export default DetailPesananPembeli;