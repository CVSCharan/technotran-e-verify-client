"use client";

import React, { useState } from "react";
import styles from "../styles/CreateAdmin.module.css";

const CreateAdmin = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [role, setRole] = useState("admin");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/admins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          email,
          password,
          profilePic: profilePic || undefined, // Default value from schema will be used if empty
          role,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Admin created successfully!");
        setUsername("");
        setEmail("");
        setPassword("");
        setProfilePic("");
        setRole("admin");
      } else {
        setMessage(result.error || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      setMessage("Failed to create admin!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2 className={styles.formHeading}>{`Admin's Form`}</h2>
      <div className={styles.formSubContainer}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={styles.formInput}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.formInput}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.formInput}
        />

        <input
          type="text"
          placeholder="Profile Pic URL"
          value={profilePic}
          onChange={(e) => setProfilePic(e.target.value)}
          className={styles.formInput}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={styles.formInput}
        >
          <option value="admin">Admin</option>
          <option value="superadmin">Super Admin</option>
        </select>
      </div>

      <button type="submit" className={styles.formButton}>
        Add User
      </button>

      {message && <p className={styles.message}>{message}</p>}
    </form>
  );
};

export default CreateAdmin;
