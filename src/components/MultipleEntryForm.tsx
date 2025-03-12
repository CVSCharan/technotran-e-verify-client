"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "../styles/CreateCertificate.module.css";
import Image from "next/image";
import { MultipleEntryFormProps } from "@/utils/types";
import Head from "next/head";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const MultipleEntryForm: React.FC<MultipleEntryFormProps> = ({ onMessage }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [progress, setProgress] = useState(0);
  const [totalCertificates, setTotalCertificates] = useState(0);
  const [processedCertificates, setProcessedCertificates] = useState(0);

  // SEO structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Certificate Bulk Upload Tool",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    description:
      "Upload multiple certificates at once using Excel spreadsheet format",
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
      onMessage("");
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

  // Function to export failed certificate IDs to CSV
  const exportFailedIdsToCSV = (failedIds: string[]) => {
    console.log("Attempting to export failed IDs:", failedIds);
    if (!failedIds || failedIds.length === 0) {
      console.log("No failed IDs to export");
      return;
    }

    try {
      // Create CSV content
      const csvContent = [
        ["Failed Certificate IDs", "Reason"],
        ...failedIds.map((id) => [id, "Failed to download"]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      saveAs(
        blob,
        `failed_downloads_${new Date().toISOString().split("T")[0]}.csv`
      );
      console.log("CSV file created and download initiated");
    } catch (error) {
      console.error("Error creating CSV file:", error);
      setSnackbarMessage("Error creating CSV file for failed IDs");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      onMessage("Please upload an Excel file.");
      return;
    }

    setLoading(true);
    setProgress(0);
    setProcessedCertificates(0);
    onMessage("Processing certificates...");

    try {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];

          // Define types for Excel data
          interface ExcelRow {
            "Certificate ID"?: string | number;
            [key: string]: string | number | undefined;
          }

          const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelRow[];

          // Extract and validate certificate IDs
          const certificateIds = jsonData
            .slice(0, 50) // Limit to first 50 rows
            .map((row: ExcelRow) => {
              const id = row["Certificate ID"]?.toString().trim();
              // Skip if it's a header-like value
              if (
                !id ||
                id.toLowerCase() === "certificate id" ||
                id.toLowerCase() === "certificateid" ||
                id.toLowerCase() === "certificate_id" ||
                id.toLowerCase().includes("certificate") ||
                id.toLowerCase().includes("id")
              ) {
                return null;
              }
              return id;
            })
            .filter((id): id is string => Boolean(id)); // Remove null/undefined values

          if (certificateIds.length === 0) {
            throw new Error("No valid certificate IDs found in the Excel file");
          }

          setTotalCertificates(certificateIds.length);
          const failedDownloads: string[] = [];
          let successCount = 0;

          // Process each certificate
          for (let i = 0; i < certificateIds.length; i++) {
            const certId = certificateIds[i];
            setProcessedCertificates(i + 1);
            setProgress(Math.round(((i + 1) / certificateIds.length) * 100));

            try {
              const apiUrl = process.env.NEXT_PUBLIC_API_URL;
              // First check if certificate exists
              const response = await fetch(
                `${apiUrl}/certificates/id/${certId}`
              );

              if (!response.ok) {
                console.log(`Certificate not found: ${certId}`);
                failedDownloads.push(certId);
                continue;
              }

              // Get certificate data
              const certificate = await response.json();

              // Try to download the certificate
              const downloadResponse = await fetch(
                `${apiUrl}/certificates/download/${certId}`
              );

              if (!downloadResponse.ok) {
                console.log(`Failed to download certificate: ${certId}`);
                failedDownloads.push(certId);
                continue;
              }

              // Download the certificate
              const pdfBlob = await downloadResponse.blob();
              saveAs(pdfBlob, `${certificate.name}_${certId}.pdf`);
              successCount++;
            } catch (error) {
              console.error(`Error processing certificate ${certId}:`, error);
              failedDownloads.push(certId);
            }
          }

          // Show final status and export failed IDs if any
          if (failedDownloads.length > 0) {
            setSnackbarMessage(
              `Downloaded ${successCount} certificates. ${failedDownloads.length} failed. Check the downloaded CSV file for failed IDs.`
            );
            setSnackbarSeverity("error");
            exportFailedIdsToCSV(failedDownloads);
          } else {
            setSnackbarMessage(
              `Successfully downloaded all ${successCount} certificates!`
            );
            setSnackbarSeverity("success");
          }
          setShowSnackbar(true);

          // Reset form
          setFile(null);
          setFileName(null);
          onMessage("");
        } catch (error) {
          console.error("Excel processing error:", error);
          onMessage(
            error instanceof Error
              ? error.message
              : "Failed to process Excel file"
          );
          setSnackbarMessage("Failed to process Excel file");
          setSnackbarSeverity("error");
          setShowSnackbar(true);
        } finally {
          setLoading(false);
        }
      };

      reader.onerror = () => {
        onMessage("Error reading the file");
        setLoading(false);
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Upload error:", error);
      onMessage("Failed to process file!");
      setSnackbarMessage("Failed to process file!");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
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
      <form
        onSubmit={handleFileUpload}
        className={styles.uploadFileContainer}
        aria-label="Bulk certificate upload form"
      >
        <div
          {...getRootProps()}
          className={`${styles.dropZone} ${
            isDragActive ? styles.active : styles.inactive
          }`}
          role="button"
          aria-label="File upload dropzone"
        >
          <input {...getInputProps()} aria-label="File input" />
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
          {fileName && <p className={styles.fileName}>Selected: {fileName}</p>}
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
          className={styles.formButton}
          type="submit"
          disabled={!file || loading}
          aria-label="Download Certificates"
        >
          {loading ? "Processing..." : "Download Certificates"}
        </button>

        {/* Snackbar for success/error messages */}
        <Snackbar
          open={showSnackbar}
          autoHideDuration={6000}
          onClose={() => setShowSnackbar(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setShowSnackbar(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </form>
    </>
  );
};

export default MultipleEntryForm;
