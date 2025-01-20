"use client";

import { AdminUser, EditAdminModalProps } from "@/utils/types";
import React from "react";
import { Modal } from "@mui/material";
import styles from "../styles/EditAdminModal.module.css";

const roleOptions: Array<"superadmin" | "admin"> = ["superadmin", "admin"];

const EditAdminsModal: React.FC<EditAdminModalProps> = ({
  open,
  onClose,
  admin,
  onSave,
}) => {
  const [localAdmin, setLocalAdmin] = React.useState<AdminUser | null>(null);

  React.useEffect(() => {
    if (admin) {
      setLocalAdmin({ ...admin });
    }
  }, [admin]);

  const handleSave = () => {
    if (localAdmin) {
      onSave(localAdmin);
    }
    onClose();
  };

  if (!localAdmin) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      className={styles.modalMainContainer}
      aria-labelledby="edit-admin-modal-title"
      aria-describedby="edit-admin-modal-description"
    >
      <div className={styles.modalContainer}>
        <h2 id="edit-admin-modal-title" className={styles.formHeading}>
          Edit User
        </h2>
        <form className={styles.formContainer}>
          <input
            type="text"
            value={localAdmin.username}
            className={styles.formInput}
            onChange={(e) =>
              setLocalAdmin({ ...localAdmin, username: e.target.value })
            }
          />
          <input
            type="email"
            value={localAdmin.email}
            className={styles.formInput}
            onChange={(e) =>
              setLocalAdmin({ ...localAdmin, email: e.target.value })
            }
          />
          <input
            type="text"
            value={localAdmin.profilePic}
            className={styles.formInput}
            onChange={(e) =>
              setLocalAdmin({ ...localAdmin, profilePic: e.target.value })
            }
          />
          {/* Role Dropdown */}
          <select
            value={localAdmin.role}
            className={styles.formInput}
            onChange={(e) =>
              setLocalAdmin({
                ...localAdmin,
                role: e.target.value as "superadmin" | "admin",
              })
            }
          >
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
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
              type="button"
              className={styles.formButton}
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className={styles.formButton}
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditAdminsModal;
