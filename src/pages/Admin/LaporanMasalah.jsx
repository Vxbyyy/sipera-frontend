import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import "../../styles/Admin/LaporanMasalah.css";
import Footer from "../umum/Footer";

function LaporanMasalah() {
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLaporan, setSelectedLaporan] = useState(null);
  const [search, setSearch] = useState("");
  const [balasan, setBalasan] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/laporan");

      setLaporan(res.data);

      if (res.data.length > 0) {
        setSelectedLaporan(res.data[0]);
      }
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil laporan");
    } finally {
      setLoading(false);
    }
  };

 const balasLaporan = async (id) => {

  if (!balasan.trim()) {
    alert("Balasan tidak boleh kosong");
    return;
  }

  try {

    await api.patch(`/api/laporan/${id}/balas`, {
      balasan: balasan,
      status: "Selesai",
    });

    alert("Balasan berhasil dikirim");

    setBalasan("");

    getData();

  } catch (error) {

    console.error(error);

    alert(
      error.response?.data?.message ||
      "Gagal membalas laporan"
    );
  }
};

const ubahStatus = async (id) => {
  try {

    await api.patch(`/api/laporan/${id}/balas`, {
      status: "Selesai",
    });

    setLaporan((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: "Selesai" }
          : item
      )
    );

    if (selectedLaporan?.id === id) {
      setSelectedLaporan({
        ...selectedLaporan,
        status: "Selesai",
      });
    }

    alert("Status berhasil diubah");

  } catch (error) {

    console.error(error);

    alert(
      error.response?.data?.message ||
      "Gagal mengubah status"
    );
  }
};

  const filteredLaporan = laporan.filter((item) =>
    item.User?.nama
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||

    item.kategori
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||

    item.deskripsi
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  useEffect(() => {
    if (
      filteredLaporan.length > 0 &&
      !filteredLaporan.find(
        (item) =>
          item.id === selectedLaporan?.id
      )
    ) {
      setSelectedLaporan(filteredLaporan[0]);
    }
  }, [search, laporan]);

  return (
    <div className="laporan-admin-page">
      <div className="laporan-container">

        <div className="laporan-header">
          <span className="page-label">
            Dashboard Admin
          </span>

          <h1>Laporan Masalah</h1>

          <p>
            Kelola laporan dari penjual dan pembeli,
            berikan tanggapan dan pantau
            penyelesaiannya.
          </p>
        </div>

        <div className="laporan-stats">
          <div className="stat-card">
            <h3>{laporan.length}</h3>
            <p>Total Laporan</p>
          </div>

          <div className="stat-card warning">
            <h3>
              {
                laporan.filter(
                  (item) =>
                    item.status === "Menunggu"
                ).length
              }
            </h3>
            <p>Menunggu</p>
          </div>

          <div className="stat-card success">
            <h3>
              {
                laporan.filter(
                  (item) =>
                    item.status === "Selesai"
                ).length
              }
            </h3>
            <p>Selesai</p>
          </div>
        </div>

        {loading ? (
          <div className="empty-data">
            Memuat data laporan...
          </div>
        ) : (
          <div className="laporan-chat-layout">

            {/* KIRI */}
            <div className="laporan-sidebar">

              <div className="sidebar-header">
              <h3>Daftar Laporan</h3>
            </div>

            <div className="sidebar-search">
              <input
                type="text"
                placeholder="Cari laporan..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

              {filteredLaporan.length > 0 ? (

  filteredLaporan.map((item) => (

    <div
      key={item.id}
      className={`laporan-item ${
        selectedLaporan?.id === item.id
          ? "active"
          : ""
      }`}
      onClick={() =>
        setSelectedLaporan(item)
      }
    >

      <div className="user-avatar">
        {item.User?.nama
          ?.charAt(0)
          ?.toUpperCase()}
      </div>

     <div className="laporan-item-info">

      <div className="laporan-item-top">
        <h4>{item.User?.nama}</h4>

        <button
          className={`sidebar-status ${
            item.status === "Selesai"
              ? "selesai"
              : "menunggu"
          }`}
          onClick={(e) => {
            e.stopPropagation();

            if (item.status === "Menunggu") {
              ubahStatus(item.id);
            }
          }}
        >
          {item.status}
        </button>
      </div>

      <p>
        {item.deskripsi?.slice(0, 40)}...
      </p>

    </div>

    </div>

  ))

) : (

  <div className="empty-sidebar">
    Tidak ada laporan ditemukan
  </div>

)}

            
            </div>

            {/* KANAN */}
            <div className="laporan-detail">

              {selectedLaporan && (
                <>
                  <div className="detail-header">

                    <div className="user-info">
                      <div className="user-avatar">
                        {selectedLaporan.User?.nama
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>

                      <div>
                        <h2>
                          {
                            selectedLaporan.User
                              ?.nama
                          }
                        </h2>

                        <span className="kategori-tag">
                          {
                            selectedLaporan.kategori
                          }
                        </span>
                      </div>
                    </div>

                    <button
                    className={`status-badge ${
                      selectedLaporan.status === "Selesai"
                        ? "selesai"
                        : "menunggu"
                    }`}
                    onClick={() => {
                      if (selectedLaporan.status === "Menunggu") {
                        ubahStatus(selectedLaporan.id);
                      }
                    }}
                  >
                    {selectedLaporan.status}
                  </button>
                  </div>

                 <div className="chat-area">

              <div className="chat-bubble user">
                <span className="chat-label">
                  Laporan Pengguna
                </span>

                <p>{selectedLaporan.deskripsi}</p>
              </div>

             <div className="chat-bubble admin">
              <span className="chat-label">
                Balasan Admin
              </span>

              <p>
                {selectedLaporan.balasan ||
                  "Belum ada balasan"}
              </p>
            </div>
              

              {selectedLaporan.balasanUser && (
                <div className="chat-bubble user">
                  <span className="chat-label">
                    Balasan User
                  </span>

                  <p>{selectedLaporan.balasanUser}</p>
                </div>
              )}

            </div>
              <div className="reply-area">

            <textarea
              placeholder="Tulis balasan admin..."
              value={balasan}
              onChange={(e) =>
                setBalasan(e.target.value)
              }
            />

            <button
              className="btn-balas"
              onClick={() =>
                balasLaporan(selectedLaporan.id)
              }
            >
              Kirim Balasan
            </button>

          </div>

                </>
              )}

            </div>

          </div>
        )}
      </div>

      <Footer />

    </div>
  );
}

export default LaporanMasalah;