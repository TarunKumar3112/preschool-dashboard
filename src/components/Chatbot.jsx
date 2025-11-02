import React, { useEffect, useRef } from "react";

const N8N_WEBHOOK_URL =
  "https://myaidesigntools.app.n8n.cloud/webhook/kindergarden_chatbot";

export default function Chatbot() {
  const chatLoadedRef = useRef(false);

  useEffect(() => {
    if (chatLoadedRef.current) return undefined;

    let linkEl;
    let chatInstance;
    let isUnmounted = false;

    const loadChat = async () => {
      linkEl = document.createElement("link");
      linkEl.rel = "stylesheet";
      linkEl.href = "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css";
      document.head.appendChild(linkEl);

      try {
        const { createChat } = await import(
          "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js"
        );

        if (isUnmounted) return;

        chatInstance = createChat({
          webhookUrl: N8N_WEBHOOK_URL,
          target: "#n8n-chat",
          mode: "window",
          showWelcomeScreen: true,
          initialMessages: [
            "Hi there! 👋",
            "I'm your preschool assistant. How can I help today?",
          ],
        });

        chatLoadedRef.current = true;
      } catch (error) {
        console.error("Failed to initialise n8n chat:", error);
      }
    };

    loadChat();

    return () => {
      isUnmounted = true;

      if (chatInstance && typeof chatInstance.destroy === "function") {
        chatInstance.destroy();
      }

      if (linkEl && linkEl.parentNode) {
        linkEl.parentNode.removeChild(linkEl);
      }
    };
  }, []);

  return <div id="n8n-chat" style={styles.container} />;
}

const styles = {
  container: {
    position: "fixed",
    bottom: 0,
    right: 0,
    zIndex: 1000,
  },
};
