"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import QRCode from "qrcode";
import styles from "./page.module.css";
import { Certificate } from "@/utils/types";
import { vendorsData } from "@/utils/helper";
import Footer from "@/sections/Footer";
import Image from "next/image";

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
          `${process.env.NEXT_PUBLIC_API_URL}/certificates//id/${id}`
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
            "https://github.com/CVSCharan/Technotran_Assets/blob/main/Blank_Workshop_Certificate.jpeg?raw=true"; // Use Workshop Template
        }

        const img = new window.Image();
        img.src = imgSrc;

        img.onload = async () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          await document.fonts.ready;

          // **Embed Vendor Logo**
          const vendor = vendorsData.find((v) => v.name === certificate.org);
          if (vendor) {
            const vendorLogo = new window.Image();
            vendorLogo.src = vendor.imgSrc;
            vendorLogo.onload = () => {
              ctx.drawImage(vendorLogo, 90, 40, 50, 50); // Adjust position & size
            };
          }

          // **Text Styles**
          ctx.font = `16px Arial`;
          ctx.fillStyle = "black";

          // **Display Student Details**
          ctx.fillText(certificate.name, 400, 190);

          ctx.font = `22px Arial`;
          ctx.fillStyle = "#4b0406";

          // Calculate dynamic X position
          const programTextWidth = ctx.measureText(certificate.program).width;
          const centerXPrgm = (canvas.width - programTextWidth) / 2;

          // Draw centered text
          ctx.fillText(certificate.program, centerXPrgm, 245);

          ctx.font = `16px Arial`;
          ctx.fillStyle = "#4b0406";

          // Calculate dynamic X position
          const departmentTextWidth = ctx.measureText(
            certificate.department
          ).width;
          const centerXDept = (canvas.width - departmentTextWidth) / 2;

          const orgTextWidth = ctx.measureText(certificate.org).width;
          const centerXOrg = (canvas.width - orgTextWidth) / 2;

          ctx.fillText(certificate.department, centerXDept, 263);
          ctx.fillText(certificate.org, centerXOrg, 335);

          ctx.font = `16px Arial`;
          ctx.fillStyle = "black";

          // **Format Dates (dd/mm/yy)**
          const formattedStartDate = formatDate(certificate.startDate);
          const formattedIssueDate = formatDate(certificate.issueDate);

          ctx.fillText(formattedStartDate, 325, 360);
          ctx.fillText(formattedIssueDate, 495, 360);

          ctx.font = `11px Arial`;
          ctx.fillStyle = "#4b0406";

          ctx.fillText(certificate.certificateId, 160, 435);

          // **Generate QR Code**
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
                  canvas.width - 133,
                  canvas.height - 125,
                  90,
                  90
                ); // Adjust QR position
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
            style={{ display: "none" }}
          ></canvas>
          <button className={styles.downloadButton} onClick={downloadImage}>
            Download Certificate with Details
          </button>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default CertificateDetails;
