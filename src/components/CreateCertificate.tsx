"use client";

import { useState } from "react";
import SingleEntryForm from "./SingleEntryForm";
import MultipleEntryForm from "./MultipleEntryForm";
import styles from "../styles/CreateCertificate.module.css";

const CreateCertificate = () => {
  const [viewMode, setViewMode] = useState("single"); // "single" or "multiple"
  const [message, setMessage] = useState("");

  return (
    <div>
      <h2 className={styles.formHeading}>Certificate's Form</h2>
      <div className={styles.viewToggleButtonContainer}>
        <button
          className={`${styles.viewToggleButton} ${
            viewMode === "single" ? styles.active : styles.inactive
          }`}
          onClick={() => setViewMode("single")}
        >
          Single Entry
        </button>
        <button
          className={`${styles.viewToggleButton} ${
            viewMode === "multiple" ? styles.active : styles.inactive
          }`}
          onClick={() => setViewMode("multiple")}
        >
          Multiple Entry
        </button>
      </div>
      {message && <p className={styles.message}>{message}</p>}
      {viewMode === "single" ? (
        <SingleEntryForm onMessage={setMessage} />
      ) : (
        <MultipleEntryForm onMessage={setMessage} />
      )}
    </div>
  );
};

export default CreateCertificate;