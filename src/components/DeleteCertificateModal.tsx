"use client";

import React from "react";
import { Modal } from "@mui/material";
import styles from "../styles/DeleteCertificateModal.module.css";
import { Certificate } from "@/utils/types";

interface DeleteCertificateModalProps {
  open: boolean;
  onClose: () => void;
  certificate: Certificate | null;
  onDelete: () => void;
}

const DeleteCertificateModal: React.FC<DeleteCertificateModalProps> = ({
  open,
  onClose,
  certificate,
  onDelete,
}) => {
  if (!certificate) return null;

  return (
    <Modal open={open} onClose={onClose} className={styles.modal}>
      <div className={styles.container}>
        <h2>Delete Certificate</h2>
        <p>
          Are you sure you want to delete the certificate for{" "}
          <strong>{certificate.name}</strong>?
        </p>
        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.deleteButton} onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteCertificateModal;
