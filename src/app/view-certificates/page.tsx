"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./page.module.css"; // Import the CSS module
import { Certificate } from "@/utils/types";
import AdminNav from "@/sections/AdminNav";
import Footer from "@/sections/Footer";

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
          {certificates.length === 0 ? (
            <p className={styles.noCertificates}>No certificates found.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Issue Date</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((certificate) => (
                  <tr key={certificate._id}>
                    <td>{certificate.name}</td>
                    <td>{certificate.type}</td>
                    <td>
                      {new Date(certificate.issueDate).toLocaleDateString()}
                    </td>
                    <td>
                      <Link
                        href={`/certificate/${certificate.certificateId}`}
                        className={styles.link}
                      >
                        View
                      </Link>
                    </td>
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

export default CertificatesPage;
