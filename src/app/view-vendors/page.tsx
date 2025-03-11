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
import LoginModal from "@/components/AuthModal";
import EditVendorModal from "@/components/EditVendorModal";
import DeleteVendorModal from "@/components/DeleteVendorModal";
import Head from "next/head";

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

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");

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

  const showSnackbar = (message: string, severity: AlertColor) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Filter vendors based on search query
  const filteredVendors = vendors.filter((vendor) =>
    vendor?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Set page title dynamically
  useEffect(() => {
    document.title = "Vendor Management | E-Verify Portal Admin";
  }, []);

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading Vendors | E-Verify Portal</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <main id="E-Verify Vendor Page">
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
        <main id="E-Verify Vendor Page">
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

  const API_BASE_URL = `${[process.env.NEXT_PUBLIC_API_URL]}/vendors`; // Replace with actual backend URL

  const handleSaveChanges = async (updatedVendor: Vendors) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${updatedVendor._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedVendor),
      });

      if (!response.ok) {
        throw new Error("Failed to update certificate");
      }

      const data = await response.json();

      setVendors((prevVendors) =>
        prevVendors.map((vend) =>
          vend._id === updatedVendor._id ? data : vend
        )
      );

      showSnackbar("Vendor updated successfully!", "success");
      console.log("Updated vendor:", data);
    } catch (error) {
      showSnackbar("Failed to update vendor!", "warning");
      showSnackbar("Failed to update vendor!", "warning");
      console.error("Error updating vendor:", error);
    }
  };

  const handleDeleteConfirmation = async () => {
    if (!selectedVendor) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${selectedVendor._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete certificate");
      }

      setVendors((prevVendors) =>
        prevVendors.filter((vendor) => vendor._id !== selectedVendor._id)
      );

      showSnackbar("Vendor deleted successfully!", "success");
      setDeleteModalOpen(false);
      console.log("Deleted vendor:", selectedVendor);
    } catch (error) {
      showSnackbar("Failed to delete vendor!", "warning");
      console.error("Error deleting vendor:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Vendor Management | E-Verify Portal | Technotran Solutions</title>
        <meta name="description" content="Administrative dashboard to manage vendor organizations in the E-Verify Portal certificate verification system." />
        <meta name="keywords" content="vendor management, organization administration, e-verify portal, certificate verification, technotran solutions" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://e-verify-portal.com/view-vendors" />
      </Head>
      
      <main id="E-Verify Vendor Page">
        {/* Show the LoginModal if user is not authenticated */}
        {!adminUser && showModal && <LoginModal authParams="Admin" />}

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
              {filteredVendors.length === 0 ? (
                <p className={styles.noCertificates}>No certificates found.</p>
              ) : (
                <VendorsTable
                  vendors={filteredVendors}
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

        <EditVendorModal
          open={editModalOpen}
          onClose={handleEditModalClose}
          vendor={selectedVendor}
          onSave={handleSaveChanges}
        />

        <DeleteVendorModal
          open={deleteModalOpen}
          onClose={handleDeleteModalClose}
          vendor={selectedVendor}
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

export default VendorsPage;
