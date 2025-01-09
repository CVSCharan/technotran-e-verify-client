"use client";

import AdminNav from "@/sections/AdminNav";
import React, { useState } from "react";
import styles from "./page.module.css";
import Footer from "@/sections/Footer";
import CreateCertificate from "@/components/CreateCertificate";
import CreateVendor from "@/components/CreateVendor";
import { Modal, Button } from "@mui/material";

const AdminDashboardPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState<
    "vendor" | "certificate" | null
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
          <h1 className={styles.landingHeading}>E-Verify Portal Dashboard</h1>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={openCreateVendorModal}
            >
              Add Vendor
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={openCreateCertificateModal}
            >
              Add Certificate
            </Button>
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
          </div>
        </div>
      </Modal>

      <Footer />
    </main>
  );
};

export default AdminDashboardPage;
