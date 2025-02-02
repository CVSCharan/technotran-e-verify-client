"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useVendor } from "@/context/VendorContext";
import LoginModal from "@/components/AuthModal";
import Image from "next/image";
import VendorNav from "@/sections/VendorNav";
import Footer from "@/sections/Footer";
import { Certificate } from "@/utils/types";
import Cookies from "js-cookie";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import VendorCertificatesTable from "@/components/VendorCertificatesTable";

const VendorDashboardPage = () => {
  const { vendorUser, showModal } = useVendor();

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [vendorOrg, setVendorOrg] = useState<string | null>("");

  // Pagination states
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/certificates/${vendorOrg}`
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

    const checkUserFromCookies = () => {
      const storedUser = Cookies.get("vendor_user");
      if (storedUser) {
        setVendorOrg(JSON.parse(storedUser).org);
      } else {
        setVendorOrg(null);
      }
    };

    checkUserFromCookies();
    fetchCertificates();
  }, []);

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

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Filter certificates based on search query and selected type
  const filteredCertificates = certificates.filter((certificate) =>
    certificate.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <main id="E-Verify Portal View Certificates">
        <VendorNav />
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
      <main id="E-Verify Portal View Certificates">
        <VendorNav />
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
    <main id="E-Verify Portal Vendor Dashboard">
      {/* Show the LoginModal if user is not authenticated */}
      {!vendorUser && showModal && <LoginModal authParams="Vendor" />}

      <VendorNav />
      <section className={styles.mainBody}>
        <div className={styles.landingSection}>
          <Image
            height={150}
            width={150}
            src={
              vendorUser?.orgPic ||
              "https://github.com/CVSCharan/Technotran_Assets/blob/main/Picture11.png?raw=true"
            }
            alt={vendorUser?.org || "Vendor Logo"}
            className={styles.logoImg}
            priority
          />
          <h2 className={styles.userName}>{vendorUser?.username}</h2>
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
            {filteredCertificates.length === 0 ? (
              <p className={styles.noCertificates}>No certificates found.</p>
            ) : (
              <VendorCertificatesTable
                certificates={filteredCertificates}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default VendorDashboardPage;
