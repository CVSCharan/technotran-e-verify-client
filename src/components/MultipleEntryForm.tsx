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

  const createFailedItemsReport = (
    failedItems: any[],
    reason: string = "Failed to upload"
  ) => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Add headers and format the failed items
    const formattedItems = failedItems.map((item) => ({
      "Certificate ID":
        typeof item === "string" ? item : item.certificateId || item,
      Reason: reason,
    }));

    // Convert failed items to worksheet
    const ws = XLSX.utils.json_to_sheet(formattedItems);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Failed Items");

    // Generate Excel file and trigger download
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(
      blob,
      `failed_uploads_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      onMessage("Please upload an Excel file.");
      return;
    }

    setLoading(true);
    onMessage("Uploading certificates...");

    try {
      // Create FormData and append the file
      const formData = new FormData();
      formData.append("file", file);

      // Upload the file
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      console.log("Uploading to:", `${apiUrl}/certificates/upload`);

      const response = await fetch(`${apiUrl}/certificates/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle duplicate certificate IDs error
        if (result.error?.includes("Duplicate certificate IDs")) {
          // Extract certificate IDs from the Excel file
          const reader = new FileReader();
          reader.onload = async (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            // Get all certificate IDs
            const certificateIds = jsonData
              .map((row: any) => row["Certificate ID"]?.toString().trim())
              .filter(Boolean);

            // Create report for all IDs as they're duplicates
            createFailedItemsReport(certificateIds, "Duplicate Certificate ID");
          };
          reader.readAsArrayBuffer(file);
          throw new Error(
            "Duplicate certificate IDs found. Check the downloaded report for details."
          );
        }
        throw new Error(result.error || "Failed to upload certificates");
      }

      // Handle successful upload
      setSnackbarMessage(
        `Successfully uploaded ${result.uploadedCertificates.length} certificates!`
      );
      setSnackbarSeverity("success");
    } catch (error: unknown) {
      console.error("Upload error:", error);

      // Type guard for error with response property
      interface UploadError {
        response?: {
          data?: {
            failedItems?: any[];
          };
        };
      }

      // If the error contains failed items data, create a report
      const uploadError = error as UploadError;
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        uploadError.response?.data?.failedItems &&
        uploadError.response.data.failedItems.length > 0
      ) {
        createFailedItemsReport(uploadError.response.data.failedItems);
        setSnackbarMessage(
          "Some certificates failed to upload. Check the downloaded report for details."
        );
      } else {
        setSnackbarMessage(
          error instanceof Error
            ? error.message
            : "Failed to upload certificates. Please check the server connection."
        );
      }

      setSnackbarSeverity("error");
    } finally {
      setLoading(false);
      setShowSnackbar(true);
      setFile(null);
      setFileName(null);
      onMessage("");
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

        <button
          className={styles.formButton}
          type="submit"
          disabled={!file || loading}
          aria-label="Upload Certificates"
        >
          {loading ? "Uploading..." : "Upload Certificates"}
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
