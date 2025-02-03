"use client";

import React, { useState } from "react";
import { Modal } from "@mui/material";
import styles from "../styles/ForgotPasswordModal.module.css";
import { ForgotPasswordModalProps } from "@/utils/types";

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
    <Modal
      open={open}
      aria-labelledby="forgot-password-modal"
      className={styles.modalMainContainer}
    >
      <form className={styles.modalContainer}>
        <h2 className={styles.formHeading}>Forgot Password?</h2>
        <h3 className={styles.formSubHeading}>
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
          />
        )}

        {step === "otp" && (
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className={styles.formInput}
            placeholder="Enter OTP"
          />
        )}

        {step === "password" && (
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={styles.formInput}
            placeholder="Enter New Password"
          />
        )}

        <div className={styles.btnContainer}>
          <button
            className={styles.formButton}
            onClick={onClose}
            disabled={loading}
          >
            Close
          </button>
          {step === "email" && (
            <button
              type="button"
              className={styles.formButton}
              onClick={handleSendOtp}
              disabled={loading}
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
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          )}
        </div>

        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.success}>{message}</p>}
      </form>
    </Modal>
  );
};

export default ForgotPasswordModal;
