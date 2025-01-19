"use client";

import AdminNav from "@/sections/AdminNav";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Footer from "@/sections/Footer";
import { Vendors } from "@/utils/types";
import VendorsTable from "@/components/VendorsTable";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import Snackbar from "@mui/material/Snackbar";
import { AlertColor } from "@mui/material/Alert";
import Alert from "@mui/material/Alert";
import { useAdmin } from "@/context/AdminContext";
import LoginModal from "@/components/AdminAuthModal";

const VendorsPage = () => {
  const [vendors, setVendors] = useState<Vendors[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendors | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Pagination states
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const { adminUser, showModal } = useAdmin(); // Get adminUser and showModal from context

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/vendors`);
        if (!response.ok) {
          throw new Error("Failed to fetch vendors");
        }
        const data: Vendors[] = await response.json();
        setVendors(data);
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

    fetchVendors();
  }, []);

  if (loading) {
    return (
      <main id="E-Verify Vendor Page">
        <AdminNav />
        <section className={styles.mainBody}>
          <div className={styles.landingSection}>
            <span className={styles.loader}></span>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  if (error) {
    return (
      <main id="E-Verify Vendor Page">
        <AdminNav />
        <section className={styles.mainBody}>
          <div className={styles.landingSection}>
            <p className={styles.error}>Server Error: {error}</p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
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

  const handleEditClick = (vendor: Vendors) => {
    setSelectedVendor(vendor);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (vendor: Vendors) => {
    setSelectedVendor(vendor);
    setDeleteModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedVendor(null);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setSelectedVendor(null);
  };

  return (
    <main id="E-Verify Vendor Page">
      {/* Show the LoginModal if user is not authenticated */}
      {!adminUser && showModal && <LoginModal />}

      <AdminNav />
      <section className={styles.mainBody}>
        <div className={styles.landingSection}>
          <h2 className={styles.heading}>E-Verify Portal Vendors</h2>
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
          <>
            {vendors.length === 0 ? (
              <p className={styles.noCertificates}>No certificates found.</p>
            ) : (
              <VendorsTable
                vendors={vendors}
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
      <Footer />
    </main>
  );
};

export default VendorsPage;
