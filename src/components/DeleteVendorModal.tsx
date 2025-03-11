"use client";

import { DeleteVendorModalProps } from "@/utils/types";
import React from "react";
import { Modal } from "@mui/material";
import styles from "../styles/DeleteVendorModal.module.css"
import Head from "next/head";

const DeleteVendorModal: React.FC<DeleteVendorModalProps> = ({
  open,
  onClose,
  vendor,
  onDelete,
}) => {
  if (!vendor) return null;

  // SEO structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Delete Vendor Confirmation",
    "description": "Confirmation dialog for deleting vendor accounts in the E-Verify system"
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
        aria-labelledby="delete-vendor-modal-title"
        aria-describedby="delete-vendor-modal-description"
        role="dialog"
      >
        <div 
          className={styles.container}
          role="alertdialog"
          aria-modal="true"
        >
          <h2 id="delete-vendor-modal-title">Delete Vendor</h2>
          <p id="delete-vendor-modal-description">
            Are you sure you want to delete the vendor user{" "}
            <strong>{vendor.name}</strong>?
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
              aria-label={`Confirm deletion of vendor ${vendor.name}`}
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

export default DeleteVendorModal;
