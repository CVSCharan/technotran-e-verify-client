"use client";

import { AdminUser, EditAdminModalProps } from "@/utils/types";
import React from "react";
import { Modal } from "@mui/material";
import styles from "../styles/EditAdminModal.module.css";
import Head from "next/head";

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

  // Create structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Edit Administrator",
    "description": "Form to edit administrator details in the E-Verify Portal system"
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
        aria-labelledby="edit-admin-modal-title"
        aria-describedby="edit-admin-modal-description"
        role="dialog"
      >
        <div className={styles.modalContainer} role="form" aria-modal="true">
          <h2 id="edit-admin-modal-title" className={styles.formHeading}>
            Edit User
          </h2>
          <form className={styles.formContainer} id="edit-admin-modal-description">
            <input
              type="text"
              value={localAdmin.username}
              className={styles.formInput}
              onChange={(e) =>
                setLocalAdmin({ ...localAdmin, username: e.target.value })
              }
              id="username"
              name="username"
              aria-label="Username"
            />
            <input
              type="email"
              value={localAdmin.email}
              className={styles.formInput}
              onChange={(e) =>
                setLocalAdmin({ ...localAdmin, email: e.target.value })
              }
              id="email"
              name="email"
              aria-label="Email"
            />
            <input
              type="text"
              value={localAdmin.profilePic}
              className={styles.formInput}
              onChange={(e) =>
                setLocalAdmin({ ...localAdmin, profilePic: e.target.value })
              }
              id="profilePic"
              name="profilePic"
              aria-label="Profile Picture URL"
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
              id="role"
              name="role"
              aria-label="User Role"
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
                aria-label="Close edit form"
              >
                Close
              </button>
              <button
                type="button"
                className={styles.formButton}
                onClick={handleSave}
                aria-label="Save admin changes"
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

export default EditAdminsModal;
