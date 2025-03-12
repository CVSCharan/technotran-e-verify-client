"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import QRCode from "qrcode";
import styles from "./page.module.css";
import { Certificate } from "@/utils/types";
import { vendorsData } from "@/utils/helper";
import Footer from "@/sections/Footer";
import Image from "next/image";
import jsPDF from "jspdf";

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
          `${process.env.NEXT_PUBLIC_API_URL}/certificates/id/${id}`
        );
        if (response.status === 404) {
          throw new Error("No Certificate details found");
        }
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

  // Function to format date as dd/mm/yy
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).format(date);
  };

  useEffect(() => {
    if (certificate && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        let imgSrc =
          "https://github.com/CVSCharan/Technotran_Assets/blob/main/Internship_Cert.png?raw=true"; // Default to Internship

        if (certificate.type === "Workshop") {
          imgSrc =
            "https://res.cloudinary.com/dcooiidus/image/upload/v1740660460/default_blank_workshop_cert_sgu2ad.jpg"; // Use Workshop Template
        }

        if (certificate.certificateImgSrc !== "") {
          imgSrc = certificate.certificateImgSrc ?? imgSrc;
        }

        const img = new window.Image();
        img.crossOrigin = "anonymous"; // Ensure CORS support
        img.src = imgSrc;

        img.onload = async () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          await document.fonts.ready;

          // **Embed Vendor Logo**
          const vendor = vendorsData.find((v) => v.name === certificate.org);
          if (vendor) {
            const vendorLogo = new window.Image();
            vendorLogo.crossOrigin = "anonymous"; // Ensures image loading works with CORS
            vendorLogo.src = vendor.imgSrc;
            vendorLogo.onload = () => {
              ctx.drawImage(vendorLogo, 110, 60, 70, 70); // Adjust position & size
            };
          }

          // **Text Styles**
          ctx.font = `500 16px "ArialCustom", Arial, sans-serif`;
          ctx.lineWidth = 0.5;
          ctx.strokeStyle = "black";
          ctx.fillStyle = "black";

          // **Display Student Details**
          ctx.strokeText(certificate.name, 400, 200);
          ctx.fillText(certificate.name, 400, 200);

          ctx.font = `500 22px "ArialCustom", Arial, sans-serif`;
          ctx.strokeStyle = "#4b0406";
          ctx.fillStyle = "#4b0406";

          // Calculate dynamic X position
          const programTextWidth = ctx.measureText(certificate.program).width;
          const centerXPrgm = (canvas.width - programTextWidth) / 2;

          // Draw centered text
          ctx.strokeText(certificate.program, centerXPrgm, 265);
          ctx.fillText(certificate.program, centerXPrgm, 265);

          ctx.font = `500 16px "ArialCustom", Arial, sans-serif`;
          ctx.strokeStyle = "#4b0406";
          ctx.fillStyle = "#4b0406";

          // Calculate dynamic X position
          const departmentTextWidth = ctx.measureText(
            certificate.department
          ).width;
          const centerXDept = (canvas.width - departmentTextWidth) / 2;

          const orgTextWidth = ctx.measureText(certificate.org).width;
          const centerXOrg = (canvas.width - orgTextWidth) / 2;

          ctx.strokeText(certificate.department, centerXDept, 320);
          ctx.fillText(certificate.department, centerXDept, 320);
          ctx.strokeText(certificate.org, centerXOrg, 370);
          ctx.fillText(certificate.org, centerXOrg, 370);

          ctx.font = `500 16px "ArialCustom", Arial, sans-serif`;
          ctx.strokeStyle = "black";
          ctx.fillStyle = "black";

          // **Format Dates (dd/mm/yy)**
          const formattedStartDate = formatDate(certificate.startDate);
          const formattedIssueDate = formatDate(certificate.issueDate);

          ctx.strokeText(formattedStartDate, 325, 395);
          ctx.fillText(formattedStartDate, 325, 395);
          ctx.strokeText(formattedIssueDate, 495, 395);
          ctx.fillText(formattedIssueDate, 495, 395);

          ctx.font = `500 11px "ArialCustom", Arial, sans-serif`;
          ctx.strokeStyle = "#4b0406";
          ctx.fillStyle = "#4b0406";

          ctx.strokeText(certificate.certificateId, 723, 315);
          ctx.fillText(certificate.certificateId, 723, 315);

          // **Generate QR Code**
          if (qrCanvasRef.current) {
            QRCode.toCanvas(
              qrCanvasRef.current,
              `https://e-verify.technotran.in/certificate/${id}`,
              {
                width: 100,
                margin: 2,
                color: {
                  dark: "#000000",
                  light: "#FFFFFF",
                },
                errorCorrectionLevel: "H",
              },
              (error) => {
                if (!error && qrCanvasRef.current) {
                  const qrImg = qrCanvasRef.current;
                  const qrX = canvas.width - 133;
                  const qrY = canvas.height - 140;
                  const qrSize = 80;

                  // Add white background with padding
                  ctx.fillStyle = "#FFFFFF";
                  ctx.fillRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10);

                  // Add subtle border
                  ctx.strokeStyle = "#4b0406";
                  ctx.lineWidth = 1;
                  ctx.strokeRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10);

                  // Draw QR code
                  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
                }
              }
            );
          }
        };
      }
    }
  }, [certificate, id]);

  // const downloadImage = () => {
  //   if (canvasRef.current) {
  //     const link = document.createElement("a");
  //     link.download = `certificate-${id}.png`;
  //     link.href = canvasRef.current.toDataURL("image/png");
  //     link.click();
  //   }
  // };

  const downloadCertificatePDF = async (): Promise<void> => {
    if (!canvasRef.current || !certificate) return;

    const canvas = canvasRef.current;
    const scale = 4; // Higher scale for better resolution
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width * scale;
    tempCanvas.height = canvas.height * scale;

    const ctx = tempCanvas.getContext("2d", {
      alpha: true,
      willReadFrequently: true,
    });

    if (!ctx) {
      console.error("Failed to get 2D context");
      return;
    }

    // Enable better image quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Clear canvas with white background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Apply high-resolution scaling
    ctx.scale(scale, scale);

    // Create and load base image
    const baseImage = new window.Image();
    baseImage.crossOrigin = "anonymous";
    baseImage.src = canvas.toDataURL("image/png", 1.0);

    await new Promise((resolve) => {
      baseImage.onload = () => {
        // Draw base image
        ctx.drawImage(baseImage, 0, 0);

        // Set text rendering for better quality
        ctx.textRendering = "optimizeLegibility";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";

        // Re-apply all text with enhanced styling
        ctx.font = `500 ${16 * scale}px "ArialCustom", Arial, sans-serif`;
        ctx.lineWidth = 0.5 * scale;
        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";

        // Re-draw all text elements with enhanced positioning
        ctx.strokeText(certificate.name, 400 * scale, 200 * scale);
        ctx.fillText(certificate.name, 400 * scale, 200 * scale);

        ctx.font = `500 ${22 * scale}px "ArialCustom", Arial, sans-serif`;
        ctx.strokeStyle = "#4b0406";
        ctx.fillStyle = "#4b0406";

        // Program name (centered)
        ctx.strokeText(
          certificate.program,
          (canvas.width * scale) / 2,
          265 * scale
        );
        ctx.fillText(
          certificate.program,
          (canvas.width * scale) / 2,
          265 * scale
        );

        ctx.font = `500 ${16 * scale}px "ArialCustom", Arial, sans-serif`;

        // Department and org (centered)
        ctx.strokeText(
          certificate.department,
          (canvas.width * scale) / 2,
          320 * scale
        );
        ctx.fillText(
          certificate.department,
          (canvas.width * scale) / 2,
          320 * scale
        );
        ctx.strokeText(
          certificate.org,
          (canvas.width * scale) / 2,
          370 * scale
        );
        ctx.fillText(certificate.org, (canvas.width * scale) / 2, 370 * scale);

        // Reset text alignment for non-centered text
        ctx.textAlign = "left";

        // Dates with enhanced positioning
        const formattedStartDate = formatDate(certificate.startDate);
        const formattedIssueDate = formatDate(certificate.issueDate);
        ctx.strokeText(formattedStartDate, 325 * scale, 395 * scale);
        ctx.fillText(formattedStartDate, 325 * scale, 395 * scale);
        ctx.strokeText(formattedIssueDate, 495 * scale, 395 * scale);
        ctx.fillText(formattedIssueDate, 495 * scale, 395 * scale);

        // Certificate ID with enhanced clarity
        ctx.font = `500 ${11 * scale}px "ArialCustom", Arial, sans-serif`;
        ctx.strokeText(certificate.certificateId, 723 * scale, 315 * scale);
        ctx.fillText(certificate.certificateId, 723 * scale, 315 * scale);

        resolve(true);
      };
    });

    // Generate high-quality QR code
    if (qrCanvasRef.current) {
      const highResQRCanvas = document.createElement("canvas");
      highResQRCanvas.width = 200 * scale;
      highResQRCanvas.height = 200 * scale;

      await new Promise((resolve) => {
        QRCode.toCanvas(
          highResQRCanvas,
          `https://e-verify.technotran.in/certificate/${id}`,
          {
            width: 200 * scale,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
            errorCorrectionLevel: "H",
          },
          (error) => {
            if (!error) {
              const qrX = (canvas.width - 133) * scale;
              const qrY = (canvas.height - 140) * scale;
              const qrSize = 80 * scale;

              // Add white background with padding
              ctx.fillStyle = "#FFFFFF";
              ctx.fillRect(
                qrX - 5 * scale,
                qrY - 5 * scale,
                qrSize + 10 * scale,
                qrSize + 10 * scale
              );

              // Add subtle border
              ctx.strokeStyle = "#4b0406";
              ctx.lineWidth = 1 * scale;
              ctx.strokeRect(
                qrX - 5 * scale,
                qrY - 5 * scale,
                qrSize + 10 * scale,
                qrSize + 10 * scale
              );

              // Draw high-resolution QR code
              ctx.drawImage(highResQRCanvas, qrX, qrY, qrSize, qrSize);
              resolve(true);
            }
          }
        );
      });
    }

    // Create PDF after everything is drawn
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
      putOnlyUsedFonts: true,
      compress: true,
    });

    // Remove metadata
    pdf.setProperties({
      title: "",
      subject: "",
      author: "",
      keywords: "",
      creator: "",
    });

    // Convert to high-quality image
    const imgData = tempCanvas.toDataURL("image/png", 1.0);

    // Add image to PDF with maximum quality
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height, "", "FAST");

    // Save with optimized settings
    pdf.save(`${certificate.name}.pdf`);
  };

  if (loading)
    return <p className={styles.loading}>Loading certificate details...</p>;

  if (error?.includes("No Certificate details found")) {
    return (
      <div className={styles.noCertFoundContainer}>
        <Image
          src={"/Images/warn-stock-img.png"}
          alt="No Certificate Found"
          height={300}
          width={400}
          priority
          className={styles.noCertFoundImg}
        />
        <h2 className={styles.noCertFoundHeading}>No Certificate found!</h2>
        <h2 className={styles.noCertFoundHeading}>
          Please contact Technotran Solutions Support for further Details.
        </h2>
      </div>
    );
  } else if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <main id="E-Verify Portal Certificate">
      <section className={styles.mainBody}>
        <div className={styles.container}>
          <h1 className={styles.title}>Certificate Details</h1>
          <canvas
            ref={canvasRef}
            width={850}
            height={550}
            className={styles.certificateCanvas}
          ></canvas>
          <canvas
            ref={qrCanvasRef}
            width={100}
            height={100}
            style={{
              display: "none",
              fontFamily: `"ArialCustom", Arial, sans-serif`,
            }}
          ></canvas>
          <button
            className={styles.downloadButton}
            onClick={downloadCertificatePDF}
          >
            Download Certificate
          </button>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default CertificateDetails;
