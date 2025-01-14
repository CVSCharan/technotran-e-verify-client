"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "../styles/CreateCertificate.module.css";
import Image from "next/image";
import { MultipleEntryFormProps } from "@/utils/types";

const MultipleEntryForm: React.FC<MultipleEntryFormProps> = ({ onMessage }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

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
  });

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      onMessage("Please upload an Excel file.");
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${apiUrl}/certificates/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        onMessage(`Error: ${result.error || "Failed to upload file!"}`);
        return;
      }

      onMessage("File uploaded successfully!");
      setFile(null); // Clear file input after upload
      setFileName(null);
    } catch (error) {
      console.log(error);
      onMessage("Failed to upload file!");
    }
  };

  return (
    <form onSubmit={handleFileUpload} className={styles.uploadFileContainer}>
      <div
        {...getRootProps()}
        className={`${styles.dropZone} ${
          isDragActive ? styles.active : styles.inactive
        }`}
      >
        <input {...getInputProps()} />
        <Image
          className={styles.uploadFileImg}
          src={"/Images/fileUploadImg.png"}
          height={150}
          width={150}
          alt="File Upload Img"
        />
        {isDragActive ? (
          <p>Drop your file here...</p>
        ) : (
          <p>Drag and drop your file here, or click to select a file</p>
        )}
        {fileName && <p className={styles.fileName}>Selected: {fileName}</p>}
      </div>
      <button className={styles.formButton} type="submit" disabled={!file}>
        Upload Excel
      </button>
    </form>
  );
};

export default MultipleEntryForm;
