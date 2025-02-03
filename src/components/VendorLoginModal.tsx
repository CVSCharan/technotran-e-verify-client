import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { VendorLoginModalProps } from "@/utils/types"; // Assuming you have Vendor type
import styles from "../styles/VendorLoginModal.module.css";
import Image from "next/image";
import { useVendor } from "@/context/VendorContext";
import { useRouter } from "next/navigation";
import ForgotPasswordModal from "./ForgotPasswordModal";

export default function VendorLoginModal({
  open,
  setOpen,
  orgData,
}: VendorLoginModalProps) {
  const [username, setUsername] = useState(""); // State to manage the username
  const [password, setPassword] = useState(""); // State to manage the password
  const [error, setError] = useState<string | null>(null); // State for error message
  const [message, setMessage] = useState<string | null>(null);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const router = useRouter();

  const handleClose = () => setOpen(false);

  const { login } = useVendor();

  const handleForgotPasswordClick = () => {
    setOpen(false);
    setForgotPasswordOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Example validation
    if (!username || !password) {
      setError("Please enter username & password to Log In");
      console.log(message);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/vendors/login/${orgData?.name}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }), // Removed orgName from body
      });

      const data = await response.json();

      if (response.ok) {
        login(data);
        setMessage(data.message);
        setError(null);
        router.push(`/vendor-dashboard`);
      } else {
        setMessage(null);
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
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

            {/* Forgot Password Button */}
            <button
              type="button"
              className={styles.forgotPassword}
              onClick={() => handleForgotPasswordClick()}
            >
              Forgot Password?
            </button>

            <button className={styles.formButton} type="submit">
              Log In
            </button>

            {error && <h2 className={styles.formMsg}>{error}</h2>}
          </form>
        </div>
      </Modal>
      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        target="Vendor"
        open={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      />
    </>
  );
}
