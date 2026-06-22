import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "../../styles/penjual/ChatPenjual.css";
import logoSipera from "../../assets/logo-sipera.jpeg";
import Footer from "../umum/Footer";

function ChatPenjual() {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchConversations = async () => {
    try {
      const response = await api.get("/api/chat/conversations");
      setConversations(response.data);

      if (response.data.length > 0 && !activeUser) {
        setActiveUser(response.data[0]);
      }
    } catch (error) {
      console.error("Gagal mengambil daftar chat:", error);
    }
  };

  const fetchMessages = async () => {
    if (!activeUser) return;

    try {
      const response = await api.get(`/api/chat/messages/${activeUser.userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Gagal mengambil pesan:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeUser) return;

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
    fetchConversations();
  }, []);

  useEffect(() => {
    fetchMessages();

    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, [activeUser]);

  const filteredConversations = conversations.filter((chat) =>
  chat.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="seller-chat-page">
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
      title="Logout"
    >
      ↪
    </button>
  </div>
</nav>

      <main className="app-main seller-chat-main">
      <section className="app-page-header">
        <span className="app-page-label">
          Dashboard Penjual
        </span>

        <h1>Chat Pembeli</h1>

        <p>
          Balas pertanyaan pembeli terkait ternak yang Anda jual.
        </p>
      </section>

        <section className="chat-layout">

        <div className="chat-list-card">

          <h2>Daftar Chat</h2>

          <div className="chat-search">
            <i className="fas fa-search"></i>

            <input
              type="text"
              placeholder="Cari"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

             {conversations.length > 0 ? (
              filteredConversations.map((chat) => (
                <button
                  key={chat.userId}
                  type="button"
                  className={`chat-list-item ${
                    activeUser?.userId === chat.userId ? "active" : ""
                  }`}
                  onClick={() => setActiveUser(chat)}
                >
                  <div className="chat-avatar">
                    {chat.nama.charAt(0)}
                  </div>

                  <div>
                    <h4>{chat.nama}</h4>
                    <p>{chat.lastMessage}</p>
                  </div>
                   <span>{chat.role}</span>
                    </button>
                  ))
                ) : (
                  <div className="chat-empty">
                    <i className="fas fa-comments"></i>
                    <h3>Belum Ada Percakapan</h3>
                    <p>Chat dari pembeli akan muncul di sini.</p>
                  </div>
                )}

              </div>

              <div className="chat-room-card">
            {activeUser ? (
              <>
                <div className="chat-room-header">
                  <div className="chat-avatar large">
                    {activeUser.nama.charAt(0)}
                  </div>
                  <div>
                    <h2>{activeUser.nama}</h2>
                    <p>{activeUser.role}</p>
                  </div>
                </div>

                <div className="chat-messages">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`message ${
                        msg.senderId === loggedInUser?.id ? "seller" : "buyer"
                      }`}
                    >
                      <p>{msg.message}</p>
                    </div>
                  ))}
                </div>

                <div className="chat-input">
                  <input
                    type="text"
                    placeholder="Tulis balasan..."
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
              <div className="chat-empty-room">
                Pilih chat untuk mulai percakapan.
                </div>
            )}
          </div>
        </section>
           </main>

<Footer />
    </div>
  );
}

export default ChatPenjual;