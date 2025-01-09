import * as React from "react";
import Modal from "@mui/material/Modal";
import { Vendor } from "@/utils/types"; // Assuming you have Vendor type
import styles from "../styles/VendorLoginModal.module.css";
import Image from "next/image";

interface VendorLoginModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  orgData: Vendor | null; // Accept orgData as a prop
}

export default function VendorLoginModal({
  open,
  setOpen,
  orgData,
}: VendorLoginModalProps) {
  const [username, setUsername] = React.useState(""); // State to manage the username
  const [password, setPassword] = React.useState(""); // State to manage the password
  const [error, setError] = React.useState(""); // State for error message

  const handleClose = () => setOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Example validation
    if (!username || !password) {
      setError("Please fill in both fields.");
    } else {
      setError("");
      // Submit form (you can add your login logic here)
      console.log("Logged in with:", { username, password });
      // Close the modal after successful login
      handleClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className={styles.modalMainContainer}
    >
      <div className={styles.modalContainer}>
        {orgData && (
          <>
            <h2 id="modal-modal-title" className={styles.formHeading}>
              {orgData.name}
            </h2>
            <Image
              src={orgData.imgSrc}
              alt={orgData.name}
              height={150}
              width={150}
              className={styles.formImg}
            />
          </>
        )}

        {/* Login Form */}
        <form className={styles.formContainer} onSubmit={handleSubmit}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.formInput}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.formInput}
          />

          {error && <h2 color="error">{error}</h2>}

          <button className={styles.formButton} type="submit">
            Login
          </button>
        </form>
      </div>
    </Modal>
  );
}
