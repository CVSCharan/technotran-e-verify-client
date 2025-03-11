"use client";

import React from "react";
import { Modal } from "@mui/material";
import styles from "../styles/DeleteCertificateModal.module.css";
import { DeleteCertificateModalProps } from "@/utils/types";
import Head from "next/head";

const DeleteCertificateModal: React.FC<DeleteCertificateModalProps> = ({
  open,
  onClose,
  certificate,
  onDelete,
}) => {
  if (!certificate) return null;

  // SEO structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Delete Certificate Confirmation",
    "description": "Confirmation dialog for deleting certificates in the E-Verify system"
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
        className={styles.modal}
        aria-labelledby="delete-certificate-modal-title"
        aria-describedby="delete-certificate-modal-description"
        role="dialog"
      >
        <div 
          className={styles.container}
          role="alertdialog"
          aria-modal="true"
        >
          <h2 id="delete-certificate-modal-title">Delete Certificate</h2>
          <p id="delete-certificate-modal-description">
            Are you sure you want to delete the certificate for{" "}
            <strong>{certificate.name}</strong>?
          </p>
          <div className={styles.actions}>
            <button 
              className={styles.cancelButton} 
              onClick={onClose}
              aria-label="Cancel deletion"
              type="button"
            >
              Cancel
            </button>
            <button 
              className={styles.deleteButton} 
              onClick={onDelete}
              aria-label={`Confirm deletion of certificate for ${certificate.name}`}
              type="button"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DeleteCertificateModal;
