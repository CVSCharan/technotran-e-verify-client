"use client";

import React from "react";
import { Modal } from "@mui/material";
import { Certificate, EditCertificateModalProps } from "@/utils/types";
import styles from "../styles/EditCertificateModal.module.css";
import Head from "next/head";

const EditCertificateModal: React.FC<EditCertificateModalProps> = ({
  open,
  onClose,
  certificate,
  onSave,
}) => {
  const [localCertificate, setLocalCertificate] =
    React.useState<Certificate | null>(null);

  React.useEffect(() => {
    if (certificate) {
      setLocalCertificate({ ...certificate });
    }
  }, [certificate]);

  const handleSave = () => {
    if (localCertificate) {
      onSave(localCertificate);
    }
    onClose();
  };

  if (!localCertificate) return null;

  // Create structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Edit Certificate",
    "description": "Form to edit certificate details in the E-Verify Portal system"
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <Modal
        open={open}
        onClose={onClose}
        className={styles.modalMainContainer}
        aria-labelledby="edit-certificate-modal-title"
        aria-describedby="edit-certificate-modal-description"
        role="dialog"
      >
        <div className={styles.modalContainer} role="form" aria-modal="true">
          <h2 id="edit-certificate-modal-title" className={styles.formHeading}>
            Edit Certificate
          </h2>
          <form className={styles.formContainer} id="edit-certificate-modal-description">
            <input
              value={localCertificate.name}
              placeholder="Name"
              className={styles.formInput}
              onChange={(e) =>
                setLocalCertificate({ ...localCertificate, name: e.target.value })
              }
              id="certificate-name"
              name="name"
              aria-label="Certificate Name"
            />

            {/* Dropdown for Type Selection */}
            <select
              value={localCertificate.type}
              onChange={(e) =>
                setLocalCertificate({
                  ...localCertificate,
                  type: e.target.value as
                    | "AICTE Internship"
                    | "Internship"
                    | "Workshop",
                })
              }
              required
              className={styles.formInput}
              id="certificate-type"
              name="type"
              aria-label="Certificate Type"
            >
              <option value="AICTE Internship">AICTE Internship</option>
              <option value="Internship">Internship</option>
              <option value="Workshop">Workshop</option>
            </select>

            <input
              value={localCertificate.program}
              placeholder="Program"
              className={styles.formInput}
              onChange={(e) =>
                setLocalCertificate({
                  ...localCertificate,
                  program: e.target.value,
                })
              }
              id="certificate-program"
              name="program"
              aria-label="Program"
            />
            <input
              value={localCertificate.department}
              placeholder="Department"
              className={styles.formInput}
              onChange={(e) =>
                setLocalCertificate({
                  ...localCertificate,
                  department: e.target.value,
                })
              }
              id="certificate-department"
              name="department"
              aria-label="Department"
            />
            <input
              type="date"
              placeholder="Start Date"
              className={styles.formInput}
              value={
                new Date(localCertificate.startDate).toISOString().split("T")[0]
              }
              onChange={(e) =>
                setLocalCertificate({
                  ...localCertificate,
                  startDate: new Date(e.target.value).toISOString(),
                })
              }
              id="certificate-start-date"
              name="startDate"
              aria-label="Start Date"
            />
            <input
              type="date"
              placeholder="Issue Date"
              className={styles.formInput}
              value={
                new Date(localCertificate.issueDate).toISOString().split("T")[0]
              }
              onChange={(e) =>
                setLocalCertificate({
                  ...localCertificate,
                  issueDate: new Date(e.target.value).toISOString(),
                })
              }
              id="certificate-issue-date"
              name="issueDate"
              aria-label="Issue Date"
            />
            <input
              value={localCertificate.certificateId}
              placeholder="Certificate ID"
              className={styles.formInput}
              onChange={(e) =>
                setLocalCertificate({
                  ...localCertificate,
                  certificateId: e.target.value,
                })
              }
              id="certificate-id"
              name="certificateId"
              aria-label="Certificate ID"
            />
            <input
              value={localCertificate.certificateImgSrc}
              placeholder="Certificate Img URL"
              className={styles.formInput}
              onChange={(e) =>
                setLocalCertificate({
                  ...localCertificate,
                  certificateImgSrc: e.target.value,
                })
              }
              id="certificate-img-src"
              name="certificateImgSrc"
              aria-label="Certificate Image URL"
            />
            <input
              value={localCertificate.rollNo}
              placeholder="Roll No."
              className={styles.formInput}
              onChange={(e) =>
                setLocalCertificate({
                  ...localCertificate,
                  rollNo: e.target.value,
                })
              }
              id="certificate-roll-no"
              name="rollNo"
              aria-label="Roll Number"
            />
            <input
              value={localCertificate.email}
              placeholder="Email"
              className={styles.formInput}
              onChange={(e) =>
                setLocalCertificate({
                  ...localCertificate,
                  email: e.target.value,
                })
              }
              id="certificate-email"
              name="email"
              aria-label="Email"
              type="email"
            />
            <input
              value={localCertificate.org}
              placeholder="Organization"
              className={styles.formInput}
              onChange={(e) =>
                setLocalCertificate({ ...localCertificate, org: e.target.value })
              }
              id="certificate-org"
              name="org"
              aria-label="Organization"
            />
            <div
              style={{
                marginTop: 2,
                display: "flex",
                justifyContent: "center",
                width: "70%",
                gap: "10px",
              }}
            >
              <button 
                className={styles.formButton} 
                onClick={onClose}
                type="button"
                aria-label="Close edit form"
              >
                Close
              </button>
              <button 
                className={styles.formButton} 
                onClick={handleSave}
                type="button"
                aria-label="Save certificate changes"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default EditCertificateModal;
