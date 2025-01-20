"use client";

import { EditVendorModalProps, Vendors } from "@/utils/types";
import { Modal } from "@mui/material";
import React from "react";
import styles from "../styles/EditVendorModal.module.css";

const EditVendorModal: React.FC<EditVendorModalProps> = ({
  open,
  onClose,
  vendor,
  onSave,
}) => {
  const [localVendor, setLocalVendor] = React.useState<Vendors | null>(null);

  React.useEffect(() => {
    if (vendor) {
      setLocalVendor({ ...vendor });
    }
  }, [vendor]);

  const handleSave = () => {
    if (localVendor) {
      onSave(localVendor);
    }
    onClose();
  };

  if (!localVendor) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      className={styles.modalMainContainer}
      aria-labelledby="edit-vendor-modal-title"
      aria-describedby="edit-vendor-modal-description"
    >
      <div className={styles.modalContainer}>
        <h2 id="edit-vendor-modal-title" className={styles.formHeading}>
          Edit Vendor
        </h2>
        <form className={styles.formContainer}>
          <input
            value={localVendor.name}
            className={styles.formInput}
            onChange={(e) =>
              setLocalVendor({ ...localVendor, name: e.target.value })
            }
          />
          <input
            value={localVendor.email}
            className={styles.formInput}
            onChange={(e) =>
              setLocalVendor({ ...localVendor, email: e.target.value })
            }
          />
          <input
            value={localVendor.org}
            className={styles.formInput}
            onChange={(e) =>
              setLocalVendor({
                ...localVendor,
                org: e.target.value,
              })
            }
          />
          <input
            value={localVendor.orgPic}
            className={styles.formInput}
            onChange={(e) =>
              setLocalVendor({
                ...localVendor,
                orgPic: e.target.value,
              })
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
              Close
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

export default EditVendorModal;
