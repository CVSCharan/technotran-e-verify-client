"use client";

import React, { useState } from "react";
import styles from "../styles/AdminLoginComp.module.css";
import { useAdmin } from "@/context/AdminContext";
import { useRouter } from "next/navigation";

const AdminLoginComp = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <input
        placeholder="Username"
        type="text"
        id="username"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className={styles.formInput}
      />

      <input
        placeholder="Password"
        type="password"
        id="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className={styles.formInput}
      />

      <button type="submit" className={styles.formButton}>
        Login
      </button>

      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.success}>{message}</p>}
    </form>
  );
};

export default AdminLoginComp;
