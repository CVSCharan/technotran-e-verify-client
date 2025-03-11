"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { Certificate } from "@/utils/types";
import AdminNav from "@/sections/AdminNav";
import Footer from "@/sections/Footer";
import EditCertificateModal from "@/components/EditCertificateModal";
import DeleteCertificateModal from "@/components/DeleteCertificateModal";
import CertificatesTable from "@/components/CertificatesTable";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import Snackbar from "@mui/material/Snackbar";
import { AlertColor } from "@mui/material/Alert";
import Alert from "@mui/material/Alert";
import { useAdmin } from "@/context/AdminContext";
import LoginModal from "@/components/AuthModal";
import Head from "next/head";

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  // Pagination states
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("All");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");

  const { adminUser, showModal } = useAdmin(); // Get adminUser and showModal from context

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/certificates`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch certificates");
        }
        const data: Certificate[] = await response.json();
        setCertificates(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const handleEditClick = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setDeleteModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedCertificate(null);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setSelectedCertificate(null);
  };

  const showSnackbar = (message: string, severity: AlertColor) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const API_BASE_URL = `${[process.env.NEXT_PUBLIC_API_URL]}/certificates`; // Replace with actual backend URL

  const handleSaveChanges = async (updatedCertificate: Certificate) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${updatedCertificate._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCertificate),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update certificate");
      }

      const data = await response.json();

      setCertificates((prevCertificates) =>
        prevCertificates.map((cert) =>
          cert._id === updatedCertificate._id ? data : cert
        )
      );

      showSnackbar("Certificate updated successfully!", "success");
      console.log("Updated certificate:", data);
    } catch (error) {
      showSnackbar("Failed to update certificate!", "warning");
      showSnackbar("Failed to update certificate!", "warning");
      console.error("Error updating certificate:", error);
    }
  };

  const handleDeleteConfirmation = async () => {
    if (!selectedCertificate) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/${selectedCertificate._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete certificate");
      }

      setCertificates((prevCertificates) =>
        prevCertificates.filter(
          (certificate) => certificate._id !== selectedCertificate._id
        )
      );

      showSnackbar("Certificate deleted successfully!", "success");
      setDeleteModalOpen(false);
      console.log("Deleted certificate:", selectedCertificate);
    } catch (error) {
      showSnackbar("Failed to delete certificate!", "warning");
      console.error("Error deleting certificate:", error);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
    setPage(0); // Reset to the first page on filter change
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Get unique certificate types for dropdown
  const certificateTypes = [
    "All",
    ...new Set(certificates.map((cert) => cert.type)),
  ];

  // Filter certificates based on search query and selected type
  const filteredCertificates = certificates.filter(
    (certificate) =>
      certificate.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedType === "All" || certificate.type === selectedType)
  );

  // Set page title dynamically
  useEffect(() => {
    document.title = "Certificate Management | E-Verify Portal Admin";
  }, []);

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading Certificates | E-Verify Portal</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <main id="E-Verify Portal View Certificates">
          <AdminNav />
          <section className={styles.mainBody}>
            <div className={styles.landingSection}>
              <span className={styles.loader}></span>
            </div>
          </section>
          <Footer />
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Error | E-Verify Portal</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <main id="E-Verify Portal View Certificates">
          <AdminNav />
          <section className={styles.mainBody}>
            <div className={styles.landingSection}>
              <p className={styles.error}>Server Error: {error}</p>
            </div>
          </section>
          <Footer />
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Certificate Management | E-Verify Portal | Technotran Solutions</title>
        <meta name="description" content="Administrative dashboard to manage certificates in the E-Verify Portal system. View, edit, and delete certificates for verification." />
        <meta name="keywords" content="certificate management, e-verify portal, document verification, certificate administration, technotran solutions" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://e-verify-portal.com/view-certificates" />
      </Head>
      
      <main id="E-Verify Portal View Certificates">
        {/* Show the LoginModal if user is not authenticated */}
        {!adminUser && showModal && <LoginModal authParams="Admin" />}

        <AdminNav />
        <section className={styles.mainBody}>
          <div className={styles.landingSection}>
            <h2 className={styles.heading}>E-Verify Portal Certificates</h2>
            <div className={styles.searchBarContainer}>
              <input
                type="text"
                placeholder="Search by Name"
                value={searchQuery}
                onChange={handleSearchChange}
                className={styles.searchBar}
              />
              {searchQuery && (
                <CancelOutlinedIcon
                  onClick={handleClearSearch}
                  className={styles.clearButton}
                  aria-label="clear search"
                />
              )}
            </div>
            <div className={styles.dropdownContainer}>
              <select
                value={selectedType}
                onChange={handleTypeChange}
                className={styles.dropdown}
              >
                {certificateTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <>
              {filteredCertificates.length === 0 ? (
                <p className={styles.noCertificates}>No certificates found.</p>
              ) : (
                <CertificatesTable
                  certificates={filteredCertificates}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  onEditClick={handleEditClick}
                  onDeleteClick={handleDeleteClick}
                />
              )}
            </>
          </div>
        </section>

        <EditCertificateModal
          open={editModalOpen}
          onClose={handleEditModalClose}
          certificate={selectedCertificate}
          onSave={handleSaveChanges}
        />

        <DeleteCertificateModal
          open={deleteModalOpen}
          onClose={handleDeleteModalClose}
          certificate={selectedCertificate}
          onDelete={handleDeleteConfirmation}
        />

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            severity={snackbarSeverity}
            onClose={() => setSnackbarOpen(false)}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <Footer />
      </main>
    </>
  );
};

export default CertificatesPage;
