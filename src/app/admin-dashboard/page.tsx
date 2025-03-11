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
import LoginModal from "@/components/AuthModal";
import Head from "next/head";

const AdminDashboardPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState<
    "vendor" | "certificate" | "admin" | null
  >(null);

  const router = useRouter();
  const { adminUser, showModal } = useAdmin();

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
    <>
      <Head>
        <title>Admin Dashboard | E-Verify Portal | Technotran Solutions</title>
        <meta
          name="description"
          content="Manage certificates, vendors, and administrators through the E-Verify Portal admin dashboard. A secure certificate verification system by Technotran Solutions."
        />
        <meta
          name="keywords"
          content="admin dashboard, certificate management, vendor management, e-verify portal, technotran solutions"
        />
        <meta name="robots" content="noindex, nofollow" />
        <link
          rel="canonical"
          href="https://e-verify-portal.com/admin-dashboard"
        />
      </Head>

      <main
        className={styles.dashboardMain}
        aria-labelledby="dashboard-heading"
      >
        {/* Show the LoginModal if user is not authenticated */}
        {!adminUser && showModal && <LoginModal authParams="Admin" />}

        <AdminNav />
        <section className={styles.mainBody}>
          <div className={styles.landingSection}>
            <h1 id="dashboard-heading" className={styles.landingHeading}>
              E-Verify Portal Dashboard
            </h1>
            <p className={styles.subHeading}>A Technotran Solutions Venture</p>

            <div
              className={styles.userProfileContainer}
              aria-label="Admin Profile"
            >
              <Image
                src={
                  adminUser?.profilePic ||
                  "https://github.com/CVSCharan/Technotran_Assets/blob/main/Picture11.png?raw=true"
                }
                alt={`Profile picture of ${adminUser?.username || "admin"}`}
                height={100}
                width={100}
                className={styles.userPic}
                priority
              />
              <h2 className={styles.userName}>{adminUser?.username}</h2>
              <p className={styles.userRole}>
                {adminUser?.role === "superadmin" ? "Super Admin" : "Admin"}
              </p>
            </div>

            {adminUser?.role === "superadmin" && (
              <div className={styles.btnContainer} aria-label="Admin Actions">
                <button
                  onClick={openCreateVendorModal}
                  className={`${styles.button} quicksand-text`}
                  aria-label="Add Vendor"
                >
                  Add Vendor
                </button>
                <button
                  onClick={openCreateCertificateModal}
                  className={`${styles.button} quicksand-text`}
                  aria-label="Add Certificate"
                >
                  Add Certificate
                </button>
                <button
                  onClick={openCreateAdminModal}
                  className={`${styles.button} quicksand-text`}
                  aria-label="Add Admin"
                >
                  Add Admin
                </button>
              </div>
            )}

            <div className={styles.btnContainer} aria-label="View Options">
              <button
                className={`${styles.button} quicksand-text`}
                onClick={() => router.push("/view-vendors")}
                aria-label="View Vendors"
              >
                View Vendors
              </button>
              <button
                className={`${styles.button} quicksand-text`}
                onClick={() => router.push("/view-certificates")}
                aria-label="View Certificates"
              >
                View Certificates
              </button>
              <button
                className={`${styles.button} quicksand-text`}
                onClick={() => router.push("/view-admins")}
                aria-label="View Admins"
              >
                View Admins
              </button>
            </div>

            <div
              className={styles.btnContainer}
              aria-label="Additional Options"
            >
              <button
                className={`${styles.button} quicksand-text`}
                onClick={() => router.push("/analytics")}
                aria-label="Analytics"
              >
                Analytics
              </button>
              <button
                className={`${styles.button} quicksand-text`}
                onClick={() => router.push("/downloads")}
                aria-label="Downloads"
              >
                Downloads
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
          <div className={styles.modalBox} role="dialog">
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
    </>
  );
};

export default AdminDashboardPage;
