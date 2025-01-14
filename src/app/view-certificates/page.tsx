"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { Certificate } from "@/utils/types";
import AdminNav from "@/sections/AdminNav";
import Footer from "@/sections/Footer";
import EditCertificateModal from "@/components/EditCertificateModal";
import CertificatesTable from "@/components/CertificatesTable";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Pagination states
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("All");

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
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedCertificate(null);
  };

  const handleSaveChanges = (updatedCertificate: Certificate) => {
    setCertificates((prevCertificates) =>
      prevCertificates.map((cert) =>
        cert._id === updatedCertificate._id ? updatedCertificate : cert
      )
    );
    console.log("Updated certificate:", updatedCertificate);
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

  if (loading) {
    return <p className={styles.loading}>Loading certificates...</p>;
  }

  if (error) {
    return <p className={styles.error}>Error: {error}</p>;
  }

  return (
    <main id="E-Verify Portal View Certificates">
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
              />
            )}
          </>
        </div>
      </section>

      <EditCertificateModal
        open={modalOpen}
        onClose={handleModalClose}
        certificate={selectedCertificate}
        onSave={handleSaveChanges}
      />

      <Footer />
    </main>
  );
};

export default CertificatesPage;
