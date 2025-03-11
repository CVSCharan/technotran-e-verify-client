"use client";

import React, { useState } from "react";
import styles from "../styles/AdminLoginComp.module.css";
import { useAdmin } from "@/context/AdminContext";
import { useRouter } from "next/navigation";
import ForgotPasswordModal from "./ForgotPasswordModal";

const AdminLoginComp = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const router = useRouter();

  const { login } = useAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/admins/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include", // ✅ Ensures the cookie is set
      });

      const data = await response.json();

      if (response.ok) {
        login(data); // ✅ Store user data in cookies
        setMessage(data.message);
        setError(null);
        router.push(`/admin-dashboard`);
      } else {
        setMessage(null);
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={styles.formContainer}
      aria-labelledby="login-heading"
    >
      <h2 id="login-heading" className={styles.formHeading}>Administrator Login</h2>
      
      <div className={styles.inputGroup}>
        <label htmlFor="username" className={styles.visuallyHidden}>Username</label>
        <input
          placeholder="Username"
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={styles.formInput}
          aria-required="true"
          aria-invalid={error && !username ? "true" : "false"}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="password" className={styles.visuallyHidden}>Password</label>
        <input
          placeholder="Password"
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.formInput}
          aria-required="true"
          aria-invalid={error && !password ? "true" : "false"}
        />
      </div>

      {/* Forgot Password Button */}
      <button
        type="button"
        className={styles.forgotPassword}
        onClick={() => setForgotPasswordOpen(true)}
      >
        Forgot Password?
      </button>

      <button type="submit" className={styles.formButton}>
        Log In
      </button>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        target="Admin"
        open={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      />

      {error && <p className={styles.error} role="alert">{error}</p>}
      {message && <p className={styles.success} role="status">{message}</p>}
    </form>
  );
};

export default AdminLoginComp;
