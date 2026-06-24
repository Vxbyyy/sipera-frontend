import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import api from "../../api/axiosConfig";
import Footer from "../umum/Footer";
import "../../styles/Admin/DashboardAdmin.css";
import logoSipera from "../../assets/logo-sipera.jpeg";

function DashboardAdmin() {
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("semua");

  const [users, setUsers] = useState([]);
  const [ternak, setTernak] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const formatRole = (role) => {
    if (!role) return "Admin";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);

      const response = await api.get("/api/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Akses ditolak. Silakan login sebagai admin.");
        navigate("/login");
      } else {
        alert("Gagal mengambil data pengguna dari database.");
      }
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchTernak = async () => {
    try {
      const response = await api.get("/api/admin/ternak");
      setTernak(response.data);
    } catch (error) {
      console.error("Gagal mengambil data ternak:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTernak();
    fetchLaporan();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const nama = user.nama || "";
      const email = user.email || "";

      const matchSearch =
        nama.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase());

      const matchRole = roleFilter === "semua" || user.role === roleFilter;

      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  const totalPengguna = users.length;
  const totalTernak = ternak.length;

  const penjualAktif = users.filter(
    (user) => user.role === "penjual" && user.status === "Aktif"
  ).length;

  const [laporanMasalah, setLaporanMasalah] = useState([]);
  const fetchLaporan = async () => {
  try {
    const response = await api.get("/api/admin/laporan");
    setLaporanMasalah(response.data);
  } catch (error) {
    console.error(error);
  }
};

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";

    return new Date(tanggal).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Aktif" ? "Ditangguhkan" : "Aktif";

    try {
      await api.patch(`/api/admin/users/${id}/status`, {
        status: newStatus,
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, status: newStatus } : user
        )
      );

      alert(`Status pengguna berhasil diubah menjadi ${newStatus}.`);
    } catch (error) {
      console.error("Gagal mengubah status pengguna:", error);
      alert("Gagal mengubah status pengguna.");
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus pengguna ini?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/api/admin/users/${id}`);

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));

      alert("Pengguna berhasil dihapus.");
    } catch (error) {
      console.error("Gagal menghapus pengguna:", error);
      alert("Gagal menghapus pengguna.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="admin-page">
      {/* NAVBAR */}
      <header className="admin-navbar">
      <div className="admin-logo">
        <img
          src={logoSipera}
          alt="SIPERA Toraja"
          className="admin-logo-image"
        />

        <h2>
          SIPERA <span>TORAJA</span>
        </h2>
      </div>

        <nav className="admin-nav">
          <div className="admin-profile">
            <strong>{loggedInUser?.nama || "Admin SIPERA"}</strong>
            <small>{formatRole(loggedInUser?.role || "admin")}</small>
          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </nav>
      </header>

      {/* MAIN */}
      <main className="admin-main">
        <section className="admin-hero">
          <h1>Panel Administrasi</h1>
          <p>
            Kelola pengguna, pantau aktivitas pasar, dan jaga keamanan platform
            SIPERA.
          </p>
        </section>

        {/* STAT CARDS */}
        <section className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon blue">
              <i className="fas fa-users"></i>
            </div>
            <div>
              <p>Total Pengguna</p>
              <h3>{totalPengguna}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <i className="fas fa-shopping-bag"></i>
            </div>
            <div>
              <p>Total Ternak</p>
              <h3>{totalTernak}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <i className="fas fa-user-check"></i>
            </div>
            <div>
              <p>Penjual Aktif</p>
              <h3>{penjualAktif}</h3>
            </div>
          </div>

          <Link
  to="/admin/laporan"
  className="stat-card laporan-card"
>
  <div className="stat-icon red">
    <i className="fas fa-exclamation-triangle"></i>
  </div>

  <div>
    <p>Laporan Masalah</p>
    <h3>{laporanMasalah.length}</h3>

    <span className="laporan-link">
      Lihat Detail →
    </span>
  </div>
</Link>
        </section>

        {/* USER MANAGEMENT */}
        <section className="user-management-card">
          <div className="management-header">
            <div className="management-title">
              <i className="fas fa-users-cog"></i>
              <h2>Manajemen Pengguna</h2>
            </div>

            <div className="management-actions">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Cari nama atau email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="semua">Semua Role</option>
                <option value="admin">Admin</option>
                <option value="penjual">Penjual</option>
                <option value="pembeli">Pembeli</option>
              </select>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Pengguna</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Tanggal Bergabung</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loadingUsers ? (
                  <tr>
                    <td colSpan="5" className="empty-data">
                      Memuat data pengguna dari database...
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info">
                          <div className="avatar">
                            {(user.nama || user.email || "?")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <h4>{user.nama || "Tanpa Nama"}</h4>
                            <p>
                              <i className="far fa-envelope"></i> {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            user.status === "Aktif" ? "active" : "suspended"
                          }`}
                        >
                          <span></span>
                          {user.status || "Aktif"}
                        </span>
                      </td>

                      <td>
                        <span className="date-cell">
                          <i className="far fa-calendar"></i>
                          {formatTanggal(user.createdAt)}
                        </span>
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn suspend"
                            onClick={() =>
                              handleToggleStatus(user.id, user.status || "Aktif")
                            }
                            title={
                              user.status === "Aktif"
                                ? "Tangguhkan pengguna"
                                : "Aktifkan pengguna"
                            }
                          >
                            <i className="fas fa-user-slash"></i>
                          </button>

                          <button
                            className="action-btn delete"
                            onClick={() => handleDeleteUser(user.id)}
                            title="Hapus pengguna"
                          >
                            <i className="far fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-data">
                      Tidak ada pengguna yang sesuai dengan pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Footer />

    </div>
  );
}

export default DashboardAdmin;