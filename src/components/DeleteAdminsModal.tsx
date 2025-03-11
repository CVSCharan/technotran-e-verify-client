"use client";

import { DeleteAdminModalProps } from "@/utils/types";
import { Modal } from "@mui/material";
import React from "react";
import styles from "../styles/DeleteAdminModal.module.css";
import Head from "next/head";

const DeleteAdminsModal: React.FC<DeleteAdminModalProps> = ({
  open,
  onClose,
  admin,
  onDelete,
}) => {
  if (!admin) return null;

  // SEO structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Delete Admin Confirmation",
    "description": "Confirmation dialog for deleting administrator accounts in the E-Verify system"
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
        aria-labelledby="delete-admin-modal-title"
        aria-describedby="delete-admin-modal-description"
        role="dialog"
      >
        <div 
          className={styles.container}
          role="alertdialog"
          aria-modal="true"
        >
          <h2 id="delete-admin-modal-title">Delete User</h2>
          <p id="delete-admin-modal-description">
            Are you sure you want to delete the user -{" "}
            <strong>{admin.username}</strong>?
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
              aria-label={`Confirm deletion of user ${admin.username}`}
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

export default DeleteAdminsModal;
