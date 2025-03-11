import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { VendorLoginModalProps } from "@/utils/types"; // Assuming you have Vendor type
import styles from "../styles/VendorLoginModal.module.css";
import Image from "next/image";
import { useVendor } from "@/context/VendorContext";
import { useRouter } from "next/navigation";
import ForgotPasswordModal from "./ForgotPasswordModal";
import Head from "next/head";

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

  // SEO structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Vendor Login",
    "description": "Login portal for vendors in the E-Verify system"
  };

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
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="vendor-login-title"
        aria-describedby="vendor-login-description"
        className={styles.modalMainContainer}
      >
        <div className={styles.modalContainer}>
          {orgData && (
            <>
              <h2 id="vendor-login-title" className={styles.formHeading}>
                {orgData.name}
              </h2>
              <div className={styles.imageContainer}>
                <Image
                  src={orgData.imgSrc}
                  alt={orgData.name}
                  height={150}
                  width={150}
                  className={styles.formImg}
                  priority
                />
              </div>
            </>
          )}

          {/* Login Form */}
          <form 
            className={styles.formContainer} 
            onSubmit={handleSubmit}
            id="vendor-login-description"
          >
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.formInput}
              aria-label="Username"
              name="username"
              autoComplete="username"
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.formInput}
              aria-label="Password"
              name="password"
              autoComplete="current-password"
            />

            {/* Forgot Password Button */}
            <button
              type="button"
              className={styles.forgotPassword}
              onClick={() => handleForgotPasswordClick()}
              aria-label="Forgot Password"
            >
              Forgot Password?
            </button>

            <button 
              className={styles.formButton} 
              type="submit"
              aria-label="Log In"
            >
              Log In
            </button>

            {error && <p className={styles.formMsg} role="alert">{error}</p>}
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
