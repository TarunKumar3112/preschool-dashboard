import React, { useEffect, useRef, useState } from "react";

const CHAT_CDN_SCRIPT =
  "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js";
const CHAT_CDN_STYLES =
  "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css";
const CHAT_TARGET_ID = "n8n-chat";

// ✅ Replace this with your production webhook URL from the n8n Webhook node
const N8N_WEBHOOK_URL =
  "https://myaidesigntools.app.n8n.cloud/webhook/kindergarden_chatbot";

export default function Chatbot() {
  const [error, setError] = useState(null);
  const chatRef = useRef(null);
  const styleEl = useRef(null);

  useEffect(() => {
    let destroyed = false;

    if (!document.getElementById(CHAT_TARGET_ID)) {
      console.warn(
        `n8n chat target #${CHAT_TARGET_ID} is missing. Rendering fallback container.`
      );
    }

    // Dynamically attach the CDN stylesheet so the widget inherits the n8n look & feel
    if (!styleEl.current) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = CHAT_CDN_STYLES;
      document.head.appendChild(link);
      styleEl.current = link;
    }

    async function mountChat() {
      try {
        const module = await import(/* @vite-ignore */ CHAT_CDN_SCRIPT);
        if (destroyed) return;

        const { createChat } = module;
        chatRef.current = createChat({
          webhookUrl: N8N_WEBHOOK_URL,
          target: `#${CHAT_TARGET_ID}`,
          mode: "window",
          showWelcomeScreen: true,
          loadPreviousSession: true,
        });
      } catch (err) {
        console.error("Failed to initialise n8n chat:", err);
        setError(
          "We couldn't connect to the support assistant. Please try again later."
        );
      }
    }

    mountChat();

    return () => {
      destroyed = true;
      if (chatRef.current?.destroy) {
        chatRef.current.destroy();
      }
      if (styleEl.current?.parentNode) {
        styleEl.current.parentNode.removeChild(styleEl.current);
        styleEl.current = null;
      }
    };
  }, []);

  return (
    <div style={styles.wrapper}>
      <div id={CHAT_TARGET_ID} />
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  wrapper: {
    position: "relative",
    zIndex: 1,
  },
  error: {
    marginTop: "1rem",
    color: "#dc3545",
    fontWeight: "600",
    textAlign: "center",
  },
};
