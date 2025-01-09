"use client";

import AdminNav from "@/sections/AdminNav";
import React, { useState } from "react";
import styles from "./page.module.css";
import Footer from "@/sections/Footer";
import CreateCertificate from "@/components/CreateCertificate";
import CreateVendor from "@/components/CreateVendor";
import { Modal } from "@mui/material";
import CreateAdmin from "@/components/CreateAdmin";

const AdminDashboardPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState<
    "vendor" | "certificate" | "admin" | null
  >(null);

  // Open Modal and Set Content
  const openCreateVendorModal = () => {
    setModalContent("vendor");
    setOpenModal(true);
  };

  const openCreateCertificateModal = () => {
    setModalContent("certificate");
    setOpenModal(true);
  };

  const openCreateAdminModal = () => {
    setModalContent("admin");
    setOpenModal(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setModalContent(null);
  };

  return (
    <main id="E-Verify Portal Admin Dashboard">
      <AdminNav />
      <section className={styles.mainBody}>
        <div className={styles.landingSection}>
          <h2 className={styles.landingHeading}>E-Verify Portal Dashboard</h2>
          <h2 className={styles.subHeading}>A Technotran Solutions Venture</h2>
          <div className={styles.btnContainer}>
            <button
              onClick={openCreateVendorModal}
              className={`${styles.button} quicksand-text`}
            >
              Add Vendor
            </button>
            <button
              onClick={openCreateCertificateModal}
              className={`${styles.button} quicksand-text`}
            >
              Add Certificate
            </button>
            <button
              onClick={openCreateAdminModal}
              className={`${styles.button} quicksand-text`}
            >
              Add Admin
            </button>
          </div>
        </div>
      </section>

      {/* Modal Component */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className={styles.modalBox}>
          <div className={styles.modalContent}>
            {modalContent === "vendor" && <CreateVendor />}
            {modalContent === "certificate" && <CreateCertificate />}
            {modalContent === "admin" && <CreateAdmin />}
          </div>
        </div>
      </Modal>

      <Footer />
    </main>
  );
};

export default AdminDashboardPage;
