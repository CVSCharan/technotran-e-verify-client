"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import QRCode from "qrcode"; // Import the qrcode library
import styles from "./page.module.css"; // Import CSS module
import { Certificate } from "@/utils/types";

const CertificateDetails = () => {
  const params = useParams();
  const id = params.id;

  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCertificate = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/certificates/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch certificate details");
        }
        const data: Certificate = await response.json();
        setCertificate(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id]);

  useEffect(() => {
    if (certificate && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        let imgSrc =
          "https://github.com/CVSCharan/Technotran_Assets/blob/main/Internship_Cert.png?raw=true"; // Default for AICTE Internship & Internship
        if (certificate.type === "Workshop") {
          imgSrc =
            "https://github.com/CVSCharan/Technotran_Assets/blob/main/Workshop_Cert.png?raw=true"; // Different image for Workshop
        }

        const img = new Image();
        img.src = imgSrc;

        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Set font styles
          ctx.font = "bold 30px Arial";
          ctx.fillStyle = "black";

          // Common fields for all certificates
          ctx.fillText(certificate.name, 50, 320);
          ctx.fillText(certificate.type, 70, 150);
          ctx.fillText(certificate.certificateId, 150, 510);
          ctx.fillText(certificate.rollNo, 85, 535);

          // Additional field for AICTE Internship
          if (certificate.type === "AICTE Internship") {
            ctx.fillText(`AICTE ID: ${certificate.aicteId || "N/A"}`, 150, 560);
          }

          // Generate QR code and draw on canvas
          QRCode.toCanvas(
            qrCanvasRef.current,
            `https://technotran-e-verify-client.vercel.app/certificate/${id}`,
            {
              width: 100,
              margin: 0,
            },
            (error) => {
              if (!error && qrCanvasRef.current) {
                const qrImg = qrCanvasRef.current;
                ctx.drawImage(
                  qrImg,
                  canvas.width - 120,
                  canvas.height - 120,
                  100,
                  100
                );
              }
            }
          );
        };
      }
    }
  }, [certificate, id]);

  const downloadImage = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.download = `certificate-${id}.png`;
      link.href = canvasRef.current.toDataURL("image/png");
      link.click();
    }
  };

  if (loading)
    return <p className={styles.loading}>Loading certificate details...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (!certificate)
    return <p className={styles.noData}>No certificate found</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Certificate Details</h1>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className={styles.certificateCanvas}
      ></canvas>
      <canvas
        ref={qrCanvasRef}
        width={100}
        height={100}
        style={{ display: "none" }} // QR code canvas is hidden, only used for rendering
      ></canvas>
      <button className={styles.downloadButton} onClick={downloadImage}>
        Download Certificate with Details
      </button>
    </div>
  );
};

export default CertificateDetails;
