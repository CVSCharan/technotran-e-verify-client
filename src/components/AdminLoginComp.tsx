"use client";

import React, { useState } from "react";
import styles from "../styles/AdminLoginComp.module.css";

const AdminLoginComp = () => {
  const [username, setUsername] = useState<string>(""); // Explicitly type username
  const [password, setPassword] = useState<string>(""); // Explicitly type password
  const [error, setError] = useState<string | null>(null); // Explicitly type error state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      console.log("Admin Login", { username, password });
      setError(null);
    } catch (err) {
      setError("Login failed. Please try again.");
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

      {/* Display error message */}
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
};

export default AdminLoginComp;
