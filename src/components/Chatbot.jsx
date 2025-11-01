import React, { useState } from "react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi there! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  // ✅ Your actual n8n webhook endpoint
  const N8N_WEBHOOK_URL =
    "https://myaidesigntools.app.n8n.cloud/webhook/kindergarden_chatbot";

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages([...messages, userMsg]);
    setInput("");

    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      const botReply =
        data.reply ||
        data.message ||
        "🤔 Hmm, I’m not sure about that. Can you rephrase?";

      const botMsg = { sender: "bot", text: botReply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error connecting to chatbot." },
      ]);
    }
  }

  return (
    <>
      {/* 💬 Floating Chat Button */}
      <div
        style={styles.chatButton}
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with us"
      >
        💬
      </div>

      {/* 💭 Chat Window */}
      {isOpen && (
        <div style={styles.chatWindow}>
          <div style={styles.header}>
            <span>🤖 Kindergarten Assistant</span>
            <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>
              ✖
            </button>
          </div>

          <div style={styles.messages}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.message,
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  background:
                    msg.sender === "user"
                      ? "linear-gradient(135deg, #a1c4fd, #c2e9fb)"
                      : "#f1f1f1",
                  color: msg.sender === "user" ? "#fff" : "#333",
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} style={styles.inputArea}>
            <input
              style={styles.input}
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button style={styles.sendBtn}>➤</button>
          </form>
        </div>
      )}
    </>
  );
}

// 💅 Styles
const styles = {
  chatButton: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
    color: "#fff",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    cursor: "pointer",
    zIndex: 9999,
  },
  chatWindow: {
    position: "fixed",
    bottom: "90px",
    right: "20px",
    width: "340px",
    height: "420px",
    background: "#fff",
    borderRadius: "15px",
    boxShadow: "0 6px 25px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 9999,
  },
  header: {
    background: "linear-gradient(135deg, #fbc2eb, #a6c1ee)",
    padding: "10px",
    color: "#333",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
  },
  messages: {
    flex: 1,
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    overflowY: "auto",
    background: "#fafafa",
  },
  message: {
    padding: "10px 14px",
    borderRadius: "10px",
    maxWidth: "80%",
    fontSize: "14px",
  },
  inputArea: {
    display: "flex",
    borderTop: "1px solid #ddd",
  },
  input: {
    flex: 1,
    border: "none",
    padding: "10px",
    outline: "none",
  },
  sendBtn: {
    background: "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
    border: "none",
    color: "#fff",
    padding: "0 15px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
};
