"use client";

import { DeleteAdminModalProps } from "@/utils/types";
import { Modal } from "@mui/material";
import React from "react";
import styles from "../styles/DeleteAdminModal.module.css";

const DeleteAdminsModal: React.FC<DeleteAdminModalProps> = ({
  open,
  onClose,
  admin,
  onDelete,
}) => {
  if (!admin) return null;

  return (
    <Modal open={open} onClose={onClose} className={styles.modal}>
      <div className={styles.container}>
        <h2>Delete User</h2>
        <p>
          Are you sure you want to delete the user -{" "}
          <strong>{admin.username}</strong>?
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

export default DeleteAdminsModal;
