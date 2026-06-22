import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/umum/LandingPage";
import Login from "./pages/umum/Login";
import Register from "./pages/umum/Register";
import NotFound from "./pages/umum/NotFound";
import PembeliLayout from "./layouts/PembeliLayout";
import PenjualLayout from "./layouts/PenjualLayout";
import AdminLayout from "./layouts/AdminLayout";

import DashboardPenjual from "./pages/penjual/DashboardPenjual";
import RiwayatTernak from "./pages/penjual/RiwayatTernak";
import TambahTernak from "./pages/penjual/TambahTernak";
import EditTernak from "./pages/penjual/EditTernak";
import PesananPenjual from "./pages/penjual/PesananPenjual";
import ChatPenjual from "./pages/penjual/ChatPenjual";
import LaporMasalah from "./pages/penjual/LaporMasalah";
import ProfilPenjual from "./pages/penjual/ProfilPenjual";

import DashboardPembeli from "./pages/pembeli/DashboardPembeli";
import TransaksiPembeli from "./pages/pembeli/TransaksiPembeli";
import ChatPembeli from "./pages/pembeli/ChatPembeli";
import LaporMasalahPembeli from "./pages/pembeli/LaporMasalahPembeli";
import ProfilPembeli from "./pages/pembeli/ProfilPembeli";
import DetailTernakPembeli from "./pages/pembeli/DetailTernakPembeli";
import DetailPemesanan from "./pages/pembeli/DetailPemesanan";
import DetailPesananPembeli from "./pages/pembeli/DetailPesananPembeli";

import DashboardAdmin from "./pages/Admin/DashboardAdmin";
import LaporanMasalah from "./pages/Admin/LaporanMasalah";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman umum */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
<Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route
    index
    element={<DashboardAdmin />}
  />

  <Route
    path="dashboard"
    element={<DashboardAdmin />}
  />

  <Route
    path="laporan"
    element={<LaporanMasalah />}
  />
</Route>

        {/* Penjual */}
<Route
  path="/penjual"
  element={
    <ProtectedRoute allowedRoles={["penjual"]}>
      <PenjualLayout />
    </ProtectedRoute>
  }
>
  <Route
    index
    element={<DashboardPenjual />}
  />

  <Route
    path="dashboard"
    element={<DashboardPenjual />}
  />

  <Route
    path="riwayat-ternak"
    element={<RiwayatTernak />}
  />

  <Route
    path="tambah-ternak"
    element={<TambahTernak />}
  />

  <Route
    path="edit-ternak/:id"
    element={<EditTernak />}
  />

  <Route
    path="pesanan"
    element={<PesananPenjual />}
  />

  <Route
    path="chat"
    element={<ChatPenjual />}
  />

  <Route
    path="lapor-masalah"
    element={<LaporMasalah />}
  />

  <Route
    path="profil"
    element={<ProfilPenjual />}
  />
</Route>

        {/* Pembeli */}
<Route
  path="/pembeli"
  element={
    <ProtectedRoute allowedRoles={["pembeli"]}>
      <PembeliLayout />
    </ProtectedRoute>
  }
>
  <Route
    index
    element={<DashboardPembeli />}
  />

  <Route
    path="dashboard"
    element={<DashboardPembeli />}
  />

  <Route
    path="transaksi"
    element={<TransaksiPembeli />}
  />

  <Route
    path="chat"
    element={<ChatPembeli />}
  />

  <Route
    path="lapor-masalah"
    element={<LaporMasalahPembeli />}
  />

  <Route
    path="profil"
    element={<ProfilPembeli />}
  />

  <Route
    path="detail-ternak/:id"
    element={<DetailTernakPembeli />}
  />

  <Route
    path="detail-pesanan/:id"
    element={<DetailPesananPembeli />}
  />

  <Route
    path="pemesanan/:id"
    element={<DetailPemesanan />}
  />
</Route>

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;