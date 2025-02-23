"use client";

import React, { useState } from "react";
import AdminNav from "@/sections/AdminNav";
import styles from "./page.module.css";
import Footer from "@/sections/Footer";
import CreateCertificate from "@/components/CreateCertificate";
import CreateVendor from "@/components/CreateVendor";
import { Modal } from "@mui/material";
import CreateAdmin from "@/components/CreateAdmin";
import Image from "next/image";
import { useAdmin } from "@/context/AdminContext";
import { useRouter } from "next/navigation";
import LoginModal from "@/components/AuthModal"; // Import the LoginModal component

const AdminDashboardPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState<
    "vendor" | "certificate" | "admin" | null
  >(null);

  const router = useRouter();

  const { adminUser, showModal } = useAdmin(); // Get adminUser and showModal from context

  console.log(adminUser, showModal);
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
      {/* Show the LoginModal if user is not authenticated */}
      {!adminUser && showModal && <LoginModal authParams="Admin" />}

      <AdminNav />
      <section className={styles.mainBody}>
        <div className={styles.landingSection}>
          <h2 className={styles.landingHeading}>E-Verify Portal Dashboard</h2>
          <h2 className={styles.subHeading}>A Technotran Solutions Venture</h2>
          <div className={styles.userProfileContainer}>
            <Image
              src={
                adminUser?.profilePic ||
                "https://github.com/CVSCharan/Technotran_Assets/blob/main/Picture11.png?raw=true"
              } // Fallback image
              alt="admin profile pic"
              height={100}
              width={100}
              className={styles.userPic}
            />
            <h2 className={styles.userName}>{adminUser?.username}</h2>
            <h3 className={styles.userRole}>
              {adminUser?.role === "superadmin" ? "Super Admin" : "Admin"}
            </h3>
          </div>
          <>
            {adminUser?.role === "superadmin" && (
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
            )}
          </>
          <div className={styles.btnContainer}>
            <button
              className={`${styles.button} quicksand-text`}
              onClick={() => router.push("/view-vendors")}
            >
              View Vendors
            </button>
            <button
              className={`${styles.button} quicksand-text`}
              onClick={() => router.push("/view-certificates")}
            >
              View Certificates
            </button>
            <button
              className={`${styles.button} quicksand-text`}
              onClick={() => router.push("/view-admins")}
            >
              View Admins
            </button>
          </div>
          <div className={styles.btnContainer}>
            <button
              className={`${styles.button} quicksand-text`}
              onClick={() => router.push("/analytics")}
            >
              Analytics
            </button>
          </div>
        </div>
      </section>

      {/* Modal Component for Create Vendor, Certificate, Admin */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className={styles.modalMainContainer}
      >
        <div className={styles.modalBox}>
          <div className={styles.modalContent}>
            {modalContent === "vendor" && (
              <CreateVendor handleCloseModal={handleCloseModal} />
            )}
            {modalContent === "certificate" && <CreateCertificate />}
            {modalContent === "admin" && (
              <CreateAdmin handleCloseModal={handleCloseModal} />
            )}
          </div>
        </div>
      </Modal>

      <Footer />
    </main>
  );
};

export default AdminDashboardPage;
