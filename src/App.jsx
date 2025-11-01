import React, { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import ParentDashboard from "./components/ParentDashboard";
import Chatbot from "./components/Chatbot";

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log("✅ Logged in user:", currentUser.email);

        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("📘 Firestore user data:", docSnap.data());
          setUserData(docSnap.data());
        } else {
          console.log("⚠️ No user data found in Firestore!");
        }
      } else {
        console.log("🚪 User logged out or not logged in");
        setUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    console.log("👋 User signed out!");
  };

  // 🔹 Show login if not logged in
  if (!user) {
    return <LoginForm onLogin={() => console.log("User logged in!")} />;
  }

  // 🔹 Main dashboard view
  return (
    <div style={styles.container}>
      <h1>🌈 Thailand Preschool Dashboard</h1>
      <h3>Welcome, {userData?.name || "User"}!</h3>
      <p>Role: {userData?.role}</p>

      {userData?.role === "teacher" ? (
        <div style={styles.card}>
          <h2>👩‍🏫 Teacher Dashboard</h2>
          <p>You can upload student marks and view reports here (coming soon).</p>
        </div>
      ) : (
        <div style={styles.card}>
          <h2>👨‍👩‍👧 Parent Dashboard</h2>
          {userData?.studentId ? (
            <ParentDashboard user={userData} />
          ) : (
            <p>Student ID not linked.</p>
          )}
        </div>
      )}

      <button onClick={handleLogout} style={styles.logoutBtn}>
        Logout
      </button>

      {/* ✅ Chatbot should be rendered here — outside useEffect */}
      <Chatbot />
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "60px",
    color: "#333",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    width: "400px",
    margin: "30px auto",
  },
  logoutBtn: {
    marginTop: "20px",
    padding: "10px 20px",
    borderRadius: "8px",
    background: "#dc3545",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default App;
