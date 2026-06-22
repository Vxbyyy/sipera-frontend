import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>404</h1>
      <p>Halaman tidak ditemukan</p>

      <Link to="/">
        Kembali ke Beranda
      </Link>
    </div>
  );
}

export default NotFound;