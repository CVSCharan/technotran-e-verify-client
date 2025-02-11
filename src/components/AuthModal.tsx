"use client";
import React from "react";
import { Modal } from "@mui/material";
import { useAdmin } from "@/context/AdminContext";
import { useRouter } from "next/navigation";
import styles from "../styles/AdminAuthModal.module.css";
import { LoginModalProps } from "@/utils/types";

const LoginModal: React.FC<LoginModalProps> = ({ authParams }) => {
  const { showModal, setShowModal } = useAdmin();
  const router = useRouter();

  const handleGoToLogin = () => {
    setShowModal(false); // Close modal on redirection
    if (authParams === "Vendor") {
      router.push("/vendor-portal");
    } else {
      router.push("/admin-login");
    }
  };

  return (
    <Modal
      open={showModal}
      className={styles.modalMainContainer}
      aria-labelledby="admin-login-auth-modal-title"
      aria-describedby="admin-login-auth-modal-description"
    >
      <div className={styles.modalContainer}>
        <h2 className={styles.heading}>Authentication Required</h2>
        <h3 className={styles.subHeading}>
          Please log in to access this page.
        </h3>
        <button onClick={handleGoToLogin} className={styles.routeButton}>
          Log In
        </button>
      </div>
    </Modal>
  );
};

export default LoginModal;
