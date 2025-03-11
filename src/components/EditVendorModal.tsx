"use client";

import { EditVendorModalProps, Vendors } from "@/utils/types";
import { Modal } from "@mui/material";
import React from "react";
import styles from "../styles/EditVendorModal.module.css";
import Head from "next/head";

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

  // Create structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Edit Vendor",
    description: "Form to edit vendor details in the E-Verify Portal system",
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
        aria-labelledby="edit-vendor-modal-title"
        aria-describedby="edit-vendor-modal-description"
        role="dialog"
      >
        <div className={styles.modalContainer}>
          <h2 id="edit-vendor-modal-title" className={styles.formHeading}>
            Edit Vendor
          </h2>
          <form
            className={styles.formContainer}
            role="dialog"
            aria-modal="true"
            id="edit-vendor-modal-description"
          >
            <input
              value={localVendor.name}
              className={styles.formInput}
              onChange={(e) =>
                setLocalVendor({ ...localVendor, name: e.target.value })
              }
              id="vendor-name"
              name="name"
              aria-label="Vendor Name"
              placeholder="Vendor Name"
            />
            <input
              value={localVendor.email}
              className={styles.formInput}
              onChange={(e) =>
                setLocalVendor({ ...localVendor, email: e.target.value })
              }
              id="vendor-email"
              name="email"
              aria-label="Vendor Email"
              placeholder="Email"
              type="email"
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
              id="vendor-org"
              name="org"
              aria-label="Organization"
              placeholder="Organization"
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
              id="vendor-org-pic"
              name="orgPic"
              aria-label="Organization Picture URL"
              placeholder="Organization Picture URL"
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
              <button
                className={styles.formButton}
                onClick={onClose}
                type="button"
                aria-label="Close edit form"
              >
                Close
              </button>
              <button
                className={styles.formButton}
                onClick={handleSave}
                type="button"
                aria-label="Save vendor changes"
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

export default EditVendorModal;
