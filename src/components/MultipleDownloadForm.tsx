import React, { useState, useRef } from "react";
import styles from "../styles/DownloadForms.module.css";
import * as XLSX from "xlsx";
import { Certificate } from "@/utils/types";
import { vendorsData } from "@/utils/helper";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

interface MultipleDownloadFormProps {
  setMessage: (message: string) => void;
}

const MultipleDownloadForm: React.FC<MultipleDownloadFormProps> = ({
  setMessage,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalCertificates, setTotalCertificates] = useState(0);
  const [processedCertificates, setProcessedCertificates] = useState(0);
  const [failedIds, setFailedIds] = useState<string[]>([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dropzone configuration
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setMessage("");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
    disabled: loading,
  });

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

  // Function to render certificate text
  const renderCertificateText = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    certificate: Certificate
  ) => {
    // Text Styles
    ctx.font = `500 16px "ArialCustom", Arial, sans-serif`;
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";

    // Display Student Details
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
    const departmentTextWidth = ctx.measureText(certificate.department).width;
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

    // Format Dates (dd/mm/yy)
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

    // Generate QR Code
    QRCode.toCanvas(
      qrCanvasRef.current,
      `https://e-verify.technotran.in/certificate/${certificate.certificateId}`,
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
  };

  const generateCertificatePDF = async (
    certificate: Certificate
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!canvasRef.current) {
        reject(new Error("Canvas not available"));
        return;
      }

      const canvas = canvasRef.current;

      // Create a high-resolution temporary canvas
      const scale = 8; // Increased scale for even better resolution
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width * scale;
      tempCanvas.height = canvas.height * scale;
      const ctx = tempCanvas.getContext("2d", {
        alpha: true,
        willReadFrequently: true,
      });

      if (!ctx) {
        reject(new Error("Failed to get 2D context"));
        return;
      }

      // Clear and prepare the high-res canvas
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // First, draw the background image at high resolution
      const img = new window.Image();
      img.crossOrigin = "anonymous";

      // Get the current background image source
      let imgSrc =
        "https://res.cloudinary.com/doxrqtfxo/image/upload/v1741560885/E%20Verify%20Portal%20Assets/pbruozkwvgw6f8s9ltpc.png";
      if (certificate.type === "Workshop") {
        imgSrc =
          "https://res.cloudinary.com/dcooiidus/image/upload/v1740660460/default_blank_workshop_cert_sgu2ad.jpg";
      }
      if (certificate.certificateImgSrc !== "") {
        imgSrc = certificate.certificateImgSrc ?? imgSrc;
      }

      img.onload = async () => {
        ctx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);

        // Draw vendor logo if available
        const vendor = vendorsData.find((v) => v.name === certificate.org);
        if (vendor) {
          const vendorLogo = new window.Image();
          vendorLogo.crossOrigin = "anonymous";
          await new Promise((resolve) => {
            vendorLogo.onload = () => {
              ctx.drawImage(
                vendorLogo,
                110 * scale,
                60 * scale,
                70 * scale,
                70 * scale
              );
              resolve(true);
            };
            vendorLogo.src = vendor.imgSrc;
          });
        }

        // Scale context for text rendering
        ctx.scale(scale, scale);

        // Optimize text rendering
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.textRendering = "geometricPrecision";
        ctx.letterSpacing = "1px";

        // Re-render all text with enhanced quality
        // Student Name
        ctx.font = `600 16px "ArialCustom", Arial, sans-serif`;
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";
        ctx.strokeText(certificate.name, canvas.width / 2 + 7, 195);
        ctx.fillText(certificate.name, canvas.width / 2 + 7, 195);

        // Program
        ctx.font = `600 22px "ArialCustom", Arial, sans-serif`;
        ctx.strokeStyle = "#4b0406";
        ctx.fillStyle = "#4b0406";
        ctx.strokeText(certificate.program, canvas.width / 2, 260);
        ctx.fillText(certificate.program, canvas.width / 2, 260);

        // Department and Organization
        ctx.font = `600 16px "ArialCustom", Arial, sans-serif`;
        ctx.strokeText(certificate.department, canvas.width / 2, 315);
        ctx.fillText(certificate.department, canvas.width / 2, 315);
        ctx.strokeText(certificate.org, canvas.width / 2, 365);
        ctx.fillText(certificate.org, canvas.width / 2, 365);

        // Dates
        ctx.font = `600 16px "ArialCustom", Arial, sans-serif`;
        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";
        const formattedStartDate = formatDate(certificate.startDate);
        const formattedIssueDate = formatDate(certificate.issueDate);
        ctx.strokeText(formattedStartDate, 355, 390);
        ctx.fillText(formattedStartDate, 355, 390);
        ctx.strokeText(formattedIssueDate, 525, 390);
        ctx.fillText(formattedIssueDate, 525, 390);

        // Certificate ID
        ctx.font = `600 11px "ArialCustom", Arial, sans-serif`;
        ctx.strokeStyle = "#4b0406";
        ctx.fillStyle = "#4b0406";
        ctx.strokeText(certificate.certificateId, 755, 315);
        ctx.fillText(certificate.certificateId, 755, 315);

        // Generate high-quality QR code
        const highResQRCanvas = document.createElement("canvas");
        highResQRCanvas.width = 200 * scale;
        highResQRCanvas.height = 200 * scale;

        await new Promise((resolve) => {
          QRCode.toCanvas(
            highResQRCanvas,
            `https://e-verify.technotran.in/certificate/${certificate.certificateId}`,
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

                // Draw high-resolution QR code
                ctx.drawImage(highResQRCanvas, qrX, qrY, qrSize, qrSize);
                resolve(true);
              }
            }
          );
        });

        // Convert to high-quality PNG
        const imgData = tempCanvas.toDataURL("image/png", 1.0);

        // Create PDF with maximum quality settings
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "px",
          format: [canvas.width, canvas.height],
          compress: true,
          putOnlyUsedFonts: true,
          precision: 32,
          hotfixes: ["px_scaling"],
        });

        // Remove metadata and optimize
        pdf.setProperties({
          title: "",
          subject: "",
          author: "",
          keywords: "",
          creator: "",
        });

        // Add image with maximum quality
        pdf.addImage(
          imgData,
          "PNG",
          0,
          0,
          canvas.width,
          canvas.height,
          "",
          "FAST"
        );

        // Get PDF as blob with optimized settings
        const pdfBlob = pdf.output("blob");
        resolve(pdfBlob);
      };

      img.onerror = () => {
        reject(new Error("Failed to load certificate template"));
      };

      img.src = imgSrc;
    });
  };

  const exportFailedIdsToExcel = () => {
    if (failedIds.length === 0) return;

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Create a worksheet with the failed IDs
    const ws = XLSX.utils.aoa_to_sheet([
      ["Failed Certificate IDs"],
      ...failedIds.map((id) => [id]),
    ]);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Failed IDs");

    // Generate Excel file and trigger download
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "failed_certificate_ids.xlsx");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please upload an Excel file with certificate IDs");
      return;
    }

    setLoading(true);
    setProgress(0);
    setProcessedCertificates(0);
    setFailedIds([]);

    try {
      // Read the Excel file
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });

          // Get the first worksheet
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];

          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Extract certificate IDs (assuming they're in the first column)
          const certificateIds = jsonData
            .map((value: unknown) => {
              if (Array.isArray(value)) {
                return value[0];
              }
              return value;
            })
            .filter(
              (id: unknown): id is string | number =>
                id !== null &&
                id !== undefined &&
                (typeof id === "string" || typeof id === "number")
            )
            .slice(0, 50); // Take only the first 50 IDs

          if (certificateIds.length === 0) {
            throw new Error("No valid certificate IDs found in the Excel file");
          }

          setTotalCertificates(certificateIds.length);
          setMessage(`Processing ${certificateIds.length} certificates...`);

          // Create a zip file to store all PDFs
          const zip = new JSZip();
          const failedCertIds: string[] = [];

          // Process each certificate ID
          for (let i = 0; i < certificateIds.length; i++) {
            const certId = String(certificateIds[i]);
            setProcessedCertificates(i + 1);
            setProgress(Math.round(((i + 1) / certificateIds.length) * 100));

            try {
              // Fetch certificate data
              const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
              const response = await fetch(
                `${API_BASE_URL}/certificates/id/${certId}`
              );

              if (!response.ok) {
                failedCertIds.push(certId);
                continue;
              }

              // Get certificate data
              const certificateData: Certificate = await response.json();

              // Generate PDF for this certificate
              const pdfBlob = await generateCertificatePDF(certificateData);

              // Add PDF to zip file
              zip.file(`${certificateData.name}_${certId}.pdf`, pdfBlob);
            } catch (error) {
              console.error(`Error processing certificate ${certId}:`, error);
              failedCertIds.push(certId);
            }
          }

          // Save failed IDs
          setFailedIds(failedCertIds);

          // Generate and download the zip file
          const zipBlob = await zip.generateAsync({ type: "blob" });
          saveAs(zipBlob, "certificates.zip");

          // Show success message
          const successCount = certificateIds.length - failedCertIds.length;

          if (failedCertIds.length > 0) {
            setSnackbarMessage(
              `Downloaded ${successCount} certificates. ${failedCertIds.length} failed.`
            );
            setSnackbarSeverity("error");
            setShowSnackbar(true);

            // Export failed IDs to Excel
            exportFailedIdsToExcel();
          } else {
            setSnackbarMessage(
              `Successfully downloaded all ${successCount} certificates!`
            );
            setSnackbarSeverity("success");
            setShowSnackbar(true);
          }

          // Reset form
          setFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          setMessage("");
        } catch (error) {
          console.error("Excel processing error:", error);
          setMessage(
            error instanceof Error
              ? error.message
              : "Failed to process Excel file"
          );
        } finally {
          setLoading(false);
        }
      };

      reader.onerror = () => {
        setMessage("Error reading the file");
        setLoading(false);
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Download error:", error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to download certificates"
      );
      setLoading(false);
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="excelFile" className={styles.label}>
          Upload Excel File with Certificate IDs
        </label>

        <div
          {...getRootProps()}
          className={`${styles.dropZone} ${
            isDragActive ? styles.active : styles.inactive
          }`}
        >
          <input {...getInputProps()} disabled={loading} />
          <Image
            className={styles.uploadFileImg}
            src={"/Images/fileUploadImg.png"}
            height={150}
            width={150}
            alt="File Upload Icon"
            priority
          />
          {isDragActive ? (
            <p>Drop your file here...</p>
          ) : (
            <p>Drag and drop your Excel file here, or click to select a file</p>
          )}
          {file && <p className={styles.fileName}>Selected: {file.name}</p>}
        </div>

        <p className={styles.helperText}>
          The Excel file should contain certificate IDs in the first column.
          Only the first 50 IDs will be processed.
        </p>
      </div>

      {loading && (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className={styles.progressText}>
            Processing {processedCertificates} of {totalCertificates}{" "}
            certificates ({progress}%)
          </p>
        </div>
      )}

      <button
        type="submit"
        className={styles.submitButton}
        disabled={loading || !file}
      >
        {loading ? "Processing..." : "Download Certificates"}
      </button>

      {/* Hidden canvases for certificate generation */}
      <div style={{ display: "none" }}>
        <canvas ref={canvasRef} width={850} height={550}></canvas>
        <canvas ref={qrCanvasRef} width={100} height={100}></canvas>
      </div>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default MultipleDownloadForm;
