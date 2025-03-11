"use client";

import { useState } from "react";
import styles from "../styles/VerifyCertificateComp.module.css";
import { useRouter } from "next/navigation";
import Head from "next/head";

const VerifyCertificateComp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ certificateId: "", email: "" });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  // SEO structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Certificate Verification System",
    "applicationCategory": "BusinessApplication",
    "description": "Verify the authenticity of certificates through email OTP verification",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const resetForm = () => {
    setFormData({ certificateId: "", email: "" });
    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);
    setShowOtpInput(false);
    setErrorMessage("");
  };

  // Function to fetch the certificate
  const fetchCertificate = async (id: string) => {
    try {
      setLoading(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_BASE_URL}/certificates/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch certificate details");
      }
      const data = await response.json();
      console.log("Certificate Data:", data); // Log certificate data
      resetForm();
      router.push(`/certificate/${data.certificateId}`);
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOtpInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleSendOtp = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

      // Step 1: Check if email exists in the database
      const emailCheckResponse = await fetch(
        `${API_BASE_URL}/certificates/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      if (!emailCheckResponse.ok) {
        const errorData = await emailCheckResponse.json();
        setErrorMessage(errorData.message || "Email not found in our records.");
        return; // Stop execution if email doesn't exist
      }

      // Step 2: Send OTP if email exists
      const otpResponse = await fetch(`${API_BASE_URL}/verify/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      if (otpResponse.ok) {
        const data = await otpResponse.json();
        console.log(data);
        setOtpSent(true);
        setShowOtpInput(true);
        console.log("OTP sent successfully:");
      } else {
        const errorData = await otpResponse.json();
        setErrorMessage(errorData.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("An error occurred while sending the OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_BASE_URL}/verify/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.verified) {
          setOtpVerified(true);
          console.log("OTP verified successfully");
          await fetchCertificate(formData.certificateId);
        } else {
          setErrorMessage("Invalid OTP. Please try again.");
        }
      } else {
        const errorData = await response.json();
        console.error("Verify OTP Error:", errorData);
        setErrorMessage(errorData.message || "Failed to verify OTP");
      }
    } catch (error) {
      console.error("Verify OTP Exception:", error);
      setErrorMessage("An error occurred while verifying the OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Handle the button behavior based on states
    if (!otpSent) {
      // Send OTP if not already sent
      await handleSendOtp();
    } else if (!otpVerified && otp) {
      // Verify OTP if sent and user enters OTP
      await handleVerifyOtp();
    } else if (otpVerified) {
      // Fetch certificate if OTP is verified
      await fetchCertificate(formData.certificateId);
    } else {
      setErrorMessage("Please enter the OTP.");
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
      <form 
        onSubmit={handleSubmit} 
        className={styles.formContainer}
        aria-labelledby="verify-certificate-heading"
      >
        <h1 id="verify-certificate-heading" className={styles.formHeading}>Verify Your Certificate</h1>
        <input
          type="text"
          name="certificateId"
          placeholder="Enter Your Certificate ID"
          value={formData.certificateId}
          onChange={handleInputChange}
          required
          className={styles.formInput}
          aria-label="Certificate ID"
          autoComplete="off"
        />

        <input
          type="email"
          name="email"
          placeholder="Enter Your Email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className={styles.formInput}
          aria-label="Email Address"
          autoComplete="email"
        />

        {showOtpInput && (
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={handleOtpInputChange}
            required
            className={styles.formInput}
            aria-label="One-Time Password"
            autoComplete="one-time-code"
          />
        )}

        <button
          className={`${styles.formButton} quicksand-text`}
          type="submit"
          disabled={loading}
          aria-busy={loading}
        >
          {loading
            ? "Verifying..."
            : otpVerified
            ? "Check Certificate"
            : otpSent
            ? "Verify OTP"
            : "Send OTP"}
        </button>

        {errorMessage && <p className="quicksand-ext" role="alert">{errorMessage}</p>}
      </form>
    </>
  );
};

export default VerifyCertificateComp;
