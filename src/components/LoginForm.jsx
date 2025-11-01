import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function LoginForm({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [studentId, setStudentId] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 🔹 Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
      };

      if (role === "parent" && studentId.trim() !== "") {
        userData.studentId = studentId.trim();
      }

      await setDoc(doc(db, "users", user.uid), userData);
      alert("✅ Signup successful! You can now login.");
      setIsSignup(false);
      setName("");
      setEmail("");
      setPassword("");
      setRole("");
      setStudentId("");
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Signup failed: " + error.message);
    }
  };

  // 🔹 Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        onLogin(userDoc.data());
      } else {
        alert("User profile not found in Firestore!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>
          {isSignup ? "Create Account 🧸" : "Welcome Back 🔐"}
        </h2>

        <form onSubmit={isSignup ? handleSignup : handleLogin} style={styles.form}>
          {isSignup && (
            <>
              <label style={styles.label}>Full Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={styles.input}
              />

              <label style={styles.label}>Role:</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                style={styles.input}
              >
                <option value="">Select Role</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
              </select>

              {role === "parent" && (
                <>
                  <label style={styles.label}>Student ID:</label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. tarun_k"
                    style={styles.input}
                  />
                </>
              )}
            </>
          )}

          <label style={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <label style={styles.label}>Password:</label>
          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ ...styles.input, paddingRight: "40px" }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit" style={styles.button}>
            {isSignup ? "Create Account" : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "15px", color: "#555" }}>
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button onClick={() => setIsSignup(!isSignup)} style={styles.link}>
            {isSignup ? "Login" : "Signup"}
          </button>
        </p>
      </div>
    </div>
  );
}

const styles = {
  // 🩵 Background page
  page: {
    height: "100vh",
    width: "100%",
    background: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Poppins', sans-serif",
  },

  // 💎 Form container
  container: {
    width: "380px",
    background: "rgba(255, 255, 255, 0.95)",
    padding: "40px 35px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    textAlign: "center",
  },

  title: {
    color: "#f5576c",
    marginBottom: "20px",
    fontSize: "1.6rem",
    fontWeight: "700",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  label: {
    textAlign: "left",
    color: "#333",
    fontWeight: "600",
    fontSize: "14px",
  },

  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "15px",
    background: "#f8f9fa",
    color: "#111",
    fontWeight: "500",
    caretColor: "#f5576c",
    transition: "0.2s",
  },

  button: {
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    marginTop: "10px",
    boxShadow: "0 4px 10px rgba(245,87,108,0.4)",
    transition: "0.3s ease",
  },

  link: {
    background: "none",
    border: "none",
    color: "#f5576c",
    cursor: "pointer",
    fontWeight: "bold",
  },

  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  eyeIcon: {
    position: "absolute",
    right: "12px",
    cursor: "pointer",
    fontSize: "18px",
    userSelect: "none",
  },
};
