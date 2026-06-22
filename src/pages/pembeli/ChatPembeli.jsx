import { useEffect, useState } from "react";
import { Link, NavLink,useLocation,useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "../../styles/pembeli/ChatPembeli.css";
import logoSipera from "../../assets/logo-sipera.jpeg";
import Footer from "../umum/Footer";

function ChatPembeli() {
  const navigate = useNavigate();
  const location = useLocation();

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const [searchNamaPenjual, setSearchNamaPenjual] = useState("");
  const [hasilPenjual, setHasilPenjual] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const fetchConversations = async () => {
    try {
      const response = await api.get("/api/chat/conversations");
      const data = response.data || [];

      setConversations(data);

      if (location.state?.receiverId) {
        return;
      }

      if (data.length > 0 && !activeUser) {
        setActiveUser(data[0]);
      }
    } catch (error) {
      console.error("Gagal mengambil daftar chat:", error);
    }
  };

  const fetchMessages = async () => {
    if (!activeUser?.userId) return;

    try {
      const response = await api.get(`/api/chat/messages/${activeUser.userId}`);
      setMessages(response.data || []);
    } catch (error) {
      console.error("Gagal mengambil pesan:", error);
    }
  };

  const handleSearchPenjual = async () => {
    if (!searchNamaPenjual.trim()) {
      alert("Masukkan nama penjual terlebih dahulu.");
      return;
    }

    try {
      setLoadingSearch(true);

      const response = await api.get(
        `/api/chat/search-penjual?nama=${encodeURIComponent(
          searchNamaPenjual
        )}`
      );

      setHasilPenjual(response.data || []);
    } catch (error) {
      console.error("Gagal mencari penjual:", error);

      alert(
        error.response?.data?.message ||
          "Gagal mencari penjual berdasarkan nama."
      );
    } finally {
      setLoadingSearch(false);
    }
  };

  const handlePilihPenjual = (penjual) => {
    setActiveUser({
      userId: Number(penjual.id),
      nama: penjual.nama || "Penjual",
      role: penjual.role || "penjual",
      lastMessage: "",
    });

    setSearchNamaPenjual("");
    setHasilPenjual([]);
    setMessages([]);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeUser?.userId) return;

    try {
      await api.post("/api/chat", {
        receiverId: activeUser.userId,
        message: messageInput,
      });

      setMessageInput("");
      fetchMessages();
      fetchConversations();
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
      alert("Gagal mengirim pesan.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    if (location.state?.receiverId) {
      setActiveUser({
        userId: Number(location.state.receiverId),
        nama: location.state.namaPenjual || "Penjual",
        role: "penjual",
        lastMessage: "",
      });
    }
  }, [location.state]);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    fetchMessages();

    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, [activeUser]);

  return (
    <div className="buyer-chat-page">
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
        <NavLink
          to="/pembeli"
          end
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Beranda
        </NavLink>

        <NavLink
          to="/pembeli/transaksi"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Transaksi
        </NavLink>

        <NavLink
          to="/pembeli/chat"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Chat
        </NavLink>

        <NavLink
          to="/pembeli/lapor-masalah"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Lapor Masalah
        </NavLink>

        <NavLink
          to="/pembeli/profil"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
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

          <h1>Chat Penjual</h1>

          <p>
            Diskusikan detail ternak, harga, dan lokasi dengan penjual.
          </p>
        </section>

        <section className="buyer-chat-layout">
          <div className="buyer-chat-list-card">
            <h2>Daftar Chat</h2>

            <div className="start-chat-box">
              <input
                type="text"
                placeholder="Cari nama penjual..."
                value={searchNamaPenjual}
                onChange={(e) => setSearchNamaPenjual(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchPenjual();
                  }
                }}
              />

              <button type="button" onClick={handleSearchPenjual}>
                {loadingSearch ? "Mencari..." : "Cari Penjual"}
              </button>
            </div>

            {hasilPenjual.length > 0 && (
              <div className="search-result-box">
                {hasilPenjual.map((penjual) => (
                  <button
                    key={penjual.id}
                    type="button"
                    className="buyer-chat-list-item"
                    onClick={() => handlePilihPenjual(penjual)}
                  >
                    <div className="buyer-chat-avatar">
                      {(penjual.nama || "P").charAt(0)}
                    </div>

                    <div>
                      <h4>{penjual.nama || "Penjual"}</h4>
                      <p>{penjual.email || "Tidak ada email"}</p>
                    </div>

                    <span>{penjual.role}</span>
                  </button>
                ))}
              </div>
            )}

            {conversations.length > 0 ? (
              conversations.map((chat) => (
                <button
                  key={chat.userId}
                  type="button"
                  className={`buyer-chat-list-item ${
                    activeUser?.userId === chat.userId ? "active" : ""
                  }`}
                  onClick={() => setActiveUser(chat)}
                >
                  <div className="buyer-chat-avatar">
                    {(chat.nama || "P").charAt(0)}
                  </div>

                  <div>
                    <h4>{chat.nama || "Penjual"}</h4>
                    <p>{chat.lastMessage || "Belum ada pesan terakhir"}</p>
                  </div>

                  <span>{chat.role}</span>
                </button>
              ))
            ) : (
              <p className="buyer-chat-empty">Belum ada percakapan.</p>
            )}
          </div>

          <div className="buyer-chat-room-card">
            {activeUser ? (
              <>
                <div className="buyer-chat-room-header">
                  <div className="buyer-chat-avatar large">
                    {(activeUser.nama || "P").charAt(0)}
                  </div>

                  <div>
                    <h2>{activeUser.nama || "Penjual"}</h2>
                    <p>{activeUser.role || "penjual"}</p>
                  </div>
                </div>

                <div className="buyer-chat-messages">
                  {messages.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`buyer-message ${
                          Number(msg.senderId) === Number(loggedInUser?.id)
                            ? "buyer"
                            : "seller"
                        }`}
                      >
                        <p>{msg.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="buyer-chat-empty-room">
                      Belum ada pesan. Mulai percakapan dengan penjual ini.
                    </div>
                  )}
                </div>

                <div className="buyer-chat-input">
                  <input
                    type="text"
                    placeholder="Tulis pesan..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                  />

                  <button type="button" onClick={handleSendMessage}>
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </>
            ) : (
              <div className="buyer-chat-empty-room">
                Pilih chat atau cari nama penjual untuk mulai percakapan.
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

    </div>
  );
}

export default ChatPembeli;