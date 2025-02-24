import { useVendor } from "@/context/VendorContext";
import Footer from "@/sections/Footer";
import { Certificate } from "@/utils/types";
import React, { useEffect, useState } from "react";
import styles from "../app/vendor-dashboard/page.module.css";
import Image from "next/image";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import VendorCertificatesTable from "./VendorCertificatesTable";

const VendorContent = () => {
  const { vendorUser } = useVendor();

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchCertificates = async () => {
    try {
      const encodedVendorOrg =
        vendorUser && encodeURIComponent(vendorUser.org.trim()); // 🔹 Encode the string

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/certificates/${encodedVendorOrg}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch certificates");
      }
      const data: Certificate[] = await response.json();
      setCertificates(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vendorUser && vendorUser.org) {
      fetchCertificates();
    }
  }, [vendorUser]); // ✅ Dependency ensures re-run when vendorUser changes

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
  );
};

export default VendorContent;
