"use client";

import React, { useState } from "react";
import styles from "../styles/CreateVendor.module.css";

const CreateVendor = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgPic, setOrgPic] = useState(""); // You can add a default image URL here

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newVendor = {
      name,
      email,
      password,
      orgPic,
    };

    // Sending the data to the backend API to insert into MongoDB
    try {
      const response = await fetch("/api/vendors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newVendor),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Vendor added successfully!");
        // Clear form after successful submission
        setName("");
        setEmail("");
        setPassword("");
        setOrgPic("");
      } else {
        console.log(`Error: ${result.message}`);
      }
    } catch (error) {
      console.log(error);
      console.log("Error submitting data");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2 className={styles.formHeading}>Vendor's Form</h2>
      <input
        placeholder="Username"
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className={styles.formInput}
      />

      <input
        placeholder="Email"
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={styles.formInput}
      />

      <input
        placeholder="Password"
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className={styles.formInput}
      />

      <input
        placeholder="Org Logo Url"
        type="text"
        id="orgPic"
        value={orgPic}
        onChange={(e) => setOrgPic(e.target.value)}
        className={styles.formInput}
      />

      <button type="submit" className={styles.formButton}>
        Add Vendor
      </button>
    </form>
  );
};

export default CreateVendor;
