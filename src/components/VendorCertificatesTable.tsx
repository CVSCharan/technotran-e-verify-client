import { VendorCertificatesTableProps } from "@/utils/types";
import Link from "next/link";
import React from "react";
import { TablePagination } from "@mui/material";
import styles from "../styles/CertificatesTable.module.css";
import Head from "next/head";

const VendorCertificatesTable: React.FC<VendorCertificatesTableProps> = ({
  certificates,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const displayedCertificates = certificates.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // SEO structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Table",
    "about": "Certificates issued by vendor organization",
    "description": "Table of certificates with details including name, type, department, and issue date"
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <div role="region" aria-label="Certificates table" tabIndex={0}>
        <table className={styles.table} aria-label="Vendor certificates">
          <caption className={styles.visuallyHidden}>List of certificates issued by the vendor</caption>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Type</th>
              <th scope="col">Department</th>
              <th scope="col">Issue Date</th>
            </tr>
          </thead>
          <tbody>
            {displayedCertificates.map((certificate) => (
              <tr key={certificate._id}>
                <td>
                  <Link
                    href={`/certificate/${certificate.certificateId}`}
                    className={styles.link}
                    aria-label={`View certificate for ${certificate.name}`}
                  >
                    {certificate.name}
                  </Link>
                </td>
                <td>{certificate.type}</td>
                <td>{certificate.department}</td>
                <td>{new Date(certificate.issueDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <TablePagination
          component="div"
          count={certificates.length}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[5, 7]}
          sx={{
            "& .MuiTablePagination-toolbar": {
              fontFamily: `"Quicksand", sans-serif`,
            },
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-input, & .MuiTablePagination-displayedRows":
              {
                fontFamily: `"Quicksand", sans-serif`,
              },
          }}
          aria-label="Table pagination controls"
        />
      </div>
    </>
  );
};

export default VendorCertificatesTable;
