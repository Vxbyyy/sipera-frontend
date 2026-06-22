import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "../../styles/umum/Login.css";
import logoSipera from "../../assets/logo-sipera.jpeg";
import Footer from "./Footer";
import useAuthStore from "../../store/authStore";

function Login() {
const navigate = useNavigate();
const setUser = useAuthStore(
  (state) => state.setUser
);

const [showPassword, setShowPassword] =
useState(false);

const [formData, setFormData] = useState({
email: "",
password: "",
});

const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

const handleLogin = async (e) => {
e.preventDefault();

setError("");
setLoading(true);

try {
const response = await api.post(
  "/api/auth/login",
  {
    email: formData.email.trim(),
    password: formData.password,
  }
);

  const { token, user } = response.data;

  if (!token || !user) {
    setError(
      "Response login tidak valid."
    );
    return;
  }

  localStorage.setItem(
    "token",
    token
  );

localStorage.setItem(
  "user",
  JSON.stringify(user)
);

localStorage.setItem(
  "role",
  user.role
);

setUser(user);

setUser(user);
  if (user.role === "admin") {
    navigate("/admin/dashboard");
  } else if (
    user.role === "penjual"
  ) {
    navigate(
      "/penjual/dashboard"
    );
  } else if (
    user.role === "pembeli"
  ) {
    navigate(
      "/pembeli/dashboard"
    );
  } else {
    setError(
      "Role pengguna tidak dikenali."
    );
  }
} catch (err) {
  console.error(
    "Login Error:",
    err.response?.data ||
      err.message
  );

  setError(
    err.response?.data?.message ||
      err.response?.data?.error ||
      "Login gagal. Periksa email dan password."
  );
} finally {
  setLoading(false);
}

};

return ( 
<div className="login-page">
{/* NAVBAR */} 
<header className="app-navbar">

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

  <nav className="app-nav-links">

    <Link to="/">
      Beranda
    </Link>

    <Link
      to="/login"
      className="active"
    >
      Masuk
    </Link>

    <Link to="/register">
      Daftar
    </Link>

  </nav>

</header>

  {/* CONTENT */}
  <div className="login-container">
    {/* CARD LOGIN */}
    <div className="login-card">

      <div className="login-top">
        <h1>
          Selamat Datang
        </h1>

        <p>
          Masuk ke akun
          SIPERA Anda
        </p>
      </div>

      <form
        className="login-form"
        onSubmit={handleLogin}
      >
        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {/* EMAIL */}
        <div className="input-group">
          <label>Email</label>

          <div className="input-box">
            <i className="fas fa-envelope"></i>

            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              required
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="input-group">
          <label>
            Password
          </label>

          <div className="input-box">
            <i className="fas fa-lock"></i>

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="••••••••"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              <i
                className={
                  showPassword
                    ? "fas fa-eye-slash"
                    : "fas fa-eye"
                }
              ></i>
            </button>
          </div>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="login-btn"
          disabled={loading}
        >
          {loading
            ? "Memproses..."
            : "Masuk Sekarang"}

          <i className="fas fa-arrow-right"></i>
        </button>
      </form>

      <p className="register-text">
        Belum punya akun?

        <Link to="/register">
          {" "}
          Daftar sekarang
        </Link>
      </p>

    </div>
  </div>

  <Footer />

</div>

);
}

export default Login;
