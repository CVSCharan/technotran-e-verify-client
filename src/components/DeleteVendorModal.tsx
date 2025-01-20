"use client";

import { DeleteVendorModalProps } from "@/utils/types";
import React from "react";
import { Modal } from "@mui/material";
import styles from "../styles/DeleteVendorModal.module.css"

const DeleteVendorModal: React.FC<DeleteVendorModalProps> = ({
  open,
  onClose,
  vendor,
  onDelete,
}) => {
  if (!vendor) return null;

  return (
    <Modal open={open} onClose={onClose} className={styles.modal}>
      <div className={styles.container}>
        <h2>Delete Vendor</h2>
        <p>
          Are you sure you want to delete the vendor user{" "}
          <strong>{vendor.name}</strong>?
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

export default DeleteVendorModal;
