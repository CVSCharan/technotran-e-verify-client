"use client";

import React, { useState } from "react";
import styles from "../styles/CreateVendor.module.css";
import { CreateModelProps } from "@/utils/types";

const CreateVendor: React.FC<CreateModelProps> = ({ handleCloseModal }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [orgPic, setOrgPic] = useState(""); // You can add a default image URL here

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newVendor = {
      name,
      email,
      password,
      orgPic,
      org: orgName,
    };

    // Sending the data to the backend API to insert into MongoDB
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/vendors`, {
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
        setOrgName("");
      } else {
        console.log(`Error: ${result.message}`);
      }
    } catch (error) {
      console.log(error);
      console.log("Error submitting data");
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={styles.formContainer}
      aria-labelledby="vendor-form-heading"
      role="form"
    >
      <h2 id="vendor-form-heading" className={styles.formHeading}>{`Vendor's Form`}</h2>
      <div className={styles.formSubContainer}>
        <input
          placeholder="Username"
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={styles.formInput}
          aria-required="true"
          aria-label="Username"
        />

        <input
          placeholder="Email"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.formInput}
          aria-required="true"
          aria-label="Email"
        />

        <input
          placeholder="Password"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.formInput}
          aria-required="true"
          aria-label="Password"
        />

        <input
          placeholder="Org. Name"
          type="text"
          id="orgName"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          className={styles.formInput}
          aria-label="Organization Name"
        />

        <input
          placeholder="Org. Logo URL"
          type="text"
          id="orgPic"
          value={orgPic}
          onChange={(e) => setOrgPic(e.target.value)}
          className={styles.formInput}
          aria-label="Organization Logo URL"
        />
      </div>

      <div className={styles.btnContainer}>
        <button
          type="button"
          onClick={handleCloseModal}
          className={styles.formButton}
          aria-label="Close form"
        >
          Close
        </button>
        <button 
          type="submit" 
          className={styles.formButton}
          aria-label="Add vendor"
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default CreateVendor;
