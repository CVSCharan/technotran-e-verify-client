"use client";

import React, { useState } from "react";
import { Modal } from "@mui/material";
import styles from "../styles/ForgotPasswordModal.module.css";
import { ForgotPasswordModalProps } from "@/utils/types";
import Head from "next/head";

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  target,
  open,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "otp" | "password">("email");

  // Create structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Password Recovery",
    description: "Reset your password for the E-Verify Portal system",
  };

  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_BASE_URL}/verify/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("OTP sent successfully. Check your email.");
        setStep("otp");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to send OTP.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_BASE_URL}/verify/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        setMessage("OTP verified successfully.");
        setStep("password");
      } else {
        const data = await response.json();
        setError(data.message || "Invalid OTP.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      let TARGET_API_CALL;
      if (target === "Vendor") {
        TARGET_API_CALL = `${API_BASE_URL}/vendors/reset-password`;
      } else {
        TARGET_API_CALL = `${API_BASE_URL}/admins/reset-password`;
      }
      const response = await fetch(TARGET_API_CALL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      if (response.ok) {
        setMessage("Password reset successfully.");
        setStep("email");
        setEmail("");
        setOtp("");
        setNewPassword("");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to reset password.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Try again later.");
    } finally {
      setLoading(false);
    }
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
        aria-labelledby="forgot-password-modal-title"
        aria-describedby="forgot-password-modal-description"
        className={styles.modalMainContainer}
        role="dialog"
        onClose={onClose}
      >
        <form className={styles.modalContainer} role="dialog" aria-modal="true">
          <h2 id="forgot-password-modal-title" className={styles.formHeading}>
            Forgot Password?
          </h2>
          <h3
            id="forgot-password-modal-description"
            className={styles.formSubHeading}
          >
            {step === "email" && "Enter your registered email to receive OTP."}
            {step === "otp" && "Enter the OTP sent to your email."}
            {step === "password" && "Enter your new password."}
          </h3>

          {step === "email" && (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.formInput}
              placeholder="Enter Email"
              id="reset-email"
              name="email"
              aria-label="Email address"
              aria-required="true"
            />
          )}

          {step === "otp" && (
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={styles.formInput}
              placeholder="Enter OTP"
              id="reset-otp"
              name="otp"
              aria-label="One-time password"
              aria-required="true"
            />
          )}

          {step === "password" && (
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={styles.formInput}
              placeholder="Enter New Password"
              id="reset-password"
              name="newPassword"
              aria-label="New password"
              aria-required="true"
            />
          )}

          <div className={styles.btnContainer}>
            <button
              className={styles.formButton}
              onClick={onClose}
              disabled={loading}
              type="button"
              aria-label="Close password reset form"
            >
              Close
            </button>
            {step === "email" && (
              <button
                type="button"
                className={styles.formButton}
                onClick={handleSendOtp}
                disabled={loading}
                aria-label="Send one-time password to email"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            )}
            {step === "otp" && (
              <button
                type="button"
                className={styles.formButton}
                onClick={handleVerifyOtp}
                disabled={loading}
                aria-label="Verify one-time password"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            )}
            {step === "password" && (
              <button
                type="button"
                className={styles.formButton}
                onClick={handleResetPassword}
                disabled={loading}
                aria-label="Reset password with new password"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            )}
          </div>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className={styles.success} role="status">
              {message}
            </p>
          )}
        </form>
      </Modal>
    </>
  );
};

export default ForgotPasswordModal;
