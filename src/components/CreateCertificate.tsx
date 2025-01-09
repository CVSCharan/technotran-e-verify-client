"use client";

import { useState } from "react";
import styles from "../styles/CreateCertificate.module.css";

const CreateCertificate = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [certificateId, setCertificateId] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(process.env.NEXT_PUBLC_API_URL);

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
      console.log("Response:", result);

      if (!response.ok) {
        setMessage(`Error: ${result}`);
        return;
      }
      if (response.ok) {
        setMessage("Certificate created successfully!");
        setName("");
        setType("");
        setIssueDate("");
        setCertificateId("");
        setRollNo("");
      } else {
        setMessage(result.error || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error creating certificate:", error);
      setMessage("Failed to create certificate!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2 className={styles.formHeading}>{`Certificate's Form`}</h2>
      <input
        placeholder="Username"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className={styles.formInput}
      />

      <input
        placeholder="Type"
        type="text"
        value={type}
        onChange={(e) => setType(e.target.value)}
        required
        className={styles.formInput}
      />

      <input
        placeholder="Issued Date"
        type="date"
        value={issueDate}
        onChange={(e) => setIssueDate(e.target.value)}
        required
        className={styles.formInput}
      />

      <input
        placeholder="Certificte ID"
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
        type="text"
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

      <button className={styles.formButton} type="submit">
        Add Certificate
      </button>

      {message && <p>{message}</p>}
    </form>
  );
};

export default CreateCertificate;
