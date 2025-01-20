"use client";

import { useAdmin } from "@/context/AdminContext";
import AdminNav from "@/sections/AdminNav";
import { AdminUser } from "@/utils/types";
import React, { useEffect, useState } from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import Snackbar from "@mui/material/Snackbar";
import { AlertColor } from "@mui/material/Alert";
import Alert from "@mui/material/Alert";
import styles from "./page.module.css";
import Footer from "@/sections/Footer";
import LoginModal from "@/components/AdminAuthModal";
import AdminsTable from "@/components/AdminsTable";
import EditAdminsModal from "@/components/EditAdminsModal";
import DeleteAdminsModal from "@/components/DeleteAdminsModal";
import Cookies from "js-cookie";

const ViewAdminsPage = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  // Pagination states
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState<string>("");
  // const [selectedType, setSelectedType] = useState<string>("All");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");

  const { adminUser, showModal } = useAdmin();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        // ✅ Retrieve user from cookies
        const userCookie = Cookies.get("admin_user");

        if (!userCookie) {
          throw new Error("Authentication token not found in cookies");
        }

        const user = JSON.parse(userCookie);
        const token = user?.token;

        if (!token) {
          throw new Error("Token missing in stored user data");
        }

        const response = await fetch(`${apiUrl}/admins`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Send the token
          },
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Error ${response.status}: ${errorMessage}`);
        }

        const data: AdminUser[] = await response.json();
        setAdmins(data);
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

    fetchAdmins();
  }, []);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
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

  const handleEditClick = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setDeleteModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedAdmin(null);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setSelectedAdmin(null);
  };

  // Filter admins based on search query
  const filteredAdmins = admins.filter((admin) =>
    admin?.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showSnackbar = (message: string, severity: AlertColor) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const API_BASE_URL = `${[process.env.NEXT_PUBLIC_API_URL]}/admins`; // Replace with actual backend URL

  const handleSaveChanges = async (updatedAdmin: AdminUser) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${updatedAdmin._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedAdmin),
      });

      if (!response.ok) {
        throw new Error("Failed to update admin");
      }

      const data = await response.json();

      setAdmins((prevAdmins) =>
        prevAdmins.map((admn) => (admn._id === updatedAdmin._id ? data : admn))
      );

      showSnackbar("User updated successfully!", "success");
      console.log("Updated user:", data);
    } catch (error) {
      showSnackbar("Failed to update user!", "warning");
      showSnackbar("Failed to update user!", "warning");
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteConfirmation = async () => {
    if (!selectedAdmin) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${selectedAdmin._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setAdmins((prevAdmins) =>
        prevAdmins.filter((admn) => admn._id !== selectedAdmin._id)
      );

      showSnackbar("User deleted successfully!", "success");
      setDeleteModalOpen(false);
      console.log("Deleted sser:", selectedAdmin);
    } catch (error) {
      showSnackbar("Failed to delete user!", "warning");
      console.error("Error deleting user:", error);
    }
  };

  if (loading) {
    return (
      <main id="E-Verify Portal View Admins">
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
      <main id="E-Verify Portal View Admins">
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

  return (
    <main id="E-Verify Portal View Admins">
      {/* Show the LoginModal if user is not authenticated */}
      {!adminUser && showModal && <LoginModal />}

      <AdminNav />
      <section>
        <div className={styles.landingSection}>
          <h2 className={styles.heading}>E-Verify Portal Users</h2>
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
            {filteredAdmins.length === 0 ? (
              <p className={styles.noCertificates}>No certificates found.</p>
            ) : (
              <AdminsTable
                admins={filteredAdmins}
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

      <EditAdminsModal
        open={editModalOpen}
        onClose={handleEditModalClose}
        admin={selectedAdmin}
        onSave={handleSaveChanges}
      />

      <DeleteAdminsModal
        open={deleteModalOpen}
        onClose={handleDeleteModalClose}
        admin={selectedAdmin}
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
  );
};

export default ViewAdminsPage;
