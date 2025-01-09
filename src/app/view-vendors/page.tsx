"use client";

import AdminNav from "@/sections/AdminNav";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Footer from "@/sections/Footer";
import { Vendors } from "@/utils/types";

const VendorsPage = () => {
  const [vendors, setVendors] = useState<Vendors[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
    return <p className={styles.loading}>Loading vendors...</p>;
  }

  if (error) {
    return <p className={styles.error}>Error: {error}</p>;
  }

  return (
    <main id="E-Verify Vendor Page">
      <AdminNav />
      <section className={styles.mainBody}>
        <div className={styles.landingSection}>
          <h2 className={styles.heading}>E-Verify Portal Vendors</h2>
          {vendors.length === 0 ? (
            <p className={styles.noCertificates}>No certificates found.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor._id}>
                    <td>{vendor.name}</td>
                    <td>{vendor.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default VendorsPage;
