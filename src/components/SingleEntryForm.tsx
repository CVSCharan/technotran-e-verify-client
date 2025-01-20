"use client";

import { useState } from "react";
import styles from "../styles/CreateCertificate.module.css";
import { SingleEntryFormProps } from "@/utils/types";

const SingleEntryForm: React.FC<SingleEntryFormProps> = ({ onMessage }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("AICTE Internship"); // Default value
  const [issueDate, setIssueDate] = useState("");
  const [certificateId, setCertificateId] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/certificates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          type,
          issueDate,
          certificateId,
          rollNo,
          email,
          org: orgName,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        onMessage(`Error: ${result.error || "Failed to create certificate!"}`);
        return;
      }

      onMessage("Certificate created successfully!");
      setName("");
      setType("AICTE Internship"); // Reset to default
      setIssueDate("");
      setCertificateId("");
      setRollNo("");
      setEmail("");
      setOrgName("");
    } catch (error) {
      console.log(error);
      onMessage("Failed to create certificate!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.formSubContainer}>
        <input
          placeholder="Username"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={styles.formInput}
        />

        {/* Dropdown for Type Selection */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          className={styles.formInput} // Use the same styling as input fields
        >
          <option value="AICTE Internship">AICTE Internship</option>
          <option value="Internship">Internship</option>
          <option value="Workshop">Workshop</option>
        </select>

        <input
          placeholder="Issued Date"
          type="date"
          value={issueDate}
          onChange={(e) => setIssueDate(e.target.value)}
          required
          className={styles.formInput}
        />
        <input
          placeholder="Certificate ID"
          type="text"
          value={certificateId}
          onChange={(e) => setCertificateId(e.target.value)}
          required
          className={styles.formInput}
        />
        <input
          placeholder="Roll No."
          type="text"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          required
          className={styles.formInput}
        />
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.formInput}
        />
        <input
          placeholder="Organization"
          type="text"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          required
          className={styles.formInput}
        />
      </div>
      <button className={styles.formButton} type="submit">
        Add Certificate
      </button>
    </form>
  );
};

export default SingleEntryForm;
