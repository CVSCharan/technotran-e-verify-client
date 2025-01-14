"use client";

import React from "react";
import { Modal } from "@mui/material";
import { Certificate, EditCertificateModalProps } from "@/utils/types";
import styles from "../styles/EditCertificateModal.module.css";

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

  return (
    <Modal
      open={open}
      onClose={onClose}
      className={styles.modalMainContainer}
      aria-labelledby="edit-certificate-modal-title"
      aria-describedby="edit-certificate-modal-description"
    >
      <div className={styles.modalContainer}>
        <h2 id="edit-certificate-modal-title" className={styles.formHeading}>
          Edit Certificate
        </h2>
        <form className={styles.formContainer}>
          <input
            value={localCertificate.name}
            className={styles.formInput}
            onChange={(e) =>
              setLocalCertificate({ ...localCertificate, name: e.target.value })
            }
          />
          <input
            value={localCertificate.type}
            className={styles.formInput}
            onChange={(e) =>
              setLocalCertificate({ ...localCertificate, type: e.target.value })
            }
          />
          <input
            type="date"
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
          />
          <input
            value={localCertificate.certificateId}
            className={styles.formInput}
            onChange={(e) =>
              setLocalCertificate({
                ...localCertificate,
                certificateId: e.target.value,
              })
            }
          />
          <input
            value={localCertificate.rollNo}
            className={styles.formInput}
            onChange={(e) =>
              setLocalCertificate({
                ...localCertificate,
                rollNo: e.target.value,
              })
            }
          />
          <input
            value={localCertificate.email}
            className={styles.formInput}
            onChange={(e) =>
              setLocalCertificate({
                ...localCertificate,
                email: e.target.value,
              })
            }
          />
          <input
            value={localCertificate.org}
            className={styles.formInput}
            onChange={(e) =>
              setLocalCertificate({ ...localCertificate, org: e.target.value })
            }
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
            <button className={styles.formButton} onClick={onClose}>
              Cancel
            </button>
            <button className={styles.formButton} onClick={handleSave}>
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditCertificateModal;
