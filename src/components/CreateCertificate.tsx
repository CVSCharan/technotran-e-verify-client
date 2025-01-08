"use client";

import { useState } from "react";

const CreateCertificate = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [certificateId, setCertificateId] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [message, setMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otpSent && !otpVerified) {
      // Verify OTP
      await verifyOtp();
    } else {
      // Send OTP and create certificate if OTP is not yet sent
      await sendOtp();
    }
  };

  const sendOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: "user@example.com" }), // Replace with dynamic email input if required
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOtpSent(true);
        setMessage("OTP sent successfully!");
      } else {
        const result = await response.json();
        setMessage(result.error || "Failed to send OTP!");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage("Error sending OTP!");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.valid) {
          setOtpVerified(true);
          setMessage(
            "OTP verified successfully! Now you can create the certificate."
          );
        } else {
          setOtpVerified(false);
          setMessage("Invalid OTP. Please try again.");
        }
      } else {
        const result = await response.json();
        setMessage(result.error || "OTP verification failed!");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setMessage("Error verifying OTP!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Create Certificate</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Type:</label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Issue Date:</label>
          <input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Certificate ID:</label>
          <input
            type="text"
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Roll No:</label>
          <input
            type="text"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            required
          />
        </div>

        {/* OTP logic */}
        {otpSent && !otpVerified && (
          <div>
            <label>Enter OTP:</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {/* Final submit */}
        {otpVerified && (
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Certificate"}
          </button>
        )}
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateCertificate;
