"use client";

import { useState } from "react";
import SingleEntryForm from "./SingleEntryForm";
import MultipleEntryForm from "./MultipleEntryForm";
import styles from "../styles/CreateCertificate.module.css";

const CreateCertificate = () => {
  const [viewMode, setViewMode] = useState("single"); // "single" or "multiple"
  const [message, setMessage] = useState("");

  return (
    <div className={styles.certificateFormContainer} role="region" aria-labelledby="certificate-form-heading">
      <h2 id="certificate-form-heading" className={styles.formHeading}>{`Certificate's Form`}</h2>
      <div className={styles.viewToggleButtonContainer} role="tablist" aria-label="Form entry mode">
        <button
          className={`${styles.viewToggleButton} ${
            viewMode === "single" ? styles.active : styles.inactive
          }`}
          onClick={() => setViewMode("single")}
          role="tab"
          aria-selected={viewMode === "single"}
          aria-controls="single-entry-form"
          id="single-entry-tab"
        >
          Single Entry
        </button>
        <button
          className={`${styles.viewToggleButton} ${
            viewMode === "multiple" ? styles.active : styles.inactive
          }`}
          onClick={() => setViewMode("multiple")}
          role="tab"
          aria-selected={viewMode === "multiple"}
          aria-controls="multiple-entry-form"
          id="multiple-entry-tab"
        >
          Multiple Entry
        </button>
      </div>
      {message && <p className={styles.message} role="status">{message}</p>}
      <div role="tabpanel" id="single-entry-form" aria-labelledby="single-entry-tab" hidden={viewMode !== "single"}>
        {viewMode === "single" && <SingleEntryForm onMessage={setMessage} />}
      </div>
      <div role="tabpanel" id="multiple-entry-form" aria-labelledby="multiple-entry-tab" hidden={viewMode !== "multiple"}>
        {viewMode === "multiple" && <MultipleEntryForm onMessage={setMessage} />}
      </div>
    </div>
  );
};

export default CreateCertificate;
